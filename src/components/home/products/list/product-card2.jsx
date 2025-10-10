"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

export function ProductCard({ product, border = false }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (!product?.variants?.length) return null;

  const selectedVariant = product.variants[selectedVariantIndex];
  const discountedPrice = (
    selectedVariant.product_price -
    (selectedVariant.product_price * selectedVariant.product_discount) / 100
  ).toFixed(2);

  return (
    <div
      className={`group w-full jost-text cursor-pointer items-center flex flex-row h-full transition-all duration-300 hover:shadow-md hover:scale-105 bg-primary/10 overflow-hidden relative ${
        border ? "border border-gray-300 rounded-sm" : ""
      }`}
    >
      {/* Image */}
      <div className="w-1/3 relative aspect-square bg-primary overflow-hidden">
        <Link href={`/products/${product.vendor_id}/${product.product_id}`}>
          <Image
            src={selectedVariant.featured_image || "/placeholder.svg"}
            alt={product.product_name}
            fill
            className="object-contain transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Content */}
      <Link
        href={`/products/${product.vendor_id}/${product.product_id}`}
        className="w-2/3 p-1 sm:p-2 shadow-2xl  flex-1 flex flex-col bg-white"
      >
        <h4 className="text-lg text-gray-800 font-normal line-clamp-1 hover:text-primary transition-colors">
          {product.product_name}
        </h4>

        {/* Price */}
        <div className="mt-auto">
          {selectedVariant.product_discount > 0 && (
            <div className="flex  gap-1 md:gap-2 items-baseline">
              <p className="text-[10px] md:text-xs line-through text-gray-400">
                Rs. {selectedVariant.product_price}
              </p>
              <p className="text-sm md:text-base text-primary">
                Rs. {discountedPrice}
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
