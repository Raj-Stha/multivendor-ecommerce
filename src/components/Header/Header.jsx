"use client";

import DesktopNav from "./_components/DesktopNav";
import MobileNav from "./_components/MobileNav";
import { useUser } from "@/app/(home)/_context/UserContext";
import { useState, useEffect } from "react";
import { parseLatLon } from "@/lib/getLocationAddress";
import LocationPopup from "@/components/LocationPopup";

export default function Header() {
  const { user, getUser } = useUser();

  const [locationName, setLocationName] = useState("");
  const [popStatus, setPopStatus] = useState(false);
  const [popupReady, setPopupReady] = useState(false);

  // Read popStatus once on mount
  useEffect(() => {
    const storedStatus = localStorage.getItem("popStatus") === "true";

    setPopStatus(storedStatus);
  }, []);

  // Delay only the location popup/button
  useEffect(() => {
    const timer = setTimeout(() => {
      setPopupReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Load user and set location
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!user) {
          await getUser();
          await getUser();
          return;
        }

        if (Array.isArray(user) && user.length > 0) {
          const address = user[0]?.delivery_address;

          if (address) {
            setLocationName(address);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();
  }, [user, getUser]);

  const currentUser = Array.isArray(user) && user.length > 0 ? user[0] : null;

  const hasDeliveryLocation = !!currentUser?.delivery_location;

  return (
    <>
      {/* Desktop Sticky Nav */}
      <div className="hidden lg:block">
        <DesktopNav
          user={user}
          locationName={locationName}
          popupReady={popupReady}
        />

        {/* Automatic Location Popup */}
        {popupReady && !popStatus && locationName && hasDeliveryLocation && (
          <LocationPopup
            status={false}
            initialLocation={{
              name: locationName,
              ...parseLatLon(currentUser.delivery_location),
            }}
            user={currentUser}
            onClose={() => setPopStatus(true)}
          />
        )}
      </div>

      {/* Mobile Sticky Nav */}
      <div className="block lg:hidden">
        <MobileNav />
      </div>
    </>
  );
}
