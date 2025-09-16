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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium">Loading...</p>
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
