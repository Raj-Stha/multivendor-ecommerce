"use client";

import { useRouter } from "next/navigation";
import { CheckoutList } from "@/components/home/checkout/checkout-list";
import { useState, useEffect } from "react";
import { useCart } from "@/app/(home)/_context/CartContext";
import { useUser } from "@/app/(home)/_context/UserContext";

export default function Checkout() {
  const { cart, getCart } = useCart();
  const { user, getUser } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await getCart();
      await getUser();
      setIsLoading(false);
    };
    loadData();
  }, [getCart, getUser]);

  useEffect(() => {
    if (!isLoading && cart.length === 0) {
      // If cart is empty, redirect to home (or cart page)
      router.push("/cart");
    }
  }, [isLoading, cart, router]);

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row gap-4 px-4 py-8 min-h-screen">
        {/* Left side skeleton */}
        <div className="w-full md:w-2/3 space-y-4 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Right side skeleton */}
        <div className="w-full md:w-1/3 space-y-2 animate-pulse mt-6 md:mt-0">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-40 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  // Prevent rendering if cart is empty (to avoid flicker before redirect)
  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-background jost-text">
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <CheckoutList cartData={cart} user={user} />
      </main>
    </div>
  );
}
