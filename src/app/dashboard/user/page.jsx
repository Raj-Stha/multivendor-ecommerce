"use client";

import { useState } from "react";
import { Menu, User, Package, MapPin, LogOut } from "lucide-react";
import Header from "@/components/Header/Header";
import { TopBar } from "@/components/Header/top-bar";
import MobileBottomNav from "@/components/Header/mobile-bottom-nav";
import Footer from "@/components/Footer";
import { useUser } from "@/app/(home)/_context/UserContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import UserDetails from "@/components/user/UserDetails";
import UserOrders from "@/components/user/UserOrders";

export default function UserPage() {
  const { user, logoutUser } = useUser();
  const [activeTab, setActiveTab] = useState("details");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading user details...</p>
      </div>
    );
  }

  const userInfo = user[0]?.user_details || {};
  const userLoginName = user[0]?.user_login_name || "-";
  const deliveryLocation = user[0]?.delivery_location || "-";

  const tabs = [
    { id: "details", label: "Details", icon: User },
    { id: "orders", label: "Orders", icon: Package },
  ];

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } else {
      toast.error("Logout failed");
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close mobile sidebar when tab changes
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col jost-text">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Account</h2>
        <p className="text-sm text-gray-600">Manage your profile</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    activeTab === tab.id
                      ? "bg-primary text-white font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <TopBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 jost-text">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Header with Menu Button */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:w-64 lg:w-80 h-[450px] bg-white shadow-sm rounded-xl border flex-shrink-0">
            <SidebarContent />
          </aside>

          {/* Main Content */}
          <div className="flex-1 bg-white shadow-sm rounded-xl border p-6 lg:p-8 min-h-[600px]">
            {activeTab === "details" && (
              <UserDetails
                userInfo={userInfo}
                userLoginName={userLoginName}
                deliveryLocation={deliveryLocation}
              />
            )}

            {activeTab === "orders" && <UserOrders />}
          </div>
        </div>
      </div>

      <MobileBottomNav />
      <Footer />
    </>
  );
}
