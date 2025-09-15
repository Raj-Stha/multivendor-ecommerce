"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CategoryListSkeleton from "../../../../../components/admin/Skeleton/CategooryListSkeleton";
import PromoList from "../../../../../components/admin/(promogroup)/promo/PromoList";
import AddPromoForm from "../../../../../components/admin/(promogroup)/promo/form/AddPromoForm";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      console.error("Failed to fetch manufacturer");
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function Promo() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [promoNotes, setPromoNotes] = useState([]);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page_number: 1, total_pages: 1 });
  const [page, setPage] = useState(1);
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const getAllPromo = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getpromos`;
      const promoRes = await getData(url, { page_number: page, limit });

      console.log(promoRes);
      if (promoRes) {
        setData(promoRes.details || []);
        setMeta(promoRes.hint || { page_number: page, total_pages: 1 });
      }
    } catch (error) {
      console.error("Error fetching promo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPromoNotes = async () => {
    try {
      let url = `${baseUrl}/getpromosnotes`;
      const res = await getData(url, { page_number: page, limit });
      setPromoNotes(res?.details || []);
    } catch (error) {
      console.error("Error fetching promo notes:", error);
    }
  };

  useEffect(() => {
    getAllPromo();
    getPromoNotes();
  }, [page]);

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Promos</h2>
        <div className="flex gap-2">
          {/* Add Category */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4 hover:bg-primary hover:opacity-90">
                <PlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">Add Promo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Add New Promo</DialogTitle>
              </DialogHeader>
              <AddPromoForm setIsOpen={setIsOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        <>
          <PromoList
            data={data}
            promoNotes={promoNotes}
            meta={meta}
            page={page}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
}
