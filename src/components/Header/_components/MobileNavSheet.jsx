"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MobileNavSheet() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseurl}/getcategory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_number: 1,
            limit: 16,
          }),
        });

        const data = await res.json();
        if (data?.details) {
          // Normalize categories
          const normalized = data.details.map((category) => ({
            id: category.category_id || category.id,
            name: category.category_name || category.name,
            image: category.category_image || category.image,
          }));
          setCategories(normalized);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* White Menu Button */}
      <SheetTrigger asChild>
        <button className="flex items-center justify-center cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            className="text-white"
            viewBox="0 0 120 60"
            width="26"
            height="26"
          >
            <rect width="60" height="7"></rect>
            <rect y="25" width="90" height="7"></rect>
            <rect y="50" width="120" height="7"></rect>
          </svg>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="p-0 w-full max-w-[70%] sm:max-w-md flex flex-col h-full overflow-hidden jost-text"
      >
        {/* Header */}
        <SheetHeader className="bg-primary border-b p-4 flex flex-row items-center justify-between shrink-0">
          <div className="flex justify-between ">
            <Link href="/" className="transition-opacity hover:opacity-80">
              {/* <img
                src="/logo/logo.png?height=24&width=auto"
                alt="KinMel Mandu Logo"
                className="h-9 w-auto"
              /> */}
              <h1 className="text-white font-semibold shadow-2xl text-2xl">
                E-COM
              </h1>
            </Link>
          </div>
        </SheetHeader>

        {/* Category List */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto pb-16 flex-1">
            <ul className="divide-y">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-800 text-sm font-medium">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
