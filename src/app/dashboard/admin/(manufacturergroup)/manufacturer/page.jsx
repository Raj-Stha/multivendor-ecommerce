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
import ManufacturerList from "../../../../../components/admin/(manufacturergroup)/manufacturer/ManufacturerList";
import AddManufacturerForm from "../../../../../components/admin/(manufacturergroup)/manufacturer/form/AddManufacturerForm";

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

export default function Manufacturer() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryNotes, setCategoryNotes] = useState([]);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page_number: 1, total_pages: 1 });
  const [page, setPage] = useState(1);
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const getAllManu = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getmanufacturer`;
      const categoryRes = await getData(url, { page_number: page, limit });

      console.log(categoryRes);
      if (categoryRes) {
        setData(categoryRes.details || []);
        setMeta(categoryRes.hint || { page_number: page, total_pages: 1 });
      }
    } catch (error) {
      console.error("Error fetching manufacturer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getManuNotes = async () => {
    try {
      let url = `${baseUrl}/getmanufacturernotes`;
      const res = await getData(url, { page_number: page, limit });
      setCategoryNotes(res?.details || []);
    } catch (error) {
      console.error("Error fetching manufacturer notes:", error);
    }
  };

  useEffect(() => {
    getAllManu();
    getManuNotes();
  }, [page]);

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Categories
        </h2>
        <div className="flex gap-2">
          {/* Add Category */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4 hover:bg-primary hover:opacity-90">
                <PlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">Add Manufacturer</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Add New Manufacturer</DialogTitle>
              </DialogHeader>
              <AddManufacturerForm setIsOpen={setIsOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        <>
          <ManufacturerList
            data={data}
            categoryNotes={categoryNotes}
            meta={meta}
            page={page}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
}
