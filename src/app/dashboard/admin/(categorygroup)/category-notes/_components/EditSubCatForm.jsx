"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
// import imageToUrl from "@/lib/image-to-url";
import { Edit } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
const formSchema = z.object({
  image: z.string().nullable().optional().or(z.literal("")),
  name: z.string().min(1, "Sub Category Name is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export default function EditSubCatForm({ subData, data }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(subData?.image);
  const [isLoad, setIsLoad] = useState(false);
  const [openBox, setOpenBox] = useState(false);

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

  // Find the current category ID for the tag
  const currentCategoryId =
    data?.find((category) =>
      category.subCategories?.some((cat) => cat.id === subData?.id)
    )?.id || "";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: subData?.image,
      name: subData?.name,
      categoryId: currentCategoryId,
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

  const updateData = async (values) => {
    console.log(values);
    try {
      const response = await fetch(
        `${baseUrl}/product/category/update-product-subcategory/id/${subData?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.backendToken}`,
          },
          body: JSON.stringify(values),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      }
      toast.success("Updated Successfully !!!");
      router.refresh();
      setOpenBox(false);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setIsLoad(false);
    }
  };

  const onSubmit = async (values) => {
    setIsLoad(true);
    values.id = subData?.id;

    if (values.name !== "") {
      values.slug = await generateSlug(values.name);
    }

    if (imageFile) {
      const { url } = await imageToUrl(imageFile);
      values.image = url;
    }

    await updateData(values);
  };

  return (
    <Dialog open={openBox} onOpenChange={setOpenBox}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0"
          title="Edit Sub-Category"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Sub-Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2">
                              {category.image && (
                                <div className="relative w-5 h-5 mr-1">
                                  <img
                                    src={category.image || "/placeholder.svg"}
                                    alt={category.name}
                                    className="w-5 h-5 rounded-sm object-cover"
                                  />
                                </div>
                              )}
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Image Preview"
                    className="w-24 h-24 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoad}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                {isLoad ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
