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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";

const formSchema = z.object({
  new_category_name: z.string().min(1, "Category Name is required"),
  restricted: z.boolean(),
  active: z.boolean(),
});

export default function EditCategoryForm({ data }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openBox, setOpenBox] = useState(false);
  const [imagePreview, setImagePreview] = useState(data?.featured_image ?? "");

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_category_name: data?.category_name ?? "",
      restricted: data?.restricted ?? false,
      active: data?.active ?? true,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024) {
        toast.error("Image too large. Max 200KB allowed.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updateimages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Something went wrong!");
      return await response.json();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updatecategory`, {
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
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const updateVariantImage = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updateproductimage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Something went wrong!");
      return await response.json();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values) => {
    values.category_name = data?.category_name;
    setIsLoading(true);

    // if (data?.featured_image !== imagePreview) {
    //   let uploadImageData = {
    //     image64: imagePreview ? imagePreview.split(",")[1] : null,
    //     active: true,
    //   };

    //   const result = await uploadImage(uploadImageData);
    //   if (result) {
    //     let updateVariantImageData = {
    //       image_id: result?.details[0]?.image_id,
    //       variant_id: data?.variant_id,
    //       featured: true,
    //     };

    //     await updateVariantImage(updateVariantImageData);
    //   }
    // }
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
      <DialogContent
        className="sm:max-w-[500px] max-h-[80%] overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid space-y-4 py-4">
              <FormField
                control={form.control}
                name="new_category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pb-2">Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-input" className="pb-2">
                Category Image
              </Label>
              <Input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>

            {imagePreview && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm text-gray-600">Preview</Label>
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}

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
