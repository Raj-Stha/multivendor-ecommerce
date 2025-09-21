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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SIDEBAR_ITEMS = [
  {
    type: "single",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard/vendor",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    type: "single",
    items: [
      {
        label: "Products",
        href: "/dashboard/vendor/product",
        icon: Package,
      },
    ],
  },

  {
    type: "single",
    items: [
      {
        label: "Order",
        href: "/dashboard/vendor/order",
        icon: Package,
      },
    ],
  },
  // {
  //   type: "group",
  //   label: "Banner Management",
  //   items: [
  //     {
  //       label: "Banners",
  //       href: "/dashboard/vendor/banners",
  //       icon: ImageIcon,
  //     },
  //   ],
  // },

  // {
  //   type: "collapsible",
  //   label: "Product Management",
  //   items: [
  //     {
  //       label: "Product",
  //       href: "/dashboard/vendor/product",
  //       icon: Package,
  //     },
  //     {
  //       label: "Product Notes",
  //       href: "/dashboard/vendor/product-notes",
  //       icon: Box,
  //     },
  //     {
  //       label: "Product Map",
  //       href: "/dashboard/vendor/product-map",
  //       icon: Box,
  //     },
  //   ],
  // },
];

export function VendorSidebar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xl font-bold">E-Commerce</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_ITEMS.map((section, index) => {
          if (section.type === "single") {
            return (
              <SidebarGroup key={index}>
                <SidebarMenu>
                  {section.items.map((item, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
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
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="vendor"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Vendor User</span>
            <span className="text-xs text-muted-foreground">
              vendor@example.com
            </span>
          </div>
          <button className="ml-auto rounded-full p-2 hover:bg-muted">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
