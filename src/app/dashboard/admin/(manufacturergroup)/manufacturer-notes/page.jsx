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
import ManufacturerNoteList from "../../../../../components/admin/(manufacturergroup)/manufacturer-notes/ManufacturerNoteList";

import AddManufacturerNotesForm from "../../../../../components/admin/(manufacturergroup)/manufacturer-notes/form/AddManufacturerNotesForm";
import CategoryListSkeleton from "../../../../../components/admin/Skeleton/CategooryListSkeleton";
// import SkeletonLoader from "../../../admin/_components/SkeletonLoader";
export default function ManufacturerNotes() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page_number: 1, total_pages: 1 });
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const getAllManuNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/getmanufacturernotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page_number: page, limit }),
      });
      if (res.ok) {
        const result = await res.json();
        console.log(result);
        setData(result?.details || []);
        setMeta(result?.hint || { page_number: page, total_pages: 1 });
      } else {
        console.error("Failed to fetch manufacturer");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllManuNotes();
  }, [page]);

  return (
    <div className="container max-w-7xl  mx-auto px-[2%] py-[2%] ">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Manufacturer Notes
        </h2>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4  hover:bg-primary hover:opacity-90 cursor-pointer transition">
                <PlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">Add Manufacturer Notes</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Add New Manufacturer Notes</DialogTitle>
              </DialogHeader>
              <AddManufacturerNotesForm setIsOpen={setIsOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {isLoading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        data && (
          <ManufacturerNoteList
            data={data}
            setData={setData}
            page={page}
            setPage={setPage}
            meta={meta}
          />
        )
      )}
    </div>
  );
}
