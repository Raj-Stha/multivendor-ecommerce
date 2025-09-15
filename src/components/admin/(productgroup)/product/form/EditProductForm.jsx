"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { PenTool } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  new_product_name: z.string().min(1, "Product Name is required"),
  category_id: z.string().min(1, "Category is required"),
  manufacturer_id: z.string().min(1, "Manufacturer is required"),
  restricted: z.boolean(),
  active: z.boolean(),
});

export default function EditProductForm({ data, category, manu }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    data?.category_id || ""
  );

  const [selectedManuId, setSelectedManuId] = useState(
    data?.manufacturer_id || ""
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_product_name: data?.product_name ?? "",
      category_id: selectedCategoryId ? String(selectedCategoryId) : "",
      manufacturer_id: selectedManuId ? String(selectedManuId) : "",
      restricted: data?.restricted ?? false,
      active: data?.active ?? true,
    },
  });

  const updateData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updateproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Something went wrong!");

      router.refresh();
      setOpenBox(false);
      form.reset();
      toast.success("Updated Successfully !!!");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values) => {
    values.product_name = data?.product_name;
    setIsLoading(true);
    await updateData(values);
  };

  return (
    <Dialog open={openBox} onOpenChange={setOpenBox}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className=" bg-green-600 hover:bg-green-600 hover:opacity-90 cursor-pointer hover:text-white  text-white px-3 py-3"
        >
          <PenTool className="text-white" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80%] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Edit Product </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid py-2">
              <FormField
                control={form.control}
                name="new_product_name"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
}
