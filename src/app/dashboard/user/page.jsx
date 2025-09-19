"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import { TopBar } from "@/components/Header/top-bar";
import MobileBottomNav from "@/components/Header/mobile-bottom-nav";
import Footer from "@/components/Footer";
import { useUser } from "@/app/(home)/_context/UserContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import UserDetails from "@/components/user/UserDetails";
import UserOrders from "@/components/user/UserOrders";
import UserAddresses from "@/components/user/UserAddresses";

export default function UserPage() {
  const { user, logoutUser } = useUser();
  const [activeTab, setActiveTab] = useState("details");
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
    { id: "details", label: "Details" },
    { id: "orders", label: "Orders" },
    { id: "addresses", label: "Addresses" },
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

  return (
    <>
      <TopBar />
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 jost-text">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white shadow rounded-lg p-4 flex-shrink-0">
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 bg-white shadow rounded-lg p-6">
          {activeTab === "details" && (
            <UserDetails
              userInfo={userInfo}
              userLoginName={userLoginName}
              deliveryLocation={deliveryLocation}
            />
          )}

          {activeTab === "orders" && <UserOrders />}

          {activeTab === "addresses" && <UserAddresses />}
        </div>
      </div>

      <MobileBottomNav />
      <Footer />
    </>
  );
}
