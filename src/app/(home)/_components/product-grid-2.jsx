// "use client";

// import { motion } from "framer-motion";
// import { ProductCard } from "@/components/home/products/list/product-card2";
// import Link from "next/link";
// import { ArrowRightIcon } from "lucide-react";

// export default function ProductGrid2({ initialProducts }) {
//   if (!initialProducts || initialProducts.length === 0) return null;

//   return (
//     <section className=" noto-sans-text">
//       <div className="container max-w-7xl mx-auto px-4">
//         <div className="bg-white  shadow-sm p-4 sm:p-6">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl md:text-2xl   text-primary">Vegetables</h2>
//             <Link
//               href="/products?category=21"
//               className="flex text-sm gap-1 sm:gap-2 items-center font-medium text-primary "
//             >
//               <span>View All</span>
//               <ArrowRightIcon className="w-4 h-4" />
//             </Link>
//           </div>

//           {/* Products Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {initialProducts.map((product) => (
//               <motion.div
//                 key={`${product.product_id}-${product.vendor_id}`}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="group"
//               >
//                 <ProductCard product={product} border={false} />
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/home/products/list/product-card2";
import Link from "next/link";
import { ArrowRightIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductCarousel({ initialProducts }) {
  if (!initialProducts || initialProducts.length === 0) return null;

  // Custom Next Arrow
  function NextArrow(props) {
    const { style, onClick } = props;
    return (
      <button
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 
          bg-white border border-gray-300 shadow-md rounded-full p-2
          transition duration-300
          hover:bg-primary hover:text-white
          opacity-100`}
        style={{ ...style }}
        onClick={onClick}
      >
        <ChevronRight size={20} />
      </button>
    );
  }

  // Custom Prev Arrow
  function PrevArrow(props) {
    const { style, onClick } = props;
    return (
      <button
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 
          bg-white border border-gray-300 shadow-md rounded-full p-2
          transition duration-300
          hover:bg-primary hover:text-white
          opacity-100`}
        style={{ ...style }}
        onClick={onClick}
      >
        <ChevronLeft size={20} />
      </button>
    );
  }

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="noto-sans-text relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-white shadow-sm p-4 sm:p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-left ">
              <h2 className="relative inline-block   text-2xl font-semibold text-primary pb-3">
                Vegetables
                <span
                  className="absolute left-0 bottom-0 h-[3px] w-full 
                       bg-gradient-to-r from-primary to-secondary rounded-full"
                ></span>
              </h2>
            </div>
            <Link
              href="/products?category=21"
              className="flex text-sm gap-1 sm:gap-2 items-center font-medium text-primary hover:text-secondary"
            >
              <span>View All</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* Products Slider */}
          <Slider {...settings}>
            {initialProducts
              .filter((p) => p?.variants?.some((v) => v.available_count > 0))
              .map((product) => (
                <motion.div
                  key={`${product.product_id}-${product.vendor_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="px-2"
                >
                  <ProductCard product={product} border={true} />
                </motion.div>
              ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
