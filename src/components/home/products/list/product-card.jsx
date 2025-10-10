"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, X, Heart } from "lucide-react";
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
import { useWishlist } from "@/app/(home)/_context/WishlistContext";
import { useCart } from "@/app/(home)/_context/CartContext";

export function ProductCard({ product, border = false }) {
  const { wishlist, toggleWishlistItem } = useWishlist();

  const { updateCart } = useCart();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product?.variants?.length) return null;

  const selectedVariant = product.variants[selectedVariantIndex];
  const discountedPrice = (
    selectedVariant.product_price -
    (selectedVariant.product_price * selectedVariant.product_discount) / 100
  ).toFixed(2);

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
    setQuantity(1);
  };

  const isWishlisted = wishlist.some(
    (item) =>
      item.product_id === product.product_id &&
      item.variant_id === selectedVariant.variant_id
  );

  const handleWishlistToggle = () => {
    toggleWishlistItem(
      product.product_id,
      selectedVariant.variant_id,
      product.vendor_id
    );
  };

  const handleAddToCart = () => {
    updateCart({
      product_id: product.product_id,
      vendor_id: product.vendor_id,
      variant_id: selectedVariant.variant_id,
      order_count: quantity,
      type: "add",
    });
  };

  return (
    <Dialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.5,
      }}
    >
      {/* Product Card */}
      <div
        className={`w-full jost-text cursor-pointer flex flex-col h-full rounded-sm md:hover:scale-105 transition-all duration-300 hover:shadow-xl bg-white group overflow-hidden relative ${
          border ? "border border-gray-300 rounded-none" : ""
        }`}
      >
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Link href={`/products/${product.vendor_id}/${product.product_id}`}>
            <Image
              src={selectedVariant.featured_image || "/placeholder.svg"}
              alt={product.product_name}
              fill
              className="object-contain transition-transform duration-500"
            />
          </Link>

          <DialogTrigger asChild>
            <button
              className="absolute top-2 right-2 z-10 p-2 rounded-full shadow-md flex items-center justify-center
               bg-primary text-white hover:bg-secondary transition-all duration-300
               opacity-100 scale-100 
               md:opacity-0 md:scale-75 md:group-hover:opacity-100 md:group-hover:scale-100"
            >
              <Eye size={18} />
            </button>
          </DialogTrigger>
        </div>

        {/* Content */}
        <Link
          href={`/products/${product.vendor_id}/${product.product_id}`}
          className="p-4 flex-1 flex flex-col bg-white"
        >
          <h4 className="text-sm text-black font-normal line-clamp-2 hover:text-primary transition-colors">
            {product.product_name}
          </h4>

          {/* Price */}
          <div className="mt-auto">
            <p className="text-md text-primary font-medium">
              Rs. {discountedPrice}
            </p>
            {selectedVariant.product_discount > 0 && (
              <div className="flex gap-2">
                <p className="text-xs line-through text-gray-400">
                  Rs. {selectedVariant.product_price}
                </p>
                <p className="text-xs text-secondary">
                  -{selectedVariant.product_discount}%
                </p>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      <DialogContainer className="flex items-center justify-center rounded-none">
        <DialogContent
          style={{ borderRadius: "0px" }}
          className="relative jost-text flex flex-col border dark:bg-black bg-white lg:w-[900px] w-[95%] max-h-[80vh] mx-auto overflow-hidden"
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-50 p-4 border-b bg-white dark:bg-black backdrop-blur-sm">
            <Link
              href={`/products/${product.vendor_id}/${product.product_id}`}
              className="text-2xl font-normal text-primary dark:text-zinc-50"
            >
              {product.product_name}
            </Link>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            <div className="grid sm:grid-cols-2 gap-6 p-6">
              <ProductGallery
                variants={product.variants}
                selectedVariantIndex={selectedVariantIndex}
              />

              <div className="space-y-6">
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
                        <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                          -{selectedVariant.product_discount}%
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-green-600">
                    In Stock: {selectedVariant.available_count} items available
                  </p>
                </div>

                {/* Variant Selection */}
                {product.variants.length > 1 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">
                      Available Variants:
                    </h4>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 md:gap-2">
                      {product.variants.map((variant, index) => (
                        <div
                          key={variant.variant_id}
                          className={`p-3 w-fit border rounded-lg cursor-pointer transition-all ${
                            selectedVariantIndex === index
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleVariantChange(index)}
                        >
                          <p className="font-medium text-sm">
                            {variant.variant_description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="w-fit cursor-pointer"
                    size="lg"
                    disabled={selectedVariant.available_count === 0}
                    onClick={handleAddToCart} // ✅ hook up addToCart
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart ({quantity})
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleWishlistToggle}
                    className={`px-4 cursor-pointer transition-colors ${
                      isWishlisted
                        ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                        : "bg-white text-red-500 border-red-300 hover:bg-red-50"
                    }`}
                  >
                    <Heart
                      size={20}
                      className={
                        isWishlisted
                          ? "fill-white"
                          : "fill-white/0 stroke-red-500"
                      }
                    />
                  </Button>
                </div>

                {/* Total Price Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-xl font-bold text-primary">
                      Rs. {(discountedPrice * quantity).toFixed(2)}
                    </span>
                  </div>
                  {quantity > 1 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Rs. {discountedPrice} × {quantity} items
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogClose className="absolute top-4 right-4 text-white dark:bg-gray-900 bg-gray-600 px-2 py-2 hover:bg-gray-500 rounded-full z-50">
            <X size={12} />
          </DialogClose>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
