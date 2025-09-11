"use client";
import { ShoppingCart, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CartList } from "@/components/home/cart/cart-list";
import { useCart } from "@/app/(home)/_context/CartContext";
import { useState, useEffect } from "react";
import { CartSkeleton } from "../../../components/home/cart/cart-skeleton";

export default function Cart() {
  const { cart, getCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      await getCart();
      setIsLoading(false);
    };
    loadCart();
  }, [getCart]);

  return (
    <div className="min-h-screen bg-background jost-text">
      <main className="container mx-auto w-[90%] px-4 py-8">
        {isLoading ? (
          <CartSkeleton />
        ) : cart.length > 0 ? (
          <CartList cart={cart} />
        ) : (
          <div className="text-center py-[10%]">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some items to get started
            </p>
            <Button onClick={() => router.replace("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
