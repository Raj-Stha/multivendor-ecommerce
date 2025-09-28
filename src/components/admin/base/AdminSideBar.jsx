"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  ChevronDown,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUser } from "@/app/(home)/_context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SIDEBAR_ITEMS = [
  {
    type: "single",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  // {
  //   type: "group",
  //   label: "Banner Management",
  //   items: [
  //     {
  //       label: "Banners",
  //       href: "/dashboard/admin/banners",
  //       icon: ImageIcon,
  //     },
  //   ],
  // },
  {
    type: "collapsible",
    label: "Category Management",
    items: [
      {
        label: "Category",
        href: "/dashboard/admin/category",
        icon: Package,
      },
      {
        label: "Category Notes",
        href: "/dashboard/admin/category-notes",
        icon: Box,
      },
    ],
  },

  {
    type: "collapsible",
    label: "Manufacturer Management",
    items: [
      {
        label: "Manufacturer",
        href: "/dashboard/admin/manufacturer",
        icon: Package,
      },
      {
        label: "Manufacturer Notes",
        href: "/dashboard/admin/manufacturer-notes",
        icon: Box,
      },
    ],
  },

  {
    type: "collapsible",
    label: "Vendor Management",
    items: [
      {
        label: "Vendor",
        href: "/dashboard/admin/vendor",
        icon: Package,
      },
      {
        label: "Vendor Notes",
        href: "/dashboard/admin/vendor-notes",
        icon: Box,
      },
    ],
  },

  {
    type: "collapsible",
    label: "Product Management",
    items: [
      {
        label: "Product",
        href: "/dashboard/admin/product",
        icon: Package,
      },
      {
        label: "Product Notes",
        href: "/dashboard/admin/product-notes",
        icon: Box,
      },
      {
        label: "Product Map",
        href: "/dashboard/admin/product-map",
        icon: Box,
      },
    ],
  },

  {
    type: "collapsible",
    label: "User Management",
    items: [
      {
        label: "User Notes",
        href: "/dashboard/admin/user-notes",
        icon: Box,
      },
    ],
  },

  {
    type: "collapsible",
    label: "Promo Management",
    items: [
      {
        label: "Promo",
        href: "/dashboard/admin/promo",
        icon: Package,
      },
      {
        label: "Promo Notes",
        href: "/dashboard/admin/promo-notes",
        icon: Box,
      },
    ],
  },

  {
    type: "group",
    label: "System Paramters",
    items: [
      {
        label: "System",
        href: "/dashboard/admin/system-parameter",
        icon: Settings,
      },
    ],
  },
  // {
  //   type: "collapsible",
  //   label: "Order Management",
  //   items: [
  //     {
  //       label: "All Orders",
  //       href: "/dashboard/admin/orders",
  //       icon: ShoppingBag,
  //     },
  //     {
  //       label: "Pending Orders",
  //       href: "/dashboard/admin/orders/pending",
  //       icon: ShoppingBag,
  //     },
  //     {
  //       label: "Completed Orders",
  //       href: "/dashboard/admin/orders/completed",
  //       icon: ShoppingBag,
  //     },
  //   ],
  // },
  // {
  //   type: "group",
  //   label: "User Management",
  //   items: [
  //     {
  //       label: "Users",
  //       href: "/dashboard/admin/users",
  //       icon: Users,
  //     },
  //   ],
  // },
  // {
  //   type: "group",
  //   label: "Analytics",
  //   items: [
  //     {
  //       label: "Reports",
  //       href: "/dashboard/admin/analytics",
  //       icon: BarChart3,
  //     },
  //   ],
  // },
  // {
  //   type: "group",
  //   label: "Settings",
  //   items: [
  //     {
  //       label: "Settings",
  //       href: "/dashboard/admin/settings",
  //       icon: Settings,
  //     },
  //   ],
  // },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, getUser, logoutUser } = useUser();
  const router = useRouter();
  const { toggleSidebar, open } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        await getUser();
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, [getUser]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLinkClick = () => {
    if (isMobile && open) toggleSidebar();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b flex  px-4 py-6">
        <div className="flex  w-full justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-bold">E-Commerce</span>
          </div>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="py-1 hover:bg-muted bg-gray-200 px-2   rounded-md"
            >
              ✕
            </button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="!gap-0">
        {SIDEBAR_ITEMS.map((section, index) => {
          if (section.type === "single") {
            return (
              <SidebarGroup key={index}>
                <SidebarMenu>
                  {section.items.map((item, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        onClick={handleLinkClick}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            );
          }

          if (section.type === "group") {
            return (
              <SidebarGroup key={index}>
                <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item, i) => (
                      <SidebarMenuItem key={i}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.href)}
                          onClick={handleLinkClick}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }

          if (section.type === "collapsible") {
            return (
              <SidebarGroup key={index}>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <span>{section.label}</span>
                      <ChevronDown className="h-4 w-4 transition-transform  group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {section.items.map((item, i) => (
                          <SidebarMenuItem key={i}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive(item.href)}
                              onClick={handleLinkClick}
                            >
                              <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>
            );
          }

          return null;
        })}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar>
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="vendor"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                {user && (
                  <span className="text-sm font-medium">
                    {user[0]?.user_login_name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  vendor@example.com
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/admin/system-parameter")}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                const res = await logoutUser();
                if (res) router.replace("/");
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
