"use client";

import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Banner images
const banners = [
  {
    image:
      "https://qualitycomputer.com.np/web/image/252137-09549ef2/iPhone%2016series%20web%20banner%202025.jpg",
  },
  {
    image:
      "https://qualitycomputer.com.np/web/image/252138-a28c1638/Lenovo%20Laptop%20Deals%20web.jpg",
  },
];

// Custom arrow components
function NextArrow({ onClick }) {
  return (
    <div
      className="absolute top-1/2 right-2 sm:right-4 z-10 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-md cursor-pointer transition"
      onClick={onClick}
    >
      <ChevronRight size={20} />
    </div>
  );
}

function PrevArrow({ onClick }) {
  return (
    <div
      className="absolute top-1/2 left-2 sm:left-4 z-10 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-md cursor-pointer transition"
      onClick={onClick}
    >
      <ChevronLeft size={20} />
    </div>
  );
}

export default function Hero() {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
        },
      },
    ],
  };

  return (
    <section className="relative overflow-hidden">
      <Slider ref={sliderRef} {...settings} className="w-full h-full">
        {banners.map((slide, index) => (
          <div
            key={index}
            className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </div>
        ))}
      </Slider>
    </section>
  );
}
