"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/home/products/list/product-card";

export default function ProductSliderSection({ products }) {
  if (!products || products.length === 0) {
    return null;
  }

  console.log(products);

  return (
    <section className="my-2 noto-sans-text">
      <div className="container max-w-7xl mx-auto px-4 xl:pt-10 sm:pt-4 pt-5 relative">
        {/* Header */}
        <div className="text-left w-full">
          <h2 className="relative inline-block   text-2xl font-semibold text-primary pb-1">
            Flash Sale
            <span
              className="absolute left-0 bottom-0 h-[3px] w-full 
                       bg-gradient-to-r from-primary to-secondary rounded-full"
            ></span>
          </h2>
        </div>

        <div className="bg-white  ">
          <div className="flex justify-between  items-baseline">
            <div className="text-md font-semibold mt-4 mb-6">On Sale Now</div>
            <Link
              href="/products"
              className=" w-fit
              relative flex items-center justify-center
              text-xs uppercase font-normal
              text-primary border border-primary
              px-4 py-3 rounded-sm
              bg-transparent
              overflow-hidden
              transition-colors duration-300 ease-in-out
              before:absolute before:inset-0 before:w-0 before:bg-primary before:z-0 before:transition-all before:duration-300 before:ease-in-out
              hover:before:w-full
              hover:text-white 
            "
            >
              <span className="relative z-10">Shop All Products</span>
            </Link>
          </div>
          <hr className="border-gray-200   " />
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5  gap-5 pt-5 ">
            {products
              .filter((p) => p?.variants?.length > 0)
              .slice(0, 5)
              .map((product) => (
                <motion.div
                  key={`${product.product_id}-${product.vendor_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard
                    product={product}
                    key={`${product.product_id}-${product.vendor_id}`}
                  />
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
