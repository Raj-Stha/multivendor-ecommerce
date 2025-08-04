"use client";

import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import AccountMenu from "./_components/AccountMenu";

export function TopBar() {
  const sliderContent = [
    {
      desktop: "Welcome to Ecommerce Platform",
      mobile: "Welcome to Ecommerce",
    },
    {
      desktop: "Your Trusted Partner in Online Shopping",
      mobile: "Trusted Shopping Partner",
    },
    {
      desktop: "Experience Seamless Shopping with Ecommerce",
      mobile: "Seamless Shopping",
    },
    {
      desktop: "Your Needs, Our Priority – Excellence in Service",
      mobile: "Your Needs – Our Priority",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
        setIsFlipping(false);
      }, 600);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 py-1 text-black w-full text-xs nunito-text border-b border-gray-300">
      <div className="container max-w-7xl mx-auto flex justify-between items-center xl:px-3 sm:px-4 px-[3px] space-y-2 md:space-y-0">
        {/* Left: Animated message */}
        <div className="w-full sm:w-auto min-w-[150px] md:min-w-[400px] text-center md:text-left h-5  md:h-6 overflow-hidden relative">
          <div
            className={`transition-transform duration-500 ease-in-out transform origin-bottom ${
              isFlipping ? "animate-flip" : ""
            }`}
            key={currentSlide}
          >
            <span className="block md:hidden py-1">
              {sliderContent[currentSlide].mobile}
            </span>
            <span className="hidden md:block py-1">
              {sliderContent[currentSlide].desktop}
            </span>
          </div>
        </div>

        {/* Right: Contact info */}
        <div className="hidden sm:flex flex-wrap justify-center md:justify-end items-center gap-x-4 gap-y-1 text-xs md:text-sm">
            <AccountMenu />
        </div>
      </div>
    </div>
  );
}
