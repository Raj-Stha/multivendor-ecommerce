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
// import SkeletonLoader from "../../../admin/_components/SkeletonLoader";

export default function CategoryAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const limit = 10;
  const formData = {
    page_number: page,
    limit: limit,
  };

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const getAllCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/getcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const result = await res.json();
        setData(result?.details || []);

        setHasNextPage(result.details.length === limit);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, [page]);

  return (
    <div className="container max-w-7xl  mx-auto px-[2%] py-[2%] ">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Categories
        </h2>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4  hover:bg-primary hover:opacity-90 cursor-pointer transition">
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
        </div>
      </div>
      {isLoading
        ? ""
        : // <SkeletonLoader count={8} />
          data && (
            <CategoryList
              data={data}
              setData={setData}
              page={page}
              setPage={setPage}
              hasNextPage={hasNextPage}
            />
          )}
    </div>
  );
}
