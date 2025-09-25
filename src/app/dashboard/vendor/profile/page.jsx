"use client";

import { useEffect } from "react";
import { useUser } from "@/app/(home)/_context/UserContext";
import UserDetails from "@/components/vendor/profile/user-details";
import { UserLoading } from "@/components/vendor/profile/user-loading";

export default function UserPage() {
  const { user, getUser } = useUser();

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
              <UserLoading />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
