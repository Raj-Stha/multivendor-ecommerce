"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle, Crown, CreditCard } from "lucide-react";
import { useUser } from "@/app/(home)/_context/UserContext";

export default function Membership({ membershipStatus }) {
  const [loading, setLoading] = useState(false);
  const { getUser } = useUser();

  const isActive = membershipStatus?.toLowerCase() === "active";

  const handleGetMembership = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/getmembership`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to process membership request");
      }

      const data = await res.json();

      const membershipData = data?.details?.[0];

      if (membershipData?.payment_url) {
        window.location.href = membershipData.payment_url;
        return;
      }
    } catch (error) {
      console.error("Membership error:", error);
      toast.error("Unable to process membership request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership</h1>
          <p className="text-gray-500 mt-1">Manage your membership plan</p>
        </div>

        <Crown className="w-8 h-8 text-primary" />
      </div>

      {/* Current Membership */}
      <div className="border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Current Plan</p>

            <h2 className="text-xl font-semibold mt-1">
              {isActive ? "Premium Membership" : "Free Plan"}
            </h2>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="border-t pt-4">
          <p className="text-gray-600">
            {isActive
              ? "Your premium membership is currently active."
              : "You are currently using the free plan. Upgrade your membership to access premium benefits."}
          </p>
        </div>
      </div>

      {/* Free / Inactive Membership */}
      {!isActive && (
        <div className="border rounded-xl p-6 bg-gray-50">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">Upgrade Your Membership</h3>

              <p className="text-gray-600 mt-1">
                Upgrade from the free plan to unlock premium membership
                benefits.
              </p>

              <button
                onClick={handleGetMembership}
                disabled={loading}
                className="mt-5 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Processing..." : "Get Membership"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Membership */}
      {isActive && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />

            <div>
              <h3 className="font-semibold text-green-800">
                Membership Active
              </h3>

              <p className="text-green-700 text-sm mt-1">
                You currently have an active premium membership.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
