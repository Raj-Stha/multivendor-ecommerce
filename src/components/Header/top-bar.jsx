// "use client";

// import { Phone, Mail, Clock, MapPin } from "lucide-react";
// import Link from "next/link";

// export function TopBar() {
//   return (
//     <div className="hidden md:block bg-primary uppercase py-1 text-white w-full  text-xs noto-sans-text ">
//       <div className="container max-w-7xl mx-auto flex justify-end items-center xl:px-3 sm:px-4 px-[3px] space-x-4">
//         {/* Right: Contact info */}
//         <Link href="/auth/login">Login</Link>
//         <Link href="/auth/register">Sign Up</Link>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/app/(home)/_context/UserContext";

export function TopBar() {
  const { user, logoutUser } = useUser();
  const [isLogged, setIsLogged] = useState(false);

  // ✅ Helper to read cookie
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  // ✅ Watch for both user context & cookie changes
  useEffect(() => {
    const cookieLoggedIn = getCookie("userLogged") === "true";
    const contextLoggedIn =
      !!user && (Array.isArray(user) ? user.length > 0 : true);

    setIsLogged(cookieLoggedIn || contextLoggedIn);
  }, [user]);

  // ✅ Handle logout
  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      setIsLogged(false);
      window.location.href = "/"; // redirect to homepage
    }
  };

  return (
    <div className="hidden md:block bg-primary uppercase py-1 text-white w-full text-xs noto-sans-text">
      <div className="container max-w-7xl mx-auto flex justify-end items-center xl:px-3 sm:px-4 px-[3px] space-x-4">
        {isLogged ? (
          <>
            <Link href="/dashboard/user" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="hover:underline">
              Login
            </Link>
            <Link href="/auth/register" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
