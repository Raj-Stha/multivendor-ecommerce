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
    <section className="w-full container max-w-7xl mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 noto-sans-text">
        <div>
          <h2 className="text-2xl text-gray-900 mb-1">Categories</h2>
        </div>
      </div>

      {/* Desktop Grid - 8 columns */}
      <div className="hidden lg:grid lg:grid-cols-8    shadow-sm">
        {normalizedCategories.slice(0, 16).map((category) => (
          <CategoryCard key={category.id} category={category} size="large" />
        ))}
      </div>

      {/* Tablet Grid - 5 columns */}
      <div className="hidden md:grid md:grid-cols-5 lg:hidden     shadow-sm">
        {normalizedCategories.slice(0, 10).map((category) => (
          <CategoryCard key={category.id} category={category} size="medium" />
        ))}
      </div>

      {/* Mobile Grid - 3 columns */}
      <div className="grid grid-cols-3 md:hidden    shadow-sm">
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
    <Link
      href={`/products?category=${category.id}`}
      key={category.category_id}
      className="flex flex-col items-center jost-text group cursor-pointer bg-white space-y-4 p-3 border-1 hover:shadow-2xl"
    >
      {/* Category Circle */}

      <div className=" overflow-hidden bg-white/50 flex items-center justify-center">
        <img
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          className="w-20 h-20 object-cover "
        />
      </div>

      {/* Category Name */}
      <span className="text-sm  text-center text-foreground group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2">
        {category.name}
      </span>
    </Link>
  );
}
