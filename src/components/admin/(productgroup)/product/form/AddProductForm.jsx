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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  product_name: z.string().min(1, "Product Name is required"),
  category_id: z.string().min(1, "Category is required"),
  manufacturer_id: z.string().min(1, "Manufacturer is required"),
  restricted: z.boolean(),
  active: z.boolean(),
});

export default function AddProductForm({ manu = [], category = [] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setIsOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    category?.[0]?.category_id || ""
  );

  const [selectedManuId, setSelectedManuId] = useState(
    manu?.[0]?.manufacturer_id || ""
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      category_id: selectedCategoryId ? String(selectedCategoryId) : "",
      manufacturer_id: selectedManuId ? String(selectedManuId) : "",
      restricted: false,
      active: true,
    },
  });

  const uploadData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updateproduct`, {
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
    try {
      await uploadData(values);
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
            <span className="hidden md:inline">Add Product</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[500px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid  pt-2">
                <FormField
                  control={form.control}
                  name="product_name"
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
                name="category_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="pb-2">Category</FormLabel>
                    <Select
                      className="w-full"
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedCategoryId(val);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {category?.map((cat) => (
                          <SelectItem
                            key={cat.category_id}
                            value={String(cat.category_id)}
                            className="w-full"
                          >
                            {cat.category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturer_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="pb-2">Manufacturer</FormLabel>
                    <Select
                      className="w-full"
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedManuId(val);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Manufacturer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {manu?.map((cat) => (
                          <SelectItem
                            key={cat.manufacturer_id}
                            value={String(cat.manufacturer_id)}
                            className="w-full"
                          >
                            {cat.manufacturer_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 pt-2 gap-4">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
