"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero({ banners = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Transform API response to UI format
  const formattedBanners = useMemo(() => {
    return banners.map((banner) => ({
      image: banner.image_url,
      primaryTitle: banner.banner_details?.sub_heading || "",
      title: banner.banner_name || "",
      description: banner.banner_details?.description || "",
      buttons: [
        {
          text: banner.banner_details?.bttn1_label,
          link: banner.banner_details?.bttn1_link,
        },
        {
          text: banner.banner_details?.bttn2_label,
          link: banner.banner_details?.bttn2_link,
        },
      ].filter((btn) => btn.text),
    }));
  }, [banners]);

  useEffect(() => {
    if (isHovered || formattedBanners.length === 0) return;

    const timer = setInterval(() => {
      handleSlideChange((activeSlide + 1) % formattedBanners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeSlide, formattedBanners.length, isHovered]);

  const handleSlideChange = (index) => {
    if (isAnimating || formattedBanners.length === 0) return;

    setPrevSlide(activeSlide);
    setIsAnimating(true);
    setActiveSlide(index);

    setTimeout(() => setIsAnimating(false), 700);
  };

  if (!formattedBanners.length) return null;

  const currentSlide = formattedBanners[activeSlide];
  const previousSlide =
    prevSlide !== null
      ? formattedBanners[prevSlide]
      : formattedBanners[activeSlide];

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
  };

  return (
    <div
      className="relative w-full max-h-[90vh] overflow-hidden jost-text"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🔹 Previous Slide */}
      {previousSlide && (
        <motion.div
          key={`prev-${prevSlide}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
          style={{ backgroundImage: `url(${previousSlide.image})` }}
        />
      )}

      {/* 🔹 Current Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`slide-${activeSlide}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentSlide.image})` }}
        />
      </AnimatePresence>

      {/* 🔹 Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 z-[1]" />

      {/* 🔹 Text Content */}
      <div className="relative z-[2] container mx-auto px-[3%] xl:px-[5%] h-[90vh] flex items-center">
        <div className="max-w-2xl text-white bg-black/40 rounded-xl px-5 py-5 xl:px-10 xl:py-10 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeSlide}`}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {currentSlide.primaryTitle && (
                <motion.h4
                  variants={textVariants}
                  custom={0}
                  className="text-sm sm:text-lg tracking-widest font-semibold uppercase mb-2"
                >
                  {currentSlide.primaryTitle}
                </motion.h4>
              )}

              <motion.h1
                variants={textVariants}
                custom={1}
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md text-white"
              >
                {currentSlide.title}
              </motion.h1>

              <motion.div
                variants={textVariants}
                custom={2}
                className="text-sm sm:text-base md:text-lg mb-8 text-white leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: currentSlide.description,
                }}
              />

              {Array.isArray(currentSlide.buttons) &&
                currentSlide.buttons.length > 0 && (
                  <motion.div
                    variants={textVariants}
                    custom={3}
                    className="flex flex-wrap gap-4"
                  >
                    {currentSlide.buttons.map((btn, index) => (
                      <Link
                        key={index}
                        href={btn.link || "#"}
                        className={`px-5 !py-4 text-sm sm:text-base shadow-md rounded-sm transition-transform hover:translate-y-[-3px] ${
                          index === 0
                            ? "bg-primary hover:bg-primary/90 text-white"
                            : "bg-white text-primary hover:text-white border border-secondary hover:bg-secondary"
                        }`}
                      >
                        {btn.text}
                      </Link>
                    ))}
                  </motion.div>
                )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 🔹 Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-[3]">
        {formattedBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3  cursor-pointer rounded-full transition-all duration-300 ${
              activeSlide === index
                ? "bg-primary scale-125"
                : "bg-white/70 hover:bg-white/90"
            }`}
          />
        ))}
      </div>

      {/* 🔹 Arrows */}
      <button
        onClick={() =>
          handleSlideChange(
            activeSlide === 0 ? formattedBanners.length - 1 : activeSlide - 1,
          )
        }
        className="absolute left-5 xl:left-15 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary hover:text-white transition-all p-3 rounded-full shadow-lg z-[3]"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() =>
          handleSlideChange((activeSlide + 1) % formattedBanners.length)
        }
        className="absolute right-5 xl:right-15 top-1/2 cursor-pointer -translate-y-1/2 bg-white/80 hover:bg-primary hover:text-white transition-all p-3 rounded-full shadow-lg z-[3]"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
