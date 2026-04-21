"use client";

import { useState, useEffect, useMemo } from "react";
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

// Skeleton loader
const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
    <div className="h-6 bg-gray-300 rounded w-2/3"></div>
  </div>
);

// Guest Schema
const guestSchema = z.object({
  user_login_name: z.string().min(1, "Username is required"),
  useremail: z.string().email("Invalid email address"),
});

// Logged-in schema (empty)
const loggedInSchema = z.object({});

export function CheckoutList() {
  const router = useRouter();

  const { cart, getCart } = useCart();
  const { user, getUser } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Detect login state
  useEffect(() => {
    setIsLoggedIn(!!user?.[0]?.user_login_name);
  }, [user]);

  // Dynamic schema
  const schema = useMemo(() => {
    return isLoggedIn ? loggedInSchema : guestSchema;
  }, [isLoggedIn]);

  // Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      user_login_name: "",
      useremail: "",
    },
  });

  // Fetch cart + user
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getCart(), getUser()]);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Redirect if cart empty
  useEffect(() => {
    if (!isLoading && cart?.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);

  // Submit order
  const handleCompleteOrder = async (data) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      let payload;

      if (isLoggedIn) {
        payload = {
          user_login_name: user?.[0]?.user_login_name,
          user_email: user?.[0]?.user_email,
        };
      } else {
        payload = {
          user_login_name: data.user_login_name,
          user_email: data.useremail,
        };
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/publishcart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to complete order");
      }

      toast.success("Order completed successfully 🎉");

      router.push("/products");
    } catch (err) {
      console.error(err);

      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8">
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (cart?.length === 0) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCompleteOrder)}
        className="flex flex-col md:flex-row gap-8 max-w-7xl justify-between mx-auto py-8"
      >
        {/* LEFT SIDE */}
        <div className="space-y-8 w-full md:w-2/3">
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>

          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚚 User Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Logged-in View */}
              {isLoggedIn && user?.[0] ? (
                <div className="space-y-2">
                  <div>
                    <Label>Username</Label>
                    <Input value={user?.[0]?.user_login_name} readOnly />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input value={user?.[0]?.user_email} readOnly />
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
                </>
              )}

              {/* Address */}
              {user?.[0]?.delivery_address && (
                <div>
                  <Label>Delivery Location</Label>

                  <p className="text-sm border-2 p-2 mt-3 rounded-md">
                    {user?.[0]?.delivery_address}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6 w-full md:w-1/3">
          <OrderSummary
            cartData={cart}
            isLoading={isLoading}
            onCompleteOrder={form.handleSubmit(handleCompleteOrder)}
          />
        </div>
      </form>
    </Form>
  );
}
