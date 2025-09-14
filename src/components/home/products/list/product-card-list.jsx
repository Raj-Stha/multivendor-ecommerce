"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, X, Plus, Minus, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
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

export function ProductCardList({ products, border = false }) {
  // Manage selected variant and quantity per product
  const [state, setState] = useState(
    products.map(() => ({
      selectedVariantIndex: 0,
      quantity: 1,
      isWishlisted: false,
    }))
  );

  if (!Array.isArray(products) || products.length === 0) return null;

  const handleVariantChange = (productIndex, variantIndex) => {
    setState((prev) =>
      prev.map((item, idx) =>
        idx === productIndex
          ? { ...item, selectedVariantIndex: variantIndex, quantity: 1 }
          : item
      )
    );
  };

  const handleQuantityChange = (productIndex, increment) => {
    setState((prev) =>
      prev.map((item, idx) => {
        if (idx !== productIndex) return item;
        const selectedVariant =
          products[productIndex].variants[item.selectedVariantIndex];
        const newQty = item.quantity + increment;
        if (newQty < 1 || newQty > selectedVariant.available_count) return item;
        return { ...item, quantity: newQty };
      })
    );
  };

  const toggleWishlist = (productIndex) => {
    setState((prev) =>
      prev.map((item, idx) =>
        idx === productIndex
          ? { ...item, isWishlisted: !item.isWishlisted }
          : item
      )
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-3">
      {products.map((product, productIndex) => {
        if (!product.variants?.length) return null;

        const { selectedVariantIndex, quantity, isWishlisted } =
          state[productIndex];
        const selectedVariant = product.variants[selectedVariantIndex];
        const discountedPrice = (
          selectedVariant.product_price -
          (selectedVariant.product_price * selectedVariant.product_discount) /
            100
        ).toFixed(2);

        return (
          <motion.div
            key={`${product.product_id}-${product.vendor_id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Dialog
              transition={{
                type: "spring",
                bounce: 0.05,
                duration: 0.5,
              }}
            >
              <div
                className={`w-full jost-text cursor-pointer flex flex-col h-full transition-all duration-300 hover:shadow-xl bg-white group overflow-hidden relative ${
                  border ? "border border-gray-300 rounded-none" : ""
                }`}
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    src={selectedVariant.featured_image || "/placeholder.svg"}
                    alt={product.product_name}
                    fill
                    className="object-contain transition-transform duration-500"
                  />
                  <DialogTrigger asChild>
                    <button className="absolute top-2 right-2 z-10 p-2 rounded-full shadow-md flex items-center justify-center bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 opacity-100 scale-100 md:opacity-0 md:scale-75 md:group-hover:opacity-100 md:group-hover:scale-100">
                      <Eye size={18} />
                    </button>
                  </DialogTrigger>
                </div>

                {/* Product Details */}
                <div className="p-4 flex-1 flex flex-col bg-white">
                  <Link href={`/products/${product.product_id}`}>
                    <h4 className="text-sm text-gray-800 font-normal line-clamp-2 hover:text-primary transition-colors">
                      {product.product_name}
                    </h4>
                  </Link>

                  <div className="mt-auto">
                    <p className="text-md text-primary">
                      Rs. {discountedPrice}
                    </p>
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

              {/* Dialog Content */}
              <DialogContainer className="flex items-center justify-center rounded-none">
                <DialogContent
                  style={{ borderRadius: "0px" }}
                  className="relative jost-text flex flex-col border dark:bg-black bg-white lg:w-[900px] w-[95%] max-h-[80vh] mx-auto overflow-hidden"
                >
                  <div className="sticky top-0 z-50 p-4 border-b bg-white dark:bg-black backdrop-blur-sm">
                    <DialogTitle className="text-2xl font-normal text-zinc-900 dark:text-zinc-50">
                      {product.product_name}
                    </DialogTitle>
                  </div>

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
                            In Stock: {selectedVariant.available_count} items
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
                                  onClick={() =>
                                    handleVariantChange(productIndex, index)
                                  }
                                >
                                  <p className="font-medium text-sm">
                                    {variant.variant_description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quantity */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Quantity:</h4>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(productIndex, -1)
                                }
                                disabled={quantity <= 1}
                                className="p-2 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(productIndex, 1)
                                }
                                disabled={
                                  quantity >= selectedVariant.available_count
                                }
                                className="p-2 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <span className="text-sm text-gray-500">
                              (Max: {selectedVariant.available_count})
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                          <Button
                            className="w-fit cursor-pointer"
                            size="lg"
                            disabled={selectedVariant.available_count === 0}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart ({quantity})
                          </Button>

                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => toggleWishlist(productIndex)}
                            className={`px-4 cursor-pointer ${
                              isWishlisted
                                ? "text-red-500 border-red-300 bg-red-50"
                                : ""
                            }`}
                          >
                            <Heart
                              size={20}
                              className={isWishlisted ? "fill-red-500" : ""}
                            />
                          </Button>
                        </div>

                        {selectedVariant.available_count === 0 && (
                          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                            <p className="text-red-600 text-sm font-medium">
                              This variant is currently out of stock
                            </p>
                          </div>
                        )}

                        {/* Total */}
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
          </motion.div>
        );
      })}
    </div>
  );
}
