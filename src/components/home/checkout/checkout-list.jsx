"use client";

import { useState } from "react";
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
  fullName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
});

export function CheckoutList({ cartData, user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState("");
  let lat = "";
  let long = "";

  console.log(user);
  let deliveryLocation = "(9.255,9.6666)";
  const match = deliveryLocation.match(/\(([^,]+),([^,]+)\)/);

  if (match) {
    lat = parseFloat(match[2].trim()); // second part
    long = parseFloat(match[1].trim()); // first part
  }

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const handleLocationSelect = (lat, lng) => {
    const coordinates = `${lng}, ${lat}`;
    setLocationCoordinates(coordinates);
  };

  console.log(locationCoordinates);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log("Submitting checkout:", values);

      // Example API call
      // const res = await fetch("/api/checkout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...values, cart: cartData }),
      // });

      // if (!res.ok) throw new Error("Checkout failed");

      // toast.success("Order placed successfully!");
      // router.push("/thank-you");
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
        className="flex gap-8 max-w-7xl justify-between mx-auto"
      >
        {/* LEFT: Shipping Info */}
        <div className="space-y-8 w-[65%]">
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-accent">🚚</span>
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className=" ">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        placeholder="+1 (555) 123-4567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {location ? (
                <div className="space-y-4">
                  <Label>Delivery Location</Label>
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={"(85.324, 27.7172)"}
                  />
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="pb-2">Latitude</Label>
                        <Input value={lat} readOnly className="font-mono" />
                      </div>
                      <div>
                        <Label className="pb-2">Longitude</Label>
                        <Input value={long} readOnly className="font-mono" />
                      </div>
                    </div>
                    {/* {coordinates.address && (
                      <div className="pb-2">
                        <Label className="pb-2">Address</Label>
                        <Input
                          value={coordinates.address}
                          readOnly
                          className="text-sm"
                        />
                      </div>
                    )} */}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="space-y-6 w-[35%]">
          <OrderSummary cartData={cartData} isLoading={isLoading} />
        </div>
      </form>
    </Form>
  );
}
