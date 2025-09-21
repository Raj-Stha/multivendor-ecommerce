"use client";

import { useState } from "react";
import {
  ChevronDown,
  User,
  LogOut,
  LogIn,
  Mail,
  Info,
  FileText,
  ShieldCheck,
  MessageSquarePlus,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-toastify";

// Config array for dropdown items
const accountMenuItems = [
  {
    id: "login",
    label: "Login",
    href: "/auth/login",
    icon: LogIn,
    guestOnly: true,
  },
  {
    id: "profile",
    label: "My Profile",
    href: "/dashboard/user/profile",
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
  {
    id: "contact",
    label: "Contact Us",
    href: "/contact",
    icon: Mail,
  },
  {
    id: "about",
    label: "About Us",
    href: "/about",
    icon: Info,
  },
  {
    id: "terms",
    label: "Terms & Conditions",
    href: "/terms",
    icon: FileText,
  },
  {
    id: "policies",
    label: "Policies",
    href: "/policies",
    icon: ShieldCheck,
  },
  {
    id: "feedback",
    label: "Feedback",
    href: "/feedback",
    icon: MessageSquarePlus,
  },
];

export default function AccountMenu() {
  const { data: session } = useSession();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    signOut({ callbackUrl: "/" });
  };

  return (
    <div
      className="flex items-center cursor-pointer relative   nunito-text"
      onMouseEnter={() => setAccountMenuOpen(true)}
      onMouseLeave={() => setAccountMenuOpen(false)}
    >
      <div className="text-xs mr-1">
        <div className="flex lg:gap-3 items-center">
          {/* {session?.user?.image ? (
            <div className="h-7 w-7 rounded-full overflow-hidden">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
              {session?.user?.name ? (
                session.user.name.charAt(0).toUpperCase()
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
          )} */}
          <div>
            {/* {session?.user ? (
              <span className="hidden md:block text-gray-500">
                Hi, {firstName}
              </span>
            ) : (
              <span className="hidden md:block text-gray-500">Hello User</span>
            )} */}
            <div className="flex items-center">
              <span
                className={` font-medium  transition-colors ${
                  accountMenuOpen
                    ? "text-primary text-sm"
                    : "hover:text-primary text-sm"
                }`}
              >
                My Account
              </span>
              <ChevronDown
                className={`h-3 w-3 ml-1 transition-colors ${
                  accountMenuOpen ? "text-primary" : "hover:text-primary"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full right-0 lg:left-[-64px] mt-2 w-48 bg-white shadow-lg rounded-none border border-gray-100 transition-all duration-200 transform z-50 origin-top-right text-sm text-gray-600 ${
          accountMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div>
          {accountMenuItems.map((item) => {
            if (item.authOnly && !session) return null;
            if (item.guestOnly && session) return null;

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
