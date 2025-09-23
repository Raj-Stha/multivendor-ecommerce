"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Menu, User, Package, LogOut } from "lucide-react";
import { useUser } from "@/app/(home)/_context/UserContext";
import UserDetails from "@/components/vendor/profile/user-details";

export default function UserPage() {
  const { user, getUser, logoutUser } = useUser();
  const router = useRouter();

  //   const handleLogout = async () => {
  //     const success = await logoutUser();
  //     if (success) {
  //       toast.success("Logged out successfully");
  //       router.push("/auth/login");
  //     } else {
  //       toast.error("Logout failed");
  //     }
  //   };

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      <div className="h-40 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-300 rounded w-2/3"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className=" w-full px-4 py-6 md:py-8 jost-text">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white shadow-sm rounded-xl border p-6 lg:p-8 min-h-[600px]">
            {user ? (
              <>
                <UserDetails user={user[0]} />
              </>
            ) : (
              <LoadingSkeleton />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
