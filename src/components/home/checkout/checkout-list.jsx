"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useCart } from "@/app/(home)/_context/CartContext";
import { useUser } from "@/app/(home)/_context/UserContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OrderSummary } from "./order-summary";

// Guest validation schema
const guestSchema = z.object({
  user_login_name: z.string().min(1, "Username is required"),
  useremail: z.string().email("Invalid email address"),
});

// ✅ Helper to read cookie value
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export function CheckoutList() {
  const router = useRouter();
  const { cart, getCart } = useCart();
  const { user, getUser } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState({
    lat: "",
    lon: "",
    name: "",
  });

  const form = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: { user_login_name: "", useremail: "" },
  });

  // ✅ On mount, check cookie & fetch accordingly
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await getCart();

      const cookieValue = getCookie("userLogged");
      const loggedIn = cookieValue === "true";
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        await getUser();
      } else {
        // For guests, read location from localStorage
        const stored = localStorage.getItem("user_location");
        if (stored) setLocationCoordinates(JSON.parse(stored));
      }

      setIsLoading(false);
    };
    loadData();
  }, [getCart, getUser]);

  // Redirect if cart empty
  useEffect(() => {
    if (!isLoading && cart.length === 0) router.push("/cart");
  }, [isLoading, cart, router]);

  // Set initial location for logged in user
  useEffect(() => {
    if (user && user[0]?.delivery_location) {
      setLocationCoordinates((prev) => ({
        ...prev,
        name: user[0].delivery_location,
      }));
    }
  }, [user]);

  // Complete order
  const handleCompleteOrder = async () => {
    setIsLoading(true);
    try {
      const payload = isLoggedIn
        ? {
            user_login_name: user?.[0]?.user_login_name,
            user_email: user?.[0]?.user_email,
            delivery_location: locationCoordinates.name,
          }
        : {
            user_login_name: form.getValues("user_login_name"),
            user_email: form.getValues("useremail"),
            delivery_location: locationCoordinates.name,
          };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/publishcart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to complete order");

      toast.success("Order completed successfully!");
      router.push("/products");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );

  if (cart.length === 0) return null;

  return (
    <Form {...form}>
      <form className="flex flex-col md:flex-row gap-8 max-w-7xl justify-between mx-auto py-8">
        {/* LEFT */}
        <div className="space-y-8 w-full md:w-2/3">
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚚 User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoggedIn && user ? (
                <div className="space-y-2">
                  <div>
                    <Label>Username</Label>
                    <Input value={user[0]?.user_login_name} readOnly />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={user[0]?.user_email} readOnly />
                  </div>
                  <div>
                    <Label>Delivery Location</Label>
                    <Input value={locationCoordinates.name} readOnly />
                  </div>
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="user_login_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="useremail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Label>Delivery Location</Label>
                    <Input
                      value={locationCoordinates.name || ""}
                      readOnly
                      placeholder="Location not set"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 w-full md:w-1/3">
          <OrderSummary
            cartData={cart}
            isLoading={isLoading}
            onCompleteOrder={handleCompleteOrder}
          />
        </div>
      </form>
    </Form>
  );
}
