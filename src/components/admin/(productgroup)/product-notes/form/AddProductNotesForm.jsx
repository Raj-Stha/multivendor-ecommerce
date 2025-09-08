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
  detail_name: z.string().min(1, "Detail Name is required"),
  returned: z.boolean(),
});

export default function AddproductNotesForm({ setIsOpen }) {
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      detail_name: "",
      returned: true,
    },
  });

  const uploadData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updateproductnotes`, {
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
      // Show success notification
      toast.success("Created Successfully !!!");
      setIsOpen(false);
      form.reset();
      router.refresh();
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
          <div className="grid space-y-4 py-4">
            <FormField
              control={form.control}
              name="detail_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2">Detail Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Detail Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="returned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="returned"
                    />
                  </FormControl>
                  <FormLabel htmlFor="returned">Returned</FormLabel>
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
