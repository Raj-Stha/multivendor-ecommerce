"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
  product_id: z.string().min(1, "Product is required"),
  variant_id: z.string().min(1, "Variant is required"),
});

export default function EditProductMapForm({ data, allProduct }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: "",
      variant_id: "",
    },
  });

  const selectedProduct = allProduct?.find(
    (product) => String(product.product_id) === selectedProductId
  );
  const availableVariants = selectedProduct?.variants || [];

  useEffect(() => {
    if (allProduct && allProduct.length > 0) {
      const firstProduct = allProduct[0];
      const firstVariant = firstProduct?.variants?.[0];

      if (firstProduct && firstVariant) {
        const productId = String(firstProduct.product_id);
        const variantId = String(firstVariant.variant_id);

        setSelectedProductId(productId);
        setSelectedVariantId(variantId);
        form.setValue("product_id", productId);
        form.setValue("variant_id", variantId);
      }
    }
  }, [allProduct, form]);

  useEffect(() => {
    if (selectedProduct && availableVariants.length > 0) {
      const firstAvailableVariant = availableVariants[0];
      setSelectedVariantId(String(firstAvailableVariant.variant_id));
      form.setValue("variant_id", String(firstAvailableVariant.variant_id));
    } else {
      setSelectedVariantId("");
      form.setValue("variant_id", "");
    }
  }, [selectedProductId, selectedProduct, availableVariants, form]);

  const updateData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updateproductmap`, {
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
      // setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values) => {
    values.vendor_id = data?.vendor_id;
    values.vendor_product_id = data?.vendor_product_id;
    values.vendor_variant_id = data?.vendor_variant_id;
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
          <PenTool className="text-white" /> Product Map
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] max-h-[80%] overflow-y-auto "
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Product Map </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="pb-2">Select Product</FormLabel>
                  <Select
                    className="w-full"
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedProductId(val);
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {allProduct?.map((product) => (
                        <SelectItem
                          key={product.product_id}
                          value={String(product.product_id)}
                          className="w-full"
                        >
                          {product.product_name}
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
              name="variant_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="pb-2">Select Variant</FormLabel>
                  <Select
                    className="w-full"
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedVariantId(val);
                    }}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={
                      !selectedProductId || availableVariants.length === 0
                    }
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a variant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {availableVariants.map((variant) => (
                        <SelectItem
                          key={variant.variant_id}
                          value={String(variant.variant_id)}
                          className="w-full"
                        >
                          {variant.variant_description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
