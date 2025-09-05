"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import ClassNames from "embla-carousel-class-names";

export default function ProductGallery({
  variants = [],
  selectedVariantIndex = 0,
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const safeVariants = variants || [];
  const safeSelectedIndex = Math.max(
    0,
    Math.min(selectedVariantIndex || 0, safeVariants.length - 1)
  );

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: true,
    },
    [ClassNames()]
  );

  // Organize all images by variant with metadata
  const allImages = [];
  safeVariants.forEach((variant, variantIndex) => {
    // Add featured image first
    if (variant.featured_image) {
      allImages.push({
        url: variant.featured_image,
        variantIndex: variantIndex,
        variantId: variant.variant_id,
        variantDescription: variant.variant_description,
        type: "featured",
      });
    }

    // Add product images
    if (Array.isArray(variant.product_image)) {
      variant.product_image.forEach((img) => {
        if (img?.image) {
          allImages.push({
            url: img.image,
            variantIndex: variantIndex,
            variantId: variant.variant_id,
            variantDescription: variant.variant_description,
            type: "product",
          });
        }
      });
    }
  });

  // Find the first image index for the selected variant
  const getFirstImageIndexForVariant = (variantIndex) => {
    return allImages.findIndex((img) => img.variantIndex === variantIndex);
  };

  // Reset to first image of selected variant when variant changes
  useEffect(() => {
    const firstImageIndex = getFirstImageIndexForVariant(safeSelectedIndex);
    if (firstImageIndex !== -1) {
      setSelectedImageIndex(firstImageIndex);
      // Scroll thumbnail carousel to show selected variant's first image
      if (emblaApi) {
        emblaApi.scrollTo(firstImageIndex);
      }
    }
  }, [safeSelectedIndex, emblaApi]);

  const handleThumbnailClick = useCallback(
    (index) => {
      setSelectedImageIndex(index);
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  // Handle embla select event
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    setSelectedImageIndex(selectedIndex);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  if (!safeVariants.length || !allImages.length) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const currentImage = allImages[selectedImageIndex];

  return (
    <div className="w-full space-y-3">
      {/* Main Image Display */}
      <div className="relative w-full aspect-[16/12] bg-white overflow-hidden rounded-lg">
        <Image
          src={currentImage?.url || "/placeholder.svg"}
          alt={`${currentImage?.variantDescription || "Product"} Image`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />

        {/* Variant indicator on main image */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {currentImage?.variantDescription}
          {currentImage?.type === "featured" && " ⭐"}
        </div>

        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {selectedImageIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnail Slider */}
      {allImages.length > 1 && (
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-2">
            {allImages.map((img, index) => {
              const globalIndex = index;

              return (
                <div
                  key={`thumb-${img.variantId}-${index}`}
                  className="embla__slide flex-shrink-0"
                >
                  <button
                    onClick={() => handleThumbnailClick(globalIndex)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 focus:outline-none transition-all relative ${
                      selectedImageIndex === globalIndex
                        ? "border-blue-500 shadow-md ring-2 ring-blue-200 scale-105"
                        : img.variantIndex === safeSelectedIndex
                        ? "border-blue-300 hover:border-blue-400"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`${img.variantDescription} ${img.type} image`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />

                    {/* Featured image indicator */}
                    {img.type === "featured" && (
                      <div className="absolute top-1 right-1 bg-yellow-500 text-white text-[10px] px-1 rounded">
                        ⭐
                      </div>
                    )}

                    {/* Variant divider indicator */}
                    {index > 0 &&
                      allImages[index - 1]?.variantIndex !==
                        img.variantIndex && (
                        <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-blue-400"></div>
                      )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional: Variant indicators below thumbnails
      <div className="flex gap-2 justify-center">
        {safeVariants.map((variant, variantIndex) => {
          const variantImageCount = allImages.filter(img => img.variantIndex === variantIndex).length;
          const isCurrentVariant = currentImage?.variantIndex === variantIndex;
          
          return (
            <div
              key={variant.variant_id}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                isCurrentVariant
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {variant.variant_description} ({variantImageCount})
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
