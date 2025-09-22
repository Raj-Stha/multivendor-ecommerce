"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/app/(home)/_context/WishlistContext";

export default function NotificationIcon() {
  const { wishlistCount } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md transition-colors text-gray-800 hover:text-primary md:hover:text-white"
    >
      <div className="relative">
        <Heart className="h-6 w-6 text-primary sm:text-white hover:text-primary md:hover:text-white transition-colors" />
        {wishlistCount > 0 && (
          <span className="absolute -top-3 -right-2 bg-white border-primary text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center nunito-text font-medium">
            {wishlistCount}
          </span>
        )}
      </div>
      <span className="text-xs font-semibold sm:hidden">Wishlist</span>
    </Link>
  );
}
