"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistItem } from "./wishlist-item";
import { useWishlist } from "@/app/(home)/_context/WishlistContext";
import Link from "next/link";

export function WishlistContent() {
  const { wishlist, wishlistCount, clearWishlist } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background jost-text">
        <div className="text-center px-4">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Start adding products you love to keep track of them for later.
          </p>
          <Link
            href="/products"
            className="bg-primary w-fit flex items-center justify-center gap-2 text-white px-3 py-2 rounded-md mx-auto"
          >
            <ShoppingBag className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background jost-text py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground">
            {wishlistCount} {wishlistCount === 1 ? "item" : "items"} saved for
            later
          </p>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {wishlist.map((item) => (
            <WishlistItem
              key={`${item.product_id}-${item.variant_id}`}
              item={item}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
