"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import AccountMenu from "./AccountMenu";
// import LanguageSelector from "./LanguageSelector"; // Not used in provided code
import MobileNavSheet from "./MobileNavSheet";
import CartIcon from "./CartIcon";
import NotificationIcon from "./NotificationIcon";

export default function MobileNav() {
  return (
    <div className="px-4 py-2 flex flex-col gap-2 jost-text bg-primary">
      <div className="flex justify-between items-center">
        <MobileNavSheet />
        <div className="flex gap-4">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <div>
              <img
                src="/logo/logo.png?height=24&width=auto"
                alt="KinMel Mandu Logo"
                className="h-10 w-auto"
              />
            </div>
          </Link>
        </div>
        <div className="sm:block hidden">
          <SearchBar />
        </div>

        <div className="flex gap-4">
          <CartIcon />
          <div className="hidden sm:block">
            <NotificationIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
