"use client";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/(home)/_context/CartContext";
import { useWishlist } from "@/app/(home)/_context/WishlistContext";
import { useState, useEffect } from "react";

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlistItem } = useWishlist();
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );

  useEffect(() => {
    if (
      product?.variants?.[0] &&
      selectedVariant?.variant_id !== product.variants[0].variant_id
    ) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (
    !product ||
    !product.variants ||
    product.variants.length === 0 ||
    !selectedVariant
  ) {
    return null;
  }

  const productData = {
    id: selectedVariant.variant_id,
    name: product.product_name,
    image: selectedVariant.featured_image,
    price: selectedVariant.product_price,
    discount: selectedVariant.product_discount,
    stock: selectedVariant.available_count,
    variantDetail: selectedVariant.variant_detail,
  };

  const inStock = selectedVariant.available_count > 0;
  const discountedPrice = (
    selectedVariant.product_price -
    (selectedVariant.product_price * selectedVariant.product_discount) / 100
  ).toFixed(2);
  const isInWishlist = wishlist.some((item) => item.id === productData.id);

  return (
    <div
      key={selectedVariant.variant_id} // 🔄 Re-render card on variant change
      className="w-full border border-gray-200 shadow-md cursor-pointer overflow-hidden flex flex-col rounded-none h-full transition-all duration-300 hover:shadow-2xl hover:border-gray-200 group"
    >
      {/* Image Section */}
      <div className="relative w-full h-40 bg-white overflow-hidden">
        {selectedVariant.product_discount > 0 && (
          <div className="absolute top-0 left-0 bg-[#eb6533] text-white text-xs font-semibold px-2 py-1 rounded-br-lg shadow z-20 nunito-text">
            {selectedVariant.product_discount}% OFF
          </div>
        )}
        <Image
          src={
            selectedVariant.featured_image ||
            "/placeholder.svg?height=160&width=200&query=product image"
          }
          alt={product.product_name}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
        />
        {/* Hover Buttons for Desktop */}
        <div className="absolute inset-0 items-end justify-center bg-black/50 text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 hidden md:flex">
          <div className="flex gap-2 mb-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlistItem(productData);
              }}
              className={`rounded-full p-2 shadow-lg transition-colors cursor-pointer duration-300 ${
                isInWishlist
                  ? "bg-primary text-white"
                  : "bg-white text-primary border border-primary"
              }`}
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(productData, 1);
              }}
              className={`rounded-full p-2 bg-primary/80 hover:bg-primary cursor-pointer text-white font-medium shadow-sm duration-300 ${
                !inStock ? "opacity-50 cursor-not-allowed" : ""
              } flex gap-2`}
              disabled={!inStock}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="absolute bottom-2 right-2 flex gap-2 md:hidden">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlistItem(productData);
            }}
            className={`rounded-full p-2 shadow-lg ${
              isInWishlist
                ? "bg-primary text-white"
                : "bg-white text-primary border border-primary"
            }`}
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(productData, 1);
            }}
            className={`rounded-full p-2 ${
              inStock
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
            disabled={!inStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col cursor-pointer">
        <Link href={`/product/${product.product_id}`}>
          <h4 className="text-md font-semibold text-primary line-clamp-1 source-serif-text">
            {product.product_name}
          </h4>
        </Link>

        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <div className="mt-2 mb-4 flex overflow-x-auto gap-2 scrollbar-hide nunito-text">
            {product.variants.map((variant) => (
              <button
                key={variant.variant_id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariant(variant);
                }}
                className={`rounded-md px-3 py-1 text-xs whitespace-nowrap transition-all duration-200 ${
                  selectedVariant.variant_id === variant.variant_id
                    ? "bg-primary text-white"
                    : "border border-gray-300 text-primary"
                }`}
                aria-pressed={selectedVariant.variant_id === variant.variant_id}
              >
                {variant.variant_detail}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto nunito-text">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm font-bold text-gray-800">
              Rs. {discountedPrice}
            </p>
            {selectedVariant.product_discount > 0 && (
              <p className="text-sm line-through text-gray-600">
                Rs. {selectedVariant.product_price}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
