"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { PenTool, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";

const formSchema = z.object({
  vendor_variant_description: z
    .string()
    .min(1, "Variant Description is required"),
  available_count: z.coerce.number().min(0, "Stock is required"),
  product_price: z.coerce.number().min(0, "Price is required"),
  product_discount: z.coerce.number().min(0, "Discount Price is required"),
});

export default function AddVariantsForm({ productID }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor_variant_description: "",
      available_count: 0,
      product_discount: 0,
      product_price: 0,
    },
  });

  const updateData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updatevendorvariants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Something went wrong!");

      toast.success("Added Successfully !!!");
      setOpenBox(false);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    values.vendor_product_id = productID;
    await updateData(values);
  };

  return (
    <Dialog open={openBox} onOpenChange={setOpenBox}>
      <DialogTrigger asChild>
        <Button variant="outline" className=" bg-blue-100 cursor-pointer px-3 ">
          <Plus className="" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] max-h-[80%] overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Product Variant </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2">Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Price"
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
              name="product_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2">Discount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Discount"
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
              name="available_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2">Stock</FormLabel>
                  <FormControl>
                    <Input placeholder="Stock" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendor_variant_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pb-2">Variant Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Variant Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end sm:justify-end mt-4">
              <Button type="submit" className="px-6" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
