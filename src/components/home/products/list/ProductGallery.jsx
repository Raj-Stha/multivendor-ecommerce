"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";

export default function ProductGallery({
  variant,
  variants = [],
  selectedVariantIndex = 0,
}) {
  /**
   * Support both:
   * variant (ProductDetails)
   * variants + index (ProductCard)
   */

  let selectedVariant = variant;

  if (!selectedVariant && variants.length > 0) {
    selectedVariant =
      variants[
        Math.max(0, Math.min(selectedVariantIndex, variants.length - 1))
      ];
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Embla
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: true,
    },
    [ClassNames()],
  );

  /**
   * Build images
   */
  const variantImages = useMemo(() => {
    if (!selectedVariant) return [];

    const images = [];

    if (selectedVariant.featured_image) {
      images.push({
        url: selectedVariant.featured_image,
        type: "featured",
        variantDescription: selectedVariant.variant_description,
      });
    }

    if (Array.isArray(selectedVariant.product_image)) {
      selectedVariant.product_image.forEach((img) => {
        if (img?.image) {
          images.push({
            url: img.image,
            type: "product",
            variantDescription: selectedVariant.variant_description,
          });
        }
      });
    }

    // Remove duplicates
    return images.filter(
      (img, index, self) => index === self.findIndex((t) => t.url === img.url),
    );
  }, [selectedVariant]);

  /**
   * Reset on change
   */
  useEffect(() => {
    setSelectedImageIndex(0);

    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [selectedVariant, emblaApi]);

  /**
   * Thumbnail click
   */
  const handleThumbnailClick = useCallback(
    (index) => {
      setSelectedImageIndex(index);

      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi],
  );

  /**
   * Sync embla
   */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  /**
   * SAFETY CHECK
   */
  if (!variantImages.length) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const currentImage = variantImages[selectedImageIndex] || variantImages[0];

  return (
    <div className="w-full space-y-3">
      {/* Main Image */}
      <div className="relative w-full aspect-[16/12] bg-white overflow-hidden rounded-lg">
        <Image
          src={currentImage?.url || "/placeholder.svg"}
          alt={currentImage?.variantDescription || "Product"}
          fill
          className="object-cover"
          priority
        />

        {/* Counter */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {selectedImageIndex + 1} / {variantImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {variantImages.length > 1 && (
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-2">
            {variantImages.map((img, index) => (
              <div key={index} className="embla__slide flex-shrink-0">
                <button
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt="Thumbnail"
                    className="object-cover cursor-pointer w-full h-full"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
