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
  new_value: z.string().min(1, "New Value is required"),
});

export default function EditParameterForm({ data }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";
  const router = useRouter();

  console.log(data);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_value: data.parameter_value ?? "",
    },
  });

  const updateData = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/updateparameter`, {
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
    if (data.parameter_value == values.new_value) {
      return toast.error("Please Update the Value");
    }
    setIsLoading(true);
    values.old_value = data.parameter_value;
    values.parameter_name = data.parameter_name;
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
          <DialogTitle>Edit System Parameter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid space-y-4 py-4">
              <FormField
                control={form.control}
                name="new_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pb-2">Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Value" {...field} />
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
