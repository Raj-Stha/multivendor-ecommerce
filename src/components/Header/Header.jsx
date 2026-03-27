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

  // ✅ Read popStatus once on mount
  useEffect(() => {
    const storedStatus = localStorage.getItem("popStatus") === "true";
    setPopStatus(storedStatus);
  }, []);

  // Load user and set location
  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        // Issue  devliverylocation show null at the first time, so fetch user twice
        await getUser(); // fetch user once
        await getUser(); // fetch twice once
        return;
      }

      if (Array.isArray(user) && user.length > 0) {
        const address = user[0]?.delivery_address;
        if (address) setLocationName(address);
      }
    };
    loadUser();
  }, [user, getUser]);

  return (
    <>
      {/* Desktop Sticky Nav */}
      <div className="hidden lg:block">
        <DesktopNav user={user} locationName={locationName} />
        {/* ✅ Show popup only if popStatus is false */}
        {!popStatus && locationName && user?.[0]?.delivery_location && (
          <LocationPopup
            status={false} // let popup decide when to open
            initialLocation={{
              name: locationName,
              ...parseLatLon(user[0].delivery_location),
            }}
            user={user?.[0]}
            onClose={() => setPopStatus(true)} // mark as closed
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
