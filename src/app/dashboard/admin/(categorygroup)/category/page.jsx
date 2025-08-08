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
// import SkeletonLoader from "../../../admin/_components/SkeletonLoader";

async function getData(url, formData) {
  try {
    console.log(formData);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      return console.error("Failed to fetch categories");
    }

    return await res.json();
  } catch (error) {
    return console.error("Error fetching data:", error);
  }
}
export default function CategoryAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [category, setCategory] = useState();
  const [categoryNotes, setCategoryNotes] = useState();
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
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getcategory`;
      const categoryRes = await getData(url, formData);

      const categories = categoryRes?.details || [];
      setCategory(categories);

      // Fetch details for each category
      const categoryWithDetails = await Promise.all(
        categories.map(async (category) => {
          const detailUrl = `${baseUrl}/getcategorydetails`;
          const detailBody = { category_id: category.category_id };

          const detailsRes = await getData(detailUrl, detailBody);
          const details = detailsRes?.details || [];

          return {
            ...category,
            details, // add details to each category
          };
        })
      );

      setData(categoryWithDetails);
      setHasNextPage(categories.length === limit);
    } catch (error) {
      console.error("Error fetching categories or details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryNotes = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getcategorynotes`;
      const res = await getData(url, formData);
      setCategoryNotes(res?.details || []);
    } catch (error) {
      console.error("Error fetching categories or details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
    getCategoryNotes();
  }, [page]);

  console.log(categoryNotes);

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

          <Dialog open={isCatOpen} onOpenChange={setIsCatOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4  hover:bg-primary hover:opacity-90 cursor-pointer transition">
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
          </Dialog>
        </div>
      </div>
      {isLoading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        data && (
          <CategoryList
            data={data}
            setData={setData}
            categoryNotes={categoryNotes}
            page={page}
            setPage={setPage}
            hasNextPage={hasNextPage}
          />
        )
      )}
    </div>
  );
}
