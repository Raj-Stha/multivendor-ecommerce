"use client";

import { useState } from "react";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
import imageToUrl from "@/lib/image-to-url";
import { toast } from "react-toastify";

const formSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, "Sub Category Name is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export default function AddNewSubCategory({ setIsOpen, data }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

  const router = useRouter();

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      name: "",
      categoryId: "",
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadType = async (values) => {
    try {
      const response = await fetch(
        `${baseUrl}/product/category/create-product-subcategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.backendToken}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      toast.success("Created Successfully !!!");

      // Close the dialog
      setIsOpen?.(false);

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);

      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);

    try {
      values.slug = await generateSlug(values.name);

      if (imageFile) {
        const { url } = await imageToUrl(imageFile);
        values.image = url;
      } 

      await uploadType(values);
    } catch (error) {
      console.error("Failed to create type: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        {/* <DialogTitle className="font-semibold">Add Type</DialogTitle> */}
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data &&
                        data.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div className="flex items-center gap-2 cursor-pointer">
                              {category.image && (
                                <Image
                                  src={category.image || "/placeholder.svg"}
                                  alt={category.name}
                                  width={20}
                                  height={20}
                                  className="rounded-sm object-cover"
                                />
                              )}
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Image Preview"
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
            )}
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
