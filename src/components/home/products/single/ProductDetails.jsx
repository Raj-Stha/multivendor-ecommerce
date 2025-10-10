"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductGallery from "@/components/home/products/list/ProductGallery";
import Link from "next/link";
import { useCart } from "@/app/(home)/_context/CartContext";
import { useWishlist } from "@/app/(home)/_context/WishlistContext";

export default function ProductDetails({ product }) {
  const firstProduct = Array.isArray(product) ? product[0] : product;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { wishlist, toggleWishlistItem } = useWishlist();

  const { updateCart } = useCart();

  if (!firstProduct?.variants?.length) return null;

  const selectedVariant = firstProduct.variants[selectedVariantIndex];
  const discountedPrice = (
    selectedVariant.product_price -
    (selectedVariant.product_price * selectedVariant.product_discount) / 100
  ).toFixed(2);

  const handleQuantityIncrement = () => {
    if (quantity < selectedVariant.available_count)
      setQuantity((prev) => prev + 1);
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
    setQuantity(1);
  };

  // Inside ProductDetails component

  const isWishlisted = wishlist.some(
    (item) =>
      item.product_id === firstProduct.product_id &&
      item.variant_id === selectedVariant.variant_id
  );

  const handleWishlistToggle = () => {
    toggleWishlistItem(
      firstProduct.product_id,
      selectedVariant.variant_id,
      firstProduct.vendor_id
    );
  };

  const handleAddToCart = () => {
    updateCart({
      product_id: firstProduct.product_id,
      vendor_id: firstProduct.vendor_id,
      variant_id: selectedVariant.variant_id,
      order_count: quantity,
      type: "add",
    });
  };

  return (
    <div className="min-h-screen bg-background jost-text">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
          <span className="text-foreground">{firstProduct.product_name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
          <h1 className="inline-block md:hidden text-3xl font-bold text-foreground  text-balance">
            {firstProduct.product_name}
          </h1>
          {/* Left Column - Gallery */}
          <ProductGallery
            variants={firstProduct.variants}
            selectedVariantIndex={selectedVariantIndex}
          />

          {/* Right Column - Product Info */}
          <div className="space-y-4">
            {/* Product Header */}
            <div>
              <div className="flex gap-0 mb-3">
                <Badge
                  variant="outline"
                  className="text-sm bg-primary/90 rounded-none text-white"
                >
                  {firstProduct.category_name}
                </Badge>
                <Badge variant="outline" className="text-sm rounded-none">
                  By {firstProduct.vendor_name}
                </Badge>
              </div>
              <h1 className="hidden md:block text-3xl font-bold text-foreground mb-2 text-balance">
                {firstProduct.product_name}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                {firstProduct.product_details?.product_description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                Rs. {discountedPrice}
              </span>
              {selectedVariant.product_discount > 0 && (
                <>
                  <span className="text-lg line-through  text-red-600">
                    Rs. {selectedVariant.product_price}
                  </span>
                  <span className="bg-gray-100 text-green-600 text-sm px-2 py-1 rounded">
                    -{selectedVariant.product_discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {firstProduct.variants.length > 1 && (
              <div>
                <h3 className="font-semibold text-lg pt-2 mb-2">
                  Available Options:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {firstProduct.variants.map((variant, index) => (
                    <div
                      key={variant.variant_id}
                      className={`cursor-pointer px-3 py-2 border rounded-md transition-all ${
                        selectedVariantIndex === index
                          ? "border-none bg-gray-500 text-white"
                          : "hover:bg-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleVariantChange(index)}
                    >
                      {variant.variant_description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-lg pt-2 mb-2">Quantity:</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    size="icon"
                    onClick={handleQuantityDecrement}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none cursor-pointer bg-gray-500 hover:bg-secondary"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 border-x border-border min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    onClick={handleQuantityIncrement}
                    disabled={quantity >= selectedVariant.available_count}
                    className="h-10 w-10  cursor-pointer rounded-none bg-gray-500 hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-green-900">
                  (Max: {selectedVariant.available_count})
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mb-8 flex gap-3">
              <Button
                size="lg"
                className="flex items-center hover:bg-secondary cursor-pointer gap-2"
                disabled={selectedVariant.available_count === 0}
                onClick={handleAddToCart} // ✅ add to cart handler
              >
                <ShoppingCart className="w-5 h-5" />
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
                      ? "fill-white stroke-white"
                      : "fill-white/0 stroke-red-500"
                  }
                />
              </Button>
            </div>

            {selectedVariant.available_count === 0 && (
              <div className="border border-destructive bg-destructive/10 p-3 rounded text-center text-destructive font-medium">
                This variant is currently out of stock
              </div>
            )}

            {/* Total */}
            <div className="bg-muted p-3 rounded">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  Rs. {(Number(discountedPrice) * quantity).toFixed(2)}
                </span>
              </div>
              {quantity > 1 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Rs. {discountedPrice} × {quantity} items
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                + Rs. {firstProduct.total_tax} tax
              </p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12">
          <Separator className="mb-4" />
          <div className="border rounded p-4">
            <h3 className="font-bold text-lg mb-4">Product Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {firstProduct.product_details &&
                Object.entries(firstProduct.product_details)
                  .filter(
                    ([key, value]) =>
                      value !== null && key !== "product_description"
                  )
                  .map(([key, value]) => {
                    const label = key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");

                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center border-b last:border-b-0 pb-2"
                      >
                        <span className="text-muted-foreground font-medium">
                          {label}
                        </span>
                        <span className="text-foreground">{value}</span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
