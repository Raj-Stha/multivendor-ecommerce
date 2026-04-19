"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PenTool, X, Star } from "lucide-react";

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
import { toast } from "react-toastify";

export default function EditVariantsForm({ data, productID, images }) {
  const router = useRouter();
  const [openBox, setOpenBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ✅ Load existing images (FIXED — direct image_id use)
  useEffect(() => {
    if (data) {
      const existing =
        data.product_image?.map((img) => ({
          image_url: img.image,
          image_id: Number(img.image_id), // ✅ direct usage
          featured: img.featured,
        })) || [];

      setSelectedImages(existing);
      setUploadedImages([]);
    }
  }, [data]);

  // Featured logic
  const setFeatured = (index, type) => {
    if (type === "existing") {
      setSelectedImages((prev) =>
        prev.map((img, i) => ({
          ...img,
          featured: i === index,
        })),
      );

      setUploadedImages((prev) =>
        prev.map((img) => ({
          ...img,
          featured: false,
        })),
      );
    }

    if (type === "uploaded") {
      setUploadedImages((prev) =>
        prev.map((img, i) => ({
          ...img,
          featured: i === index,
        })),
      );

      setSelectedImages((prev) =>
        prev.map((img) => ({
          ...img,
          featured: false,
        })),
      );
    }
  };

  // Remove existing
  const removeExisting = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded
  const removeUploaded = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload new image
  const uploadImage = async (image64) => {
    try {
      const res = await fetch(`${baseUrl}/updateimages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image64,
          active: true,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");

      return await res.json();
    } catch (err) {
      toast.error(err.message || "Upload failed");
      return null;
    }
  };

  // Bulk update
  const updateVariantImagesBulk = async (payload) => {
    const res = await fetch(`${baseUrl}/updateproductimage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Update failed");
    }

    return await res.json();
  };

  // Upload file handler
  const handleUploadChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 200 * 1024) {
        toast.error(`${file.name} too large`);
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setUploadedImages((prev) => [
          ...prev,
          {
            preview: reader.result,
            featured: false,
          },
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  // Add from library
  const addFromLibrary = (img) => {
    const id = Number(img.image_id);

    if (selectedImages.some((i) => i.image_id === id)) return;

    setSelectedImages((prev) => [
      ...prev,
      {
        image_id: id,
        image_url: img.image_url || img.thumbnail_url || img.image,
        featured: false,
      },
    ]);
  };

  // Final Submit
  const onSubmit = async () => {
    setIsLoading(true);

    try {
      const uploadedFinal = [];

      // Upload new images
      for (const img of uploadedImages) {
        const result = await uploadImage(img.preview.split(",")[1]);

        const newId = result?.details?.[0]?.image_id;

        if (!newId) continue;

        uploadedFinal.push({
          image_id: Number(newId),
          featured: img.featured,
        });
      }

      // ✅ Remaining list
      const remainingImages = [
        ...selectedImages.map((img) => ({
          image_id: Number(img.image_id),
          featured: img.featured,
        })),
        ...uploadedFinal,
      ];

      if (remainingImages.length === 0) {
        toast.error("You must have at least one image!");
        setIsLoading(false);
        return;
      }

      // Build payload
      const payload = remainingImages.map((img) => ({
        variant_id: data.variant_id,
        image_id: img.image_id,
        featured: img.featured ? "true" : "false",
      }));

      await updateVariantImagesBulk(payload);

      toast.success("Images Updated Successfully!");

      router.refresh();
      setOpenBox(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={openBox} onOpenChange={setOpenBox}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PenTool size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[620px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Variant Images</DialogTitle>
        </DialogHeader>

        <Label>Selected / Uploaded Images</Label>

        <div className="grid grid-cols-4 gap-3 mt-2">
          {selectedImages.map((img, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setFeatured(index, "existing")}
            >
              <img src={img.image_url} className="w-full h-24 object-cover" />

              {img.featured && (
                <Star
                  className="absolute top-1 left-1 bg-primary rounded-2xl p-1 text-white shadow-5xl "
                  size={32}
                />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeExisting(index);
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {uploadedImages.map((img, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setFeatured(index, "uploaded")}
            >
              <img src={img.preview} className="w-full h-24 object-cover" />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeUploaded(index);
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Upload */}
        <div className="mt-4">
          <Label>Upload New Images</Label>

          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUploadChange}
          />
        </div>

        {/* Library */}
        <div className="mt-4">
          <Label>Select From Library</Label>

          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto border p-2 rounded-md">
            {images?.map((img) => (
              <img
                key={img.image_id}
                src={img.thumbnail_url || img.image_url}
                onClick={() => addFromLibrary(img)}
                className="w-full h-20 object-cover rounded cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
