"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import AccountMenu from "./AccountMenu";
import CartIcon from "./CartIcon";
import NotificationIcon from "./NotificationIcon";

export default function DesktopNav() {

  return (
    <div className="container max-w-7xl mx-auto py-4 px-4 md:px-6 nunito-text z-8">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <img
              src="/logo/logo.png"
              alt="KinMel Mandu Logo"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-xl justify-center">
          <SearchBar />
        </div>

        {/* Right: Account, Cart, Notifications */}
        <div className="flex items-center space-x-5 flex-shrink-0">
          <CartIcon />
          <NotificationIcon />
        </div>
      </div>
    </div>
  );
}
