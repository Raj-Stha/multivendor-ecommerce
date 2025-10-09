// "use client";

// import { useRef } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// // Banner images
// const banners = [
//   {
//     image:
//       "https://qualitycomputer.com.np/web/image/252137-09549ef2/iPhone%2016series%20web%20banner%202025.jpg",
//   },
//   {
//     image:
//       "https://qualitycomputer.com.np/web/image/252138-a28c1638/Lenovo%20Laptop%20Deals%20web.jpg",
//   },
// ];

// // Custom arrow components
// function NextArrow({ onClick }) {
//   return (
//     <div
//       className="absolute top-1/2 right-2 sm:right-4 z-10 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-md cursor-pointer transition"
//       onClick={onClick}
//     >
//       <ChevronRight size={20} />
//     </div>
//   );
// }

// function PrevArrow({ onClick }) {
//   return (
//     <div
//       className="absolute top-1/2 left-2 sm:left-4 z-10 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-md cursor-pointer transition"
//       onClick={onClick}
//     >
//       <ChevronLeft size={20} />
//     </div>
//   );
// }

// export default function Hero() {
//   const sliderRef = useRef(null);

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     cssEase: "ease-in-out",
//     arrows: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           arrows: true,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           arrows: true,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           arrows: true,
//         },
//       },
//     ],
//   };

//   return (
//     <section className="relative overflow-hidden">
//       <Slider ref={sliderRef} {...settings} className="w-full h-full">
//         {banners.map((slide, index) => (
//           <div
//             key={index}
//             className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh]"
//           >
//             <div
//               className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
//               style={{ backgroundImage: `url(${slide.image})` }}
//             />
//             <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
//           </div>
//         ))}
//       </Slider>
//     </section>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero({ banners = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || banners.length === 0) return;
    const timer = setInterval(() => {
      handleSlideChange((activeSlide + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlide, banners.length, isHovered]);

  const handleSlideChange = (index) => {
    if (isAnimating || banners.length === 0) return;
    setPrevSlide(activeSlide);
    setIsAnimating(true);
    setActiveSlide(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  if (!banners.length) return null;

  const currentSlide = banners[activeSlide];
  const previousSlide =
    prevSlide !== null ? banners[prevSlide] : banners[activeSlide];

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
      {/* 🔹 Previous Slide (blurred background) */}
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

      {/* 🔹 Text Content with Frosted Background */}
      <div className="relative z-[2] container mx-auto px-6 h-[90vh] flex items-center">
        <div
          className="max-w-2xl text-white space-y-5  "
        >
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
                  className="text-sm sm:text-lg md:text-xl tracking-widest text-primary font-semibold uppercase mb-2"
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
                dangerouslySetInnerHTML={{ __html: currentSlide.description }}
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
                        className={`px-5 !py-4 text-sm  sm:text-base shadow-md transition-transform hover:translate-y-[-3px] ${index === 0
                          ? "bg-primary hover:bg-primary/90 text-white"
                          : "bg-white text-primary hover:text-white border border-primary hover:bg-primary"
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
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSlide === index
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
            activeSlide === 0 ? banners.length - 1 : activeSlide - 1
          )
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary hover:text-white transition-all p-3 rounded-full shadow-lg z-[3]"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() => handleSlideChange((activeSlide + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary hover:text-white transition-all p-3 rounded-full shadow-lg z-[3]"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
