"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
import { PenTool } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  vendor_id: z.string().min(1, "vendor is required"),
});

export default function EditVendorDetailsForm({
  data,
  categoryNotes = [],
  vendor,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  const [selectedVendorId, setSelectedVendorId] = useState(
    String(data?.vendor_id || "")
  );

  const [noteKeyValues, setNoteKeyValues] = useState(() => {
    const detail = data?.vendor_details || {};
    return Object.entries(detail)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => ({
        key,
        value: String(value),
      }));
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor_id: String(data?.vendor_id || ""),
    },
  });

  // Handle note checkbox toggle
  function handleNoteSelection(detailName, selected) {
    if (selected) {
      setNoteKeyValues((prev) => {
        if (prev.find((n) => n.key === detailName)) return prev;
        return [...prev, { key: detailName, value: "" }];
      });
    } else {
      setNoteKeyValues((prev) => prev.filter((n) => n.key !== detailName));
    }
  }

  // Update note value when user types
  function handleNoteValueChange(detailName, value) {
    setNoteKeyValues((prev) =>
      prev.map((n) => (n.key === detailName ? { key: detailName, value } : n))
    );
  }

  // Submit payload to backend
  const uploadData = async (payload) => {
    try {
      const response = await fetch(`${baseUrl}/updatevendordetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      toast.success("Updated Successfully!");
      setOpenBox(false);
      setTimeout(() => window.location.reload(), 500);
      return result;
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
      console.error("API call failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (values) => {
    setIsLoading(true);

    const payload = {
      vendor_id: parseInt(values.vendor_id),
    };

    noteKeyValues.forEach(({ key, value }) => {
      if (value) payload[key] = value;
    });

    const previousKeys = Object.keys(data?.vendor_details || {});
    previousKeys.forEach((prevKey) => {
      const stillSelected = noteKeyValues.find((n) => n.key === prevKey);
      if (!stillSelected) {
        payload[prevKey] = null;
      }
    });

    try {
      await uploadData(payload);
    } catch (error) {
      console.error("Failed to update vendor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openBox} onOpenChange={setOpenBox}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-green-600 hover:bg-green-600 hover:opacity-90 cursor-pointer hover:text-white text-white px-3 py-3"
        >
          <PenTool className="text-white" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Notes Section */}
            {selectedVendorId && (
              <div className="space-y-4 py-4">
                <Label>Select vendor Notes</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryNotes.map((note, index) => {
                    const isSelected = noteKeyValues.some(
                      (n) => n.key === note.detail_name
                    );
                    const noteValue =
                      noteKeyValues.find((n) => n.key === note.detail_name)
                        ?.value || "";

                    return (
                      <div
                        key={index}
                        className="space-y-2 p-3 border rounded-lg"
                      >
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              handleNoteSelection(
                                note.detail_name,
                                e.target.checked
                              )
                            }
                            className="rounded"
                          />
                          <span className="font-medium select-none">
                            {note.detail_name}
                          </span>
                          <Badge
                            variant={
                              note.returned === "true" ? "default" : "secondary"
                            }
                            className="text-xs select-none"
                          >
                            {note.returned === "true"
                              ? "Returned"
                              : "Not Returned"}
                          </Badge>
                        </label>

                        {isSelected && (
                          <Input
                            placeholder={`Enter value for ${note.detail_name}`}
                            value={noteValue}
                            onChange={(e) =>
                              handleNoteValueChange(
                                note.detail_name,
                                e.target.value
                              )
                            }
                            required
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit button */}
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
