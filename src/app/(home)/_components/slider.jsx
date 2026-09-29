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
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.55,
        ease: "easeOut",
      },
    }),

    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.35,
      },
    },
  };

  return (
    <div
      className="relative max-w-7xl mt-[15%] sm:mt-[9%] lg:mt-[5%] xl:mt-[4%] mx-auto "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* =========================================================
          HERO BANNER
      ========================================================= */}
      <div
        className="
          relative
          mx-auto
          w-[calc(100%-32px)]
          max-w-[1485px]
          h-[240px]
          sm:h-[320px]
          overflow-hidden
          rounded-[10px]
        "
      >
        {/* =========================================================
            PREVIOUS SLIDE
        ========================================================= */}
        {previousSlide && (
          <motion.div
            key={`prev-${prevSlide}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${previousSlide.image})`,
            }}
          />
        )}

        {/* =========================================================
            CURRENT SLIDE
        ========================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${activeSlide}`}
            initial={{
              opacity: 0,
              scale: 1.03,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.03,
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentSlide.image})`,
            }}
          />
        </AnimatePresence>

        {/* =========================================================
            IMAGE OVERLAY
        ========================================================= */}
        <div className="absolute inset-0 bg-black/15 z-[1]" />

        {/* =========================================================
            CENTER TEXT CONTENT
        ========================================================= */}
        <div
          className="
            relative
            z-[2]
            h-full
            w-full
            flex
            items-center
            justify-center
            text-center
            px-8
            sm:px-6
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeSlide}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                flex
                flex-col
                items-center
                justify-center
                max-w-[900px]
                text-white
              "
            >
              {/* =====================================================
                  PRIMARY TITLE / SUB HEADING
              ===================================================== */}
              {currentSlide.primaryTitle && (
                <motion.h4
                  variants={textVariants}
                  custom={0}
                  className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    tracking-[0.04em]
                    font-semibold
                    mb-2
                    text-white
                    drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)]
                  "
                >
                  {currentSlide.primaryTitle}
                </motion.h4>
              )}

              {/* =====================================================
                  MAIN TITLE
              ===================================================== */}
              <motion.h1
                variants={textVariants}
                custom={1}
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  lg:text-[34px]
                  font-bold
                  mb-2
                  leading-tight
                  text-white
                  drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]
                "
              >
                {currentSlide.title}
              </motion.h1>

              {/* =====================================================
                  DIVIDER
              ===================================================== */}

              {/* =====================================================
                  DESCRIPTION
              ===================================================== */}
              {currentSlide.description && (
                <motion.div
                  variants={textVariants}
                  custom={3}
                  className="
                    text-sm
                    sm:text-base
                    md:text-[16px]
                    font-medium
                  
                    text-white
                    leading-relaxed
                    drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]
                    max-w-[700px]
                  "
                  dangerouslySetInnerHTML={{
                    __html: currentSlide.description,
                  }}
                />
              )}

              {/* =====================================================
                  BUTTONS
              ===================================================== */}
              {Array.isArray(currentSlide.buttons) &&
                currentSlide.buttons.length > 0 && (
                  <motion.div
                    variants={textVariants}
                    custom={4}
                    className="
                      flex
                      flex-wrap
                      justify-center
                      gap-3
                      mt-6
                      sm:mt-7
                    "
                  >
                    {currentSlide.buttons.map((btn, index) => (
                      <Link
                        key={index}
                        href={btn.link || "#"}
                        className={`
                          inline-flex
                          items-center
                          justify-center
                          min-w-[108px]
                          px-5
                          py-3
                          text-xs
                          sm:text-sm
                          font-semibold
                          uppercase
                          rounded-[4px]
                          shadow-md
                          transition-all
                          duration-300
                          hover:-translate-y-[2px]
                          ${
                            index === 0
                              ? "bg-[#263447] hover:bg-[#1d2838] text-white"
                              : "bg-white text-[#263447] hover:bg-[#263447] hover:text-white border border-white"
                          }
                        `}
                      >
                        {btn.text}
                      </Link>
                    ))}
                  </motion.div>
                )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =========================================================
            ORIGINAL NAVIGATION DOTS
            ⚠️ KEPT EXACTLY AS YOUR ORIGINAL CODE
        ========================================================= */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-[3]">
          {formattedBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-3 h-3 cursor-pointer rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? "bg-primary scale-125"
                  : "bg-white/70 hover:bg-white/90"
              }`}
            />
          ))}
        </div>

        {/* =========================================================
            LEFT ARROW
        ========================================================= */}
        <button
          onClick={() =>
            handleSlideChange(
              activeSlide === 0 ? formattedBanners.length - 1 : activeSlide - 1,
            )
          }
          aria-label="Previous slide"
          className="
            absolute
            cursor-pointer
            left-1
            sm:left-5
            top-1/2
            -translate-y-1/2
            z-[3]
            flex
            items-center
            justify-center
            w-9
            h-9
            rounded-full
            bg-black
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:bg-black/80
          "
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* =========================================================
            RIGHT ARROW
        ========================================================= */}
        <button
          onClick={() =>
            handleSlideChange((activeSlide + 1) % formattedBanners.length)
          }
          aria-label="Next slide"
          className="
            absolute
            cursor-pointer
            right-1
            sm:right-5
            top-1/2
            -translate-y-1/2
            z-[3]
            flex
            items-center
            justify-center
            w-9
            h-9
            rounded-full
            bg-black
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:bg-black/80
          "
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
