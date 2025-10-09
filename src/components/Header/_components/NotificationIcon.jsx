"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/app/(home)/_context/WishlistContext";

export default function NotificationIcon() {
  const { wishlistCount } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="flex flex-col items-center justify-center  group  rounded-md transition-colors text-gray-800 hover:text-primary md:hover:text-white"
    >
      <div className="relative">
        <Heart className="h-6 w-6 text-gray-800 sm:text-primary hover:text-primary group-hover:text-secondary md:hover:text-secondary transition-colors" />
        {wishlistCount > 0 && (
          <span className="absolute -top-3 -right-2 bg-primary border-primary  text-white text-xs group-hover:bg-secondary  group-hover:text-white  rounded-full h-5 w-5 flex items-center justify-center nunito-text font-medium">
            {wishlistCount}
          </span>
        )}
      </div>
      <span className="text-xs font-semibold sm:hidden">Wishlist</span>
    </Link>
  );
}
