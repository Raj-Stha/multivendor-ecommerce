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
    <nav className="bg-white  shadow-sm w-full sticky-nav jost-text ">
      <div className="container max-w-7xl mx-auto py-3 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="transition-opacity hover:opacity-80">
            {/* <img
              src="/logo/logo.png"
              alt="KinMel Mandu Logo"
              className="h-12 w-auto"
            /> */}
            <h1 className="text-black font-semibold shadow-2xl text-2xl">
              E-COM
            </h1>
          </Link>
        </div>

        {showPopup && (
          <LocationPopup
            status={showPopup}
            // when popup closes, also reset state
            onClose={() => setShowPopup(false)}
          />
        )}

        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 px-5 py-2 cursor-pointer rounded-lg bg-primary/5 hover:bg-primary/20 transition-colors text-black flex-shrink-0"
        >
          <MapPin className="w-4 h-4" />
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-80">Deliver to</span>
            <span className="text-sm font-semibold truncate max-w-[120px]">
              {locationName.substring(0, 10)} ..
            </span>
          </div>
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-xl justify-center">
          <SearchBar />
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          <NotificationIcon />
          <CartIcon />

          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
