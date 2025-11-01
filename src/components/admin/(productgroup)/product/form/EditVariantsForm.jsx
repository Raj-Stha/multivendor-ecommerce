"use client";
import { useState, useEffect } from "react";
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
  new_variant_description: z.string().min(1, "Variant Description is required"),
});

export default function EditVariantsForm({ data, productID }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openBox, setOpenBox] = useState(false);
  const [imagePreview, setImagePreview] = useState(data?.featured_image);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_variant_description: data.variant_description ?? "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        new_variant_description: data.variant_description ?? "",
      });
      setImagePreview(data?.featured_image);
    }
  }, [data, form]);

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

  const updateData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updatevariants`, {
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
    setIsLoading(true);
    values.variant_description = data?.variant_description;
    values.product_id = productID;

    if (data?.featured_image !== imagePreview) {
      let uploadImageData = {
        image64: imagePreview ? imagePreview.split(",")[1] : null,
        active: true,
      };

      const result = await uploadImage(uploadImageData);
      if (result) {
        let updateVariantImageData = {
          image_id: result?.details[0]?.image_id,
          variant_id: data?.variant_id,
          featured: true,
        };

        await updateVariantImage(updateVariantImageData);
      }
    }

    await updateData(values);
  };

  return (
    <Dialog open={openBox} onOpenChange={setOpenBox}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className=" bg-gray-100 hover:bg-gray-200 hover:opacity-90 cursor-pointer  px-3 py-3"
        >
          <PenTool className="" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] max-h-[80%] overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Variant </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-input" className="pb-2">
                Variant Image
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
            <div className="grid space-y-4 py-4">
              <FormField
                control={form.control}
                name="new_variant_description"
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
