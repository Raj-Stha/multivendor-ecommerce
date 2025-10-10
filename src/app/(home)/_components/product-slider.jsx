// "use client";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import Slider from "react-slick";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { ProductCard } from "@/components/home/products/list/product-card2";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function NextArrow(props) {
//   const { style, onClick } = props;
//   return (
//     <button
//       className={`absolute right-0 top-1/2 -translate-y-1/2 z-10
//         bg-white border border-gray-300 shadow-md rounded-full p-2
//         transition duration-300
//         hover:bg-primary hover:text-white

//         opacity-100 /* Always visible on mobile */
//       `}
//       style={{ ...style }}
//       onClick={onClick}
//     >
//       <ChevronRight size={20} />
//     </button>
//   );
// }

// function PrevArrow(props) {
//   const { style, onClick } = props;
//   return (
//     <button
//       className={`absolute left-0 top-1/2 -translate-y-1/2 z-10
//         bg-white border border-gray-300 shadow-md rounded-full p-2
//         transition duration-300
//         hover:bg-primary hover:text-white

//         opacity-100 /* Always visible on mobile */
//       `}
//       style={{ ...style }}
//       onClick={onClick}
//     >
//       <ChevronLeft size={20} />
//     </button>
//   );
// }

// export default function ProductSlider({ products }) {
//   if (!products || products.length === 0) return null;

//   const sliderSettings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 6,
//     slidesToScroll: 2,
//     arrows: true,
//     autoplay: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       { breakpoint: 1280, settings: { slidesToShow: 5, slidesToScroll: 2 } },
//       { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 2 } },
//       { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
//       { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 1 } },
//       { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
//     ],
//   };

//   return (
//     <section className="my-2 noto-sans-text">
//       <div className="container max-w-7xl mx-auto px-4 py-4 relative">
//         <div className="bg-white">
//           {/* Header */}
//           <div className="flex justify-between p-3 items-baseline">
//             <div className="text-xl md:text-2xl text-black">Flash Sale</div>
//             <Link
//               href="/products"
//               className="w-fit relative flex items-center justify-center
//              text-[10px] md:text-xs font-normal
//              text-white border border-white hover:border-primary
//              p-2 md:px-4 md:py-2
//              transition-colors duration-300 ease-in-out
//              bg-primary
//              before:absolute before:inset-0 before:w-0 before:bg-white before:z-0
//              before:transition-all before:duration-300 before:ease-in-out
//              hover:before:w-full hover:text-primary"
//             >
//               <span className="relative z-10">View All</span>
//             </Link>
//           </div>
//           <hr className="border-gray-200 " />

//           {/* Slider */}
//           <div className="p-1 md:p-3 relative ">
//             <Slider {...sliderSettings}>
//               {products.map((product) => (
//                 <motion.div
//                   key={`${product.product_id}-${product.vendor_id}`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4 }}
//                   className="px-1"
//                 >
//                   <ProductCard product={product} />
//                 </motion.div>
//               ))}
//             </Slider>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/home/products/list/product-card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
  const { style, onClick } = props;
  return (
    <button
      className={`absolute right-0 top-[50%] translate-y-[-50%] z-10 
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

function PrevArrow(props) {
  const { style, onClick } = props;
  return (
    <button
      className={`absolute left-0 top-[50%] translate-y-[-50%] z-10 
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

export default function ProductSlider({ products }) {
  if (!products || products.length === 0) return null;

  // Determine max slides to show based on breakpoints
  const maxSlides = 5;

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(products.length, maxSlides),
    slidesToScroll: 2,
    arrows: products.length > maxSlides, // show arrows only if enough products
    autoplay: products.length > maxSlides, // autoplay only if enough products
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(products.length, 5),
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(products.length, 4),
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(products.length, 3),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: Math.min(products.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(products.length, 2),
          slidesToScroll: 1,
        },
      },
    ],
  };

  // If number of products is less than maxSlides, render static grid instead of slider
  if (products.length <= maxSlides) {
    return (
      <section className="my-2 noto-sans-text">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white">
            <div className="flex justify-between p-3 items-baseline">
              <div className="text-xl md:text-2xl text-primary">Flash Sale</div>
              <Link
                href="/products"
                className="w-fit relative flex items-center justify-center
                  text-[10px] md:text-xs font-normal
                  text-white border border-white hover:border-primary
                  p-2 md:px-4 md:py-2
                  transition-colors duration-300 ease-in-out
                  bg-primary
                  before:absolute before:inset-0 before:w-0 before:bg-white before:z-0
                  before:transition-all before:duration-300 before:ease-in-out
                  hover:before:w-full hover:text-primary"
              >
                <span className="relative z-10">View All</span>
              </Link>
            </div>
            <hr className="border-gray-200" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3">
              {products.map((product) => (
                <motion.div
                  key={`${product.product_id}-${product.vendor_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="noto-sans-text">
      <div className="container max-w-7xl mx-auto px-4 py-4 relative">
        <div className="bg-white">
          {/* Header */}
          <div className="flex justify-between p-3 items-baseline">
            <div className="text-left ">
              <h2 className="relative inline-block   text-2xl font-semibold text-primary pb-3">
                Flash Sale
                <span
                  className="absolute left-0 bottom-0 h-[3px] w-full 
                       bg-gradient-to-r from-primary to-secondary rounded-full"
                ></span>
              </h2>
            </div>
            <Link
              href="/products"
              className="w-fit relative flex items-center justify-center
             text-[10px] md:text-xs font-normal
             text-white border hover:border-primary
             p-2 px-5 py-3 rounded-sm overflow-hidden
             transition-colors duration-300 ease-in-out
             bg-primary
             before:absolute before:inset-0 before:w-0 before:bg-white before:z-0
             before:transition-all before:duration-300 before:ease-in-out
             hover:before:w-full hover:text-primary"
            >
              <span className="relative z-10">View All</span>
            </Link>
          </div>
          <hr className="border-gray-200 " />

          {/* Slider */}
          <div className=" py-4 md:py-5 relative">
            <Slider {...sliderSettings}>
              {products.map((product) => (
                <motion.div
                  key={`${product.product_id}-${product.vendor_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="px-3"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}
