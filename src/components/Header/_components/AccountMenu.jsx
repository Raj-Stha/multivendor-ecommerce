"use client";

import { useEffect, useState } from "react";
import { ChevronDown, User, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useUser } from "@/app/(home)/_context/UserContext";

const accountMenuItems = [
  {
    id: "login",
    label: "Login",
    href: "/auth/login",
    icon: LogIn,
    guestOnly: true,
  },
  {
    id: "register",
    label: "Register",
    href: "/auth/register",
    icon: LogIn,
    guestOnly: true,
  },
  {
    id: "profile",
    label: "My Profile",
    href: "/dashboard/user",
    icon: User,
    authOnly: true,
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogOut,
    action: "logout",
    authOnly: true,
  },
];

export default function AccountMenu() {
  const { user, logoutUser } = useUser();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  // ✅ Read cookie
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  // ✅ Watch for context or cookie
  useEffect(() => {
    const cookieLoggedIn = getCookie("userLogged") === "true";
    const contextLoggedIn =
      !!user && (Array.isArray(user) ? user.length > 0 : true);

    setIsLogged(cookieLoggedIn || contextLoggedIn);
  }, [user]);

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      toast.success("Logged out successfully");
      setIsLogged(false);
      window.location.href = "/"; // redirect to homepage
    } else {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <div
      className="flex items-center cursor-pointer relative nunito-text"
      onMouseEnter={() => setAccountMenuOpen(true)}
      onMouseLeave={() => setAccountMenuOpen(false)}
    >
      <div className="flex items-center">
        {isLogged && user?.avatar ? (
          <div className="h-7 w-7 rounded-full overflow-hidden">
            <Image
              src={user.avatar}
              alt={user.name || "User"}
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
            <User className="h-5 w-5" />
          </div>
        )}
        <ChevronDown
          className={`h-4  w-4 ml-1 text-white transition-colors ${
            accountMenuOpen ? "text-white" : "hover:text-white"
          }`}
        />
      </div>

      <div
        className={`absolute top-full right-0 lg:left-[-64px] mt-5 w-48 bg-white shadow-lg rounded-sm border-none  transition-all duration-200 transform z-50 origin-top-right text-sm text-gray-600 ${
          accountMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div>
          {accountMenuItems.map((item) => {
            if (item.authOnly && !isLogged) return null;
            if (item.guestOnly && isLogged) return null;

            const Icon = item.icon;

            if (item.action === "logout") {
              return (
                <button
                  key={item.id}
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 w-full text-left hover:bg-secondary hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center px-4 py-2 hover:bg-secondary hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
