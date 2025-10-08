// DesktopNav.jsx - WORKING VERSION
"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import NotificationIcon from "./NotificationIcon";

import AccountMenu from "./AccountMenu";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LocationPopup from "../../LocationPopup";
import { MapPin } from "lucide-react";

export default function DesktopNav() {
  const [showPopup, setShowPopup] = useState(false);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_location");
      if (stored) {
        const location = JSON.parse(stored);
        setLocationName(location.name);
      }
    } catch (error) {
      console.error("Error loading location:", error);
    }
  }, []);

  return (
    <nav className="bg-primary shadow-md w-full sticky-nav jost-text ">
      <div className="container max-w-7xl mx-auto py-3 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <img
              src="/logo/logo.png"
              alt="KinMel Mandu Logo"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex-shrink-0"
        >
          <MapPin className="w-4 h-4" />
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-80">Deliver to</span>
            <span className="text-sm font-semibold truncate max-w-[120px]">
              {locationName}
            </span>
          </div>
        </button>

        {showPopup && (
          <LocationPopup
            status={showPopup}
            // when popup closes, also reset state
            onClose={() => setShowPopup(false)}
          />
        )}

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-xl justify-center">
          <SearchBar />
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-5 flex-shrink-0">
          <CartIcon />
          <NotificationIcon />
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
