"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogContainer,
} from "@/components/ui/layout/linear-dialog";
import { Button } from "@/components/ui/button";
import ProductGallery from "./ProductGallery";

export function ProductCard({ product }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (!product?.variants?.length) return null;

  const selectedVariant = product.variants[selectedVariantIndex];
  const discountedPrice = (
    selectedVariant.product_price -
    (selectedVariant.product_price * selectedVariant.product_discount) / 100
  ).toFixed(2);

  return (
    <Dialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.5,
      }}
    >
      {/* Product Card */}
      <div className="w-full jost-text cursor-pointer flex flex-col h-full transition-all duration-300 hover:shadow-xl bg-white group overflow-hidden relative">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={selectedVariant.featured_image || "/placeholder.svg"}
            alt={product.product_name}
            fill
            className="object-contain transition-transform duration-500"
          />

          {/* Quick View Button */}
          <div className="absolute top-2 right-2 z-10 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 md:block hidden">
            <DialogTrigger asChild>
              <button className="bg-gray-800 p-2 rounded-full shadow-md flex items-center justify-center text-white hover:bg-gray-700 transition-all duration-300">
                <Eye size={18} />
              </button>
            </DialogTrigger>
          </div>
          {/* Always visible on Mobile */}
          <div className="absolute top-2 right-2 z-10 md:hidden">
            <DialogTrigger asChild>
              <button className="bg-gray-700 p-2 rounded-full shadow-md flex items-center justify-center text-white hover:text-gray-500 transition-all duration-300">
                <Eye size={18} />
              </button>
            </DialogTrigger>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <Link href={`/product/${product.product_id}`}>
            <h4 className="text-sm text-gray-800 font-normal line-clamp-2 hover:text-primary transition-colors">
              {product.product_name}
            </h4>
          </Link>

          {/* Price */}
          <div className="mt-auto">
            <p className="text-md text-primary">Rs. {discountedPrice}</p>
            {selectedVariant.product_discount > 0 && (
              <div className="flex gap-2">
                <p className="text-xs line-through text-gray-400">
                  Rs. {selectedVariant.product_price}
                </p>
                <p className="text-xs text-black">
                  -{selectedVariant.product_discount}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <DialogContainer className="flex items-center justify-center rounded-none">
        <DialogContent
          style={{ borderRadius: "0px" }}
          className="relative jost-text flex flex-col border dark:bg-black bg-white lg:w-[900px] w-[95%] max-h-[70vh] mx-auto overflow-y-auto"
        >
          {/* Price at the top */}
          <div className="p-2 border-b">
            <DialogTitle className="text-2xl font-normal text-zinc-900 dark:text-zinc-50 ">
              {product.product_name}
            </DialogTitle>
          </div>

          {/* Gallery + Variants */}
          <div className="grid sm:grid-cols-2 gap-6 p-6">
            {/* Left - Gallery */}
            <ProductGallery
              variants={product.variants}
              selectedVariantIndex={selectedVariantIndex}
            />

            {/* Right - Variants + Actions */}
            <div className="space-y-6">
              <div>
                {/* Price Section */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-normal text-primary">
                      Rs. {discountedPrice}
                    </span>
                    {selectedVariant.product_discount > 0 && (
                      <>
                        <span className="text-lg line-through text-muted-foreground">
                          Rs. {selectedVariant.product_price}
                        </span>
                        <div>-{selectedVariant.product_discount}%</div>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-green-600">
                    In Stock: {selectedVariant.available_count} items available
                  </p>
                </div>
              </div>

              {/* Variant Selection */}
              {product.variants.length > 1 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Available Variants:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {product.variants.map((variant, index) => {
                      const variantDiscountedPrice = (
                        variant.product_price -
                        (variant.product_price * variant.product_discount) / 100
                      ).toFixed(2);

                      return (
                        <div
                          key={variant.variant_id}
                          className={`p-3 w-fit  border rounded-lg cursor-pointer transition-all ${
                            selectedVariantIndex === index
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedVariantIndex(index)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm">
                                {variant.variant_description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button className=" w-fit" size="lg">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <DialogClose className="absolute top-4 right-4 text-white dark:bg-gray-900 bg-gray-600 px-2 py-2 hover:bg-gray-500 rounded-full">
            <X size={12} />
          </DialogClose>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
