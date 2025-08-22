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
import CategoryList from "../../../../../components/admin/(categorygroup)/category/CategoryList";
import AddCatgeoryForm from "../../../../../components/admin/(categorygroup)/category/form/AddCategoryForm";
import AddCategoryDetailsForm from "../../../../../components/admin/(categorygroup)/category/form/AddCategoryDetailsForm";
import CategoryListSkeleton from "../../../../../components/admin/Skeleton/CategooryListSkeleton";

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
      console.error("Failed to fetch categories");
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function CategoryAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [categoryNotes, setCategoryNotes] = useState([]);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page_number: 1, total_pages: 1 });
  const [page, setPage] = useState(1);
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getcategory`;
      const categoryRes = await getData(url, { page_number: page, limit });

      if (categoryRes) {
        setData(categoryRes.details || []);
        setMeta(categoryRes.hint || { page_number: page, total_pages: 1 });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryNotes = async () => {
    try {
      let url = `${baseUrl}/getcategorynotes`;
      const res = await getData(url, { page_number: page, limit: 0 });
      setCategoryNotes(res?.details || []);
    } catch (error) {
      console.error("Error fetching category notes:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
    getCategoryNotes();
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
                <span className="hidden md:inline">Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <AddCatgeoryForm setIsOpen={setIsOpen} />
            </DialogContent>
          </Dialog>

          {/* Add Category Details */}
          {/* <Dialog open={isCatOpen} onOpenChange={setIsCatOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4 hover:bg-primary hover:opacity-90">
                <PlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">Add Category Details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Add New Category Details</DialogTitle>
              </DialogHeader>
              <AddCategoryDetailsForm
                setIsOpen={setIsCatOpen}
                categoryNotes={categoryNotes}
                category={data}
              />
            </DialogContent>
          </Dialog> */}
        </div>
      </div>

      {isLoading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        <>
          <CategoryList
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
