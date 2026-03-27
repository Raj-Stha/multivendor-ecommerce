"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import NotificationIcon from "./NotificationIcon";
import AccountMenu from "./AccountMenu";

import { useState, useEffect } from "react";
import LocationPopup from "../../LocationPopup";
import { MapPin } from "lucide-react";
import { parseLatLon } from "@/lib/getLocationAddress";

export default function DesktopNav({ user, locationName }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <nav className="bg-white shadow-sm w-full sticky-nav jost-text">
      <div className="container max-w-7xl mx-auto py-3 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <h1 className="text-black font-semibold shadow-2xl text-2xl">
              E-COM
            </h1>
          </Link>
        </div>

        {/* Location Popup */}
        {showPopup && user[0]?.delivery_location && (
          <LocationPopup
            status={showPopup}
            initialLocation={
              locationName && user?.[0]?.delivery_location
                ? {
                    name: locationName,
                    ...parseLatLon(user[0].delivery_location),
                  }
                : null
            }
            user={user?.[0]}
            onClose={() => setShowPopup(false)}
          />
        )}

        {/* Location Button */}
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg bg-primary/5 hover:bg-primary/20 transition-colors text-black flex-shrink-0"
        >
          <MapPin className="w-4 h-4" />

          <div className="flex flex-col items-start w-[140px]">
            <span className="text-xs opacity-80">Deliver to</span>

            <span className="text-sm font-semibold truncate">
              {locationName
                ? locationName.substring(0, 18) + "..."
                : "Select Location"}
            </span>
          </div>
        </button>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-xl justify-center">
          <SearchBar />
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          <NotificationIcon />
          <CartIcon />
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
