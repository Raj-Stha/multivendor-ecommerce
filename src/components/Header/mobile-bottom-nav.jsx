// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Home, Search, User } from "lucide-react";
// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import NotificationIcon from "./_components/NotificationIcon";

// const mobileNavItems = [
//   {
//     name: "Home",
//     href: "/",
//     icon: Home,
//   },
//   {
//     name: "Search",
//     href: "/products",
//     icon: Search,
//   },
//   {
//     name: "Wishlist",
//     href: "/wishlist",
//     icon: null, // handled separately
//   },
//   {
//     name: "Account",
//     icon: User,
//     dropdown: [
//       { name: "Login", href: "/auth/login" },
//       { name: "Register", href: "/auth/register" },
//     ],
//   },
// ];

// export default function MobileBottomNav() {
//   const pathname = usePathname();
//   const [showAccountDropdown, setShowAccountDropdown] = useState(false);

//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg sm:hidden jost-text">
//       <nav className="flex h-16 items-center justify-around px-2 relative">
//         {mobileNavItems.map((item) => {
//           const isActive = pathname === item.href;
//           const isAccount = item.name === "Account";
//           const isWishlist = item.name === "Wishlist";

//           return (
//             <div
//               key={item.name}
//               className="relative "
//               onMouseEnter={() => isAccount && setShowAccountDropdown(true)}
//               onMouseLeave={() => isAccount && setShowAccountDropdown(false)}
//             >
//               {isAccount ? (
//                 <DropdownMenu
//                   open={showAccountDropdown}
//                   onOpenChange={setShowAccountDropdown}
//                 >
//                   <DropdownMenuTrigger asChild>
//                     <button
//                       type="button"
//                       className="flex flex-col items-center cursor-pointer justify-center gap-1 px-2 py-1 text-gray-800 hover:text-primary transition-colors"
//                     >
//                       <User className="h-5 w-5" />
//                       <span className="text-xs font-semibold">{item.name}</span>
//                     </button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     side="top"
//                     align="center"
//                     className="mb-2 rounded-none"
//                   >
//                     {item.dropdown?.map((subItem) => (
//                       <DropdownMenuItem
//                         key={subItem.name}
//                         asChild
//                         className="rounded-none"
//                       >
//                         <Link
//                           href={subItem.href}
//                           className="cursor-pointer "
//                         >
//                           {subItem.name}
//                         </Link>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : isWishlist ? (
//                 <NotificationIcon />
//               ) : (
//                 <Link
//                   href={item.href}
//                   className={cn(
//                     "flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md transition-colors",
//                     isActive
//                       ? "text-primary"
//                       : "text-gray-800 hover:text-primary"
//                   )}
//                 >
//                   {item.icon && <item.icon className="h-5 w-5" />}
//                   <span className="text-xs font-semibold">{item.name}</span>
//                 </Link>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/app/(home)/_context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationIcon from "./_components/NotificationIcon";

const mobileNavItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Search",
    href: "/products",
    icon: Search,
  },
  {
    name: "Wishlist",
    href: "/wishlist",
    icon: null, // handled separately
  },
  {
    name: "Account",
    icon: User,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, logoutUser } = useUser();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  // ✅ Read cookie helper
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  // ✅ Sync login status between cookie & context
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg sm:hidden jost-text">
      <nav className="flex h-16 items-center justify-around px-2 relative">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const isAccount = item.name === "Account";
          const isWishlist = item.name === "Wishlist";

          return (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => isAccount && setShowAccountDropdown(true)}
              onMouseLeave={() => isAccount && setShowAccountDropdown(false)}
            >
              {isAccount ? (
                <DropdownMenu
                  open={showAccountDropdown}
                  onOpenChange={setShowAccountDropdown}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex flex-col items-center cursor-pointer justify-center gap-1 px-2 py-1 text-gray-800 hover:text-primary transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs font-semibold">{item.name}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="center"
                    className="mb-2 rounded-none"
                  >
                    {isLogged ? (
                      <>
                        <DropdownMenuItem asChild className="rounded-none">
                          <Link href="/dashboard/user">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="rounded-none cursor-pointer"
                        >
                          Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild className="rounded-none">
                          <Link href="/auth/login">Login</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-none">
                          <Link href="/auth/register">Register</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : isWishlist ? (
                <NotificationIcon />
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-gray-800 hover:text-primary"
                  )}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="text-xs font-semibold">{item.name}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
