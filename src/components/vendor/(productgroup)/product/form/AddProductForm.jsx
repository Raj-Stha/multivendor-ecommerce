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

const formSchema = z.object({
  vendor_product_name: z.string().min(1, "Product Name is required"),
  tax1_rate: z.coerce.number().min(0, "Tax Rate (1) is required"),
  tax2_rate: z.coerce.number().min(0, "Tax Rate (2) is required"),
  tax3_rate: z.coerce.number().min(0, "Tax Rate (3) is required"),
  restricted: z.boolean(),
  active: z.boolean(),
});

export default function AddProductForm({ setIsOpen }) {
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor_product_name: "",
      tax1_rate: 0,
      tax2_rate: 0,
      tax3_rate: 0,
      restricted: false,
      active: true,
    },
  });

  const uploadData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updatevendorproducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();

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
    setIsLoading(true);
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
          <div className=" py-2">
            <FormField
              control={form.control}
              name="vendor_product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2">Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tax1_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-2">Tax Rate (1)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tax Rate (1)"
                    {...field}
                    type="number"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax2_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-2">Tax Rate (2)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tax Rate (2)"
                    {...field}
                    type="number"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax3_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-2">Tax Rate (3)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tax Rate (3)"
                    {...field}
                    type="number"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
