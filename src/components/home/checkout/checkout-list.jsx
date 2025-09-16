"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { OrderSummary } from "./order-summary";
import LocationPicker from "@/lib/locationpicker";

// ✅ Validation Schema
const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
});

export function CheckoutList({ cartData, user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // location state
  const [locationCoordinates, setLocationCoordinates] = useState({
    lat: "",
    lon: "",
    name: "",
  });

  // ✅ prefill values
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // ✅ Load location based on session or guest
  useEffect(() => {
    if (user) {
      // Logged-in user: try to use backend delivery_location
      if (user.delivery_location) {
        setLocationCoordinates(user.delivery_location);
      }
    } else {
      // Guest: check localStorage
      const stored = localStorage.getItem("user_location");
      if (stored) {
        setLocationCoordinates(JSON.parse(stored));
      }
    }
  }, [user]);

  // ✅ When user picks new location (only for guest)
  const handleLocationSelect = (lat, lon, name) => {
    const loc = { lat, lon, name };
    setLocationCoordinates(loc);

    // Save to localStorage only if guest
    if (!user) {
      localStorage.setItem("user_location", JSON.stringify(loc));
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        cart: cartData,
        delivery_location: locationCoordinates,
      };

      console.log("Submitting checkout:", payload);

      // Example API call
      // const res = await fetch("/api/checkout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      // if (!res.ok) throw new Error("Checkout failed");

      toast.success("Order placed successfully!");
      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-8 max-w-7xl justify-between mx-auto"
      >
        {/* LEFT: Shipping Info */}
        <div className="space-y-8 w-full md:w-2/3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          </div>
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">🚚</span>
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        readOnly={!!user} // make read-only if logged in
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        readOnly={!!user}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+977 9800000000"
                        {...field}
                        readOnly={!!user}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Delivery Location */}
              {user ? (
                // Logged-in user: show delivery location only
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Delivery Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="pb-2">Latitude</Label>
                        <Input
                          value={locationCoordinates.lat}
                          readOnly
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <Label className="pb-2">Longitude</Label>
                        <Input
                          value={locationCoordinates.lon}
                          readOnly
                          className="font-mono"
                        />
                      </div>
                    </div>
                    {locationCoordinates.name && (
                      <div>
                        <Label className="pb-2">Address</Label>
                        <Input
                          value={locationCoordinates.name}
                          readOnly
                          className="text-sm"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                // Guest user: show map picker
                <div className="space-y-4">
                  <Label>Select Delivery Location</Label>
                  <LocationPicker
                    onLocationSelect={(lat, lon, name) =>
                      handleLocationSelect(lat, lon, name)
                    }
                    initialLocation={
                      locationCoordinates.lat && locationCoordinates.lon
                        ? `(${locationCoordinates.lat},${locationCoordinates.lon})`
                        : "(85.324,27.7172)" // default to Kathmandu
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="space-y-6 w-full md:w-1/3">
          <OrderSummary cartData={cartData} isLoading={isLoading} />
        </div>
      </form>
    </Form>
  );
}
