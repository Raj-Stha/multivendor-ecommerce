"use client";

import { useState } from "react";
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

  // ✅ Login check directly from user data
  const isLogged = !!user?.[0]?.user_login_name;

  const handleLogout = async () => {
    const success = await logoutUser();

    if (success) {
      toast.success("Logged out successfully");
      window.location.href = "/";
    } else {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <div
      className="flex items-center group cursor-pointer relative nunito-text"
      onMouseEnter={() => setAccountMenuOpen(true)}
      onMouseLeave={() => setAccountMenuOpen(false)}
    >
      <div className="flex items-center">
        {isLogged && user?.[0]?.avatar ? (
          <div className="h-7 w-7 rounded-full overflow-hidden">
            <Image
              src={user[0].avatar}
              alt={user?.[0]?.user_login_name || "User"}
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-6 w-6 group-hover:bg-secondary rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
            <User className="h-5 w-5" />
          </div>
        )}

        <ChevronDown className="h-4 w-4 ml-1 text-white" />
      </div>

      <div
        className={`absolute top-full right-0 lg:left-[-64px] mt-5 w-48 bg-white shadow-lg rounded-sm transition-all duration-200 transform z-50 origin-top-right text-sm text-gray-600 ${
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
                  className="flex items-center px-4 py-2 w-full text-left hover:bg-primary hover:text-white transition-colors"
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
                className="flex items-center px-4 py-2 hover:bg-primary hover:text-white transition-colors"
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
