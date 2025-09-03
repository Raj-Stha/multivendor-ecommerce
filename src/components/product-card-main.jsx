"use client";
import { useState } from "react";
import Image from "next/image";
import Carousel, {
  Slider,
  SliderContainer,
  SliderDotButton,
} from "@/components/ui/layout/carousel";
import { motion } from "framer-motion";
import { EyeIcon, Heart } from "lucide-react";

const CardArr = [
  {
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
    title: "Nike Air1",
    color: "#202020",
  },
  {
    img: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop",
    title: "Nike Air2",
    color: "#23acfc",
  },
  {
    img: "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=800&auto=format&fit=crop",
    title: "Adidas",
    color: "#a3fcff",
  },
  {
    img: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?q=80&w=800&auto=format&fit=crop",
    title: "Brown Leather ",
    color: "#A4636C",
  },
];

function ProductCard() {
  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    setIsActive((prevState) => !prevState);
  };
  const OPTIONS = { loop: true };

  return (
    <div className="w-[300px] mx-auto rubik-text">
      <div className="bg-white dark:bg-gray-900 rounded-none  shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="w-full h-60 relative group">
          <motion.button
            className="absolute top-3 right-3 z-20 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
            onClick={handleClick}
            animate={{ scale: isActive ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isActive
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            />
          </motion.button>

          <motion.button
            className="absolute top-16 right-3 z-20 p-2 bg-black/80 dark:bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <EyeIcon className="w-5 h-5 text-white dark:text-black" />
          </motion.button>

          {/* Carousel - unchanged as requested */}
          <Carousel
            options={OPTIONS}
            isAutoPlay={true}
            className="h-full relative"
          >
            <SliderContainer className="gap-2 h-full">
              {CardArr.map((data, index) => (
                <Slider key={index} className="w-full h-full">
                  <Image
                    src={data?.img || "/placeholder.svg"}
                    alt="shoes"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </Slider>
              ))}
            </SliderContainer>
            <div className="flex justify-center py-2 absolute bottom-2 z-2 w-full">
              <SliderDotButton activeclass="dark:bg-white bg-black" />
            </div>
          </Carousel>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight">
                Nike Air Max
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                Premium athletic footwear with superior comfort and style
              </p>
            </div>
            <div className="ml-3 text-right">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                $39
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
