"use client";

import { useEffect } from "react";
import { useUser } from "@/app/(home)/_context/UserContext";
import UserDetails from "@/components/vendor/profile/user-details";
import { UserLoading } from "@/components/vendor/profile/user-loading";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function UserPage() {
  const { user, getUser } = useUser();

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow py-5 px-3 bg-white">
        <div className="flex items-center justify-between ">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <h2 className="text-2xl font-semibold text-gray-800">
              Manage Profile
            </h2>
          </div>
        </div>
      </header>
      <div className=" w-full px-4 py-6  jost-text">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white shadow-sm rounded-sm border p-6  min-h-[600px]">
            {user ? (
              <>
                <UserDetails user={user[0]} />
              </>
            ) : (
              <UserLoading />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
