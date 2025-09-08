"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ProductNoteList from "./productnote-list";
import AddProductNotesForm from "./form/AddProductNotesForm";
import { useState } from "react";

export default function ProductNotesAdmin({
  initialData,
  initialMeta,
  initialPage,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Product Notes
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4 hover:bg-primary hover:opacity-90 cursor-pointer transition">
              <PlusIcon className="w-5 h-5" />
              <span className="hidden md:inline">Add Product Notes</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle>Add New Product Notes</DialogTitle>
            </DialogHeader>
            <AddProductNotesForm setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <ProductNoteList
        data={initialData}
        page={initialPage}
        setPage={handlePageChange}
        meta={initialMeta}
      />
    </div>
  );
}
