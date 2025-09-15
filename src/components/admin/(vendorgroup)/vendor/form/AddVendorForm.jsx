"use client";

import { useState } from "react";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import LocationPicker from "../../../../../lib/locationpicker";

const formSchema = z.object({
  vendor_name: z.string().min(1, "Vendor Name is required"),
  restricted: z.boolean(),
  active: z.boolean(),
});

export default function AddVendorForm({ setIsOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState("");
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor_name: "",
      restricted: false,
      active: true,
    },
  });

  const handleLocationSelect = (lat, lng, address) => {
    const coordinates = `${lng}, ${lat}`;
    setLocationCoordinates(coordinates);
  };

  const uploadData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updatevendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      console.log(result);

      // Show success notification
      toast.success("Created Successfully !!!");

      // Close the dialog
      setIsOpen?.(false);

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);

      return result;
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
      console.error("API call failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values) => {
    if (!locationCoordinates) {
      return toast.error("Select the Location");
    }

    setIsLoading(true);
    values.vendor_location = locationCoordinates;
    try {
      await uploadData(values);
    } catch (error) {
      console.error("Failed to create type:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid space-y-4 py-4">
            <FormField
              control={form.control}
              name="vendor_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2">Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vendor Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <Label>Vendor Location</Label>
            <LocationPicker onLocationSelect={handleLocationSelect} />
            {/* {locationCoordinates && (
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-sm font-medium">
                  Selected Coordinates:
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {locationCoordinates}
                </p>
              </div>
            )} */}
          </div>

          <div className="grid grid-cols-1 pt-2 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="restricted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="restricted"
                    />
                  </FormControl>
                  <FormLabel htmlFor="restricted">Restricted</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="active"
                    />
                  </FormControl>
                  <FormLabel htmlFor="active">Active</FormLabel>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="flex justify-end sm:justify-end mt-4">
            <Button type="submit" className="px-6" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
