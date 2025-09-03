"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductGallery({
  variants = [],
  selectedVariantIndex = 0,
}) {
  console.log(variants);
  console.log(selectedVariantIndex);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const safeVariants = variants || [];
  const safeSelectedIndex = Math.max(
    0,
    Math.min(selectedVariantIndex || 0, safeVariants.length - 1)
  );

  // Gather all images for selected variant
  const currentVariantImages = [
    safeVariants[safeSelectedIndex]?.featured_image,
    ...(Array.isArray(safeVariants[safeSelectedIndex]?.product_image)
      ? safeVariants[safeSelectedIndex].product_image
          .map((img) => img?.image)
          .filter(Boolean)
      : []),
  ].filter(Boolean);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [safeSelectedIndex]);

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  if (!safeVariants.length || !currentVariantImages.length) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="relative w-full aspect-square bg-white overflow-hidden rounded-lg">
        <Image
          src={currentVariantImages[selectedImageIndex] || "/placeholder.svg"}
          alt={`Product Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {currentVariantImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {currentVariantImages.map((img, index) => (
            <button
              key={`thumb-${safeSelectedIndex}-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 focus:outline-none transition-all ${
                selectedImageIndex === index
                  ? "border-blue-500 shadow-md ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
