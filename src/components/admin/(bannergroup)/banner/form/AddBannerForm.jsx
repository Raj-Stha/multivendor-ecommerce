"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

const formSchema = z.object({
  promo_name: z.string().min(1, "Promo Name is required"),
  valid_from: z.string().min(1, "Valid From date is required"),
  valid_to: z.string().min(1, "Valid To date is required"),
  active: z.boolean(),
});

export default function AddPromoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setIsOpen] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promo_name: "",
      valid_from: "",
      valid_to: "",
      active: true,
    },
  });

  const uploadData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updatepromos`, {
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
    const payload = {
      ...values,
      valid_from: values.valid_from.split("T")[0], // always YYYY-MM-DD
      valid_to: values.valid_to.split("T")[0], // always YYYY-MM-DD
      active: values.active ? "true" : "false", // convert boolean to string
    };
    try {
      await uploadData(payload);
    } catch (error) {
      console.error("Failed to create type:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4 hover:bg-primary hover:opacity-90">
            <PlusIcon className="w-5 h-5" />
            <span className="hidden md:inline">Add Promo</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add New Promo</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid space-y-4 pt-4 pb-2">
                <FormField
                  control={form.control}
                  name="promo_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pb-2">Promo Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Promo Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 pb-2 gap-4">
                <FormField
                  control={form.control}
                  name="valid_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pb-2">Valid From</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valid_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pb-2">Valid To</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
