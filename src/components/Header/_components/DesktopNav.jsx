"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import NotificationIcon from "./NotificationIcon";
import AccountMenu from "./AccountMenu";

import { useState } from "react";
import LocationPopup from "../../LocationPopup";
import { MapPin } from "lucide-react";
import { parseLatLon } from "@/lib/getLocationAddress";

export default function DesktopNav({ user, locationName, popupReady }) {
  const [showPopup, setShowPopup] = useState(false);

  const currentUser = Array.isArray(user) && user.length > 0 ? user[0] : null;

  const hasDeliveryLocation = !!currentUser?.delivery_location;

  const handleLocationClick = () => {
    if (!popupReady) return;

    setShowPopup(true);
  };

  return (
    <nav className="bg-white shadow-sm w-full sticky-nav jost-text">
      <div className="container max-w-7xl mx-auto py-3 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <img
              src="/logo/logo.png"
              alt="Logo"
              className="h-18 w-auto"
              width="100"
              height="10"
            />
          </Link>
        </div>

        {/* Location Popup */}
        {showPopup && hasDeliveryLocation && (
          <LocationPopup
            status={showPopup}
            initialLocation={
              locationName
                ? {
                    name: locationName,
                    ...parseLatLon(currentUser.delivery_location),
                  }
                : null
            }
            user={currentUser}
            onClose={() => setShowPopup(false)}
          />
        )}

        {/* Location Button */}
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={!popupReady}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-black flex-shrink-0 transition-colors ${
            popupReady
              ? "cursor-pointer bg-primary/5 hover:bg-primary/20"
              : "cursor-not-allowed bg-gray-100 opacity-60"
          }`}
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
