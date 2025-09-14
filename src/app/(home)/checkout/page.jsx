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
    const loadCart = async () => {
      setIsLoading(true);
      await getCart();
      await getUser();
      setIsLoading(false);
    };
    loadCart();
  }, [getCart, getUser]);

  console.log(user);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container max-w-7xl mx-auto py-4">
          <div className="">
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CheckoutList cartData={cart} user={user} />
      </main>
    </div>
  );
}
