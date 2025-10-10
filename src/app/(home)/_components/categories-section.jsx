"use client";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CategoriesSection({ categories }) {
  // Normalize category data structure
  const normalizeCategory = (category) => ({
    id: category.category_id || category.id,
    name: category.category_name || category.name,
    image: category.category_image || category.image,
  });

  const normalizedCategories = categories.map(normalizeCategory);

  return (
    <section className="w-full container max-w-7xl mx-auto px-4 py-2 sm:py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 noto-sans-text">
        <div className="text-left w-full">
          <h2 className="relative inline-block   text-2xl font-semibold text-primary pb-3">
            Categories
            {/* Stylish underline */}
            <span
              className="absolute left-0 bottom-0 h-[3px] w-full 
                       bg-gradient-to-r from-primary to-secondary rounded-full"
            ></span>
          </h2>
        </div>
      </div>

      {/* Desktop Grid - 8 columns */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-5  ">
        {normalizedCategories.slice(0, 10).map((category) => (
          <CategoryCard key={category.id} category={category} size="large" />
        ))}
      </div>

      {/* Tablet Grid - 5 columns */}
      <div className="hidden md:grid md:grid-cols-4 lg:hidden   gap-4    shadow-sm">
        {normalizedCategories.slice(0, 8).map((category) => (
          <CategoryCard key={category.id} category={category} size="medium" />
        ))}
      </div>

      {/* Mobile Grid - 3 columns */}
      <div className="grid grid-cols-2 md:hidden  gap-5 ">
        {normalizedCategories.slice(0, 6).map((category) => (
          <CategoryCard key={category.id} category={category} size="small" />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category, size = "medium" }) {
  const sizeClasses = {
    small: {
      container: "p-3 space-y-3",
      image: "w-full h-full",
      text: "text-xs",
    },
    medium: {
      container: "p-4 space-y-4",
      image: "w-full h-full",
      text: "text-sm",
    },
    large: {
      container: "p-4 space-y-4",
      image: "w-full h-full",
      text: "text-sm",
    },
  };

  const classes = sizeClasses[size];

  return (
    // <Link
    //   href={`/products?category=${category.id}`}
    //   key={category.category_id}
    //   className="flex flex-col items-center jost-text group cursor-pointer bg-white hover:bg-primary/5 space-y-4 p-3 sm:hover:scale-105 duration-200 transition ease-in-out border-1 hover:shadow-lg"
    // >
    //   {/* Category Circle */}

    //   <div className=" overflow-hidden bg-white/50 flex items-center justify-center">
    //     <img
    //       src={category.image || "/placeholder.svg"}
    //       alt={category.name}
    //       className="w-20 h-20 object-cover "
    //     />
    //   </div>

    //   {/* Category Name */}
    //   <span className="text-sm  text-center text-foreground group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2">
    //     {category.name}
    //   </span>
    // </Link>

    <Link
      href={`/products?category=${category.id}`}
      key={category.category_id}
      className="relative flex flex-col items-center group cursor-pointer 
             rounded-sm overflow-hidden border border-gray-200 
             bg-white p-2 shadow-sm transition-all duration-300 
             hover:shadow-xl hover:scale-105"
    >
      {/* Hover Background Fill */}
      <span
        className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent 
               translate-y-full group-hover:translate-y-0 transition-transform 
               duration-500 ease-in-out"
      />

      {/* Category Circle - Larger */}
      <div
        className="relative z-10 w-28 h-28 flex items-center justify-center 
               rounded-full bg-white border border-gray-200 overflow-hidden 
               shadow-md"
      >
        <img
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Category Name */}
      <span
        className="relative z-10 mt-4 text-base font-medium text-center 
               text-foreground group-hover:text-primary transition-colors 
               duration-300 leading-tight line-clamp-2"
      >
        {category.name}
      </span>

      {/* Bottom Accent Bar */}
      <span
        className="absolute bottom-0 left-0 h-1 w-0 bg-primary 
               group-hover:w-full transition-all duration-500"
      />
    </Link>
  );
}
