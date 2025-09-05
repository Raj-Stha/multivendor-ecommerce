"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/home/products/list/product-card";

export default function ProductSliderSection({ products }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="my-2 noto-sans-text">
      <div className="container max-w-7xl mx-auto px-4 py-4 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-2xl text-black">Flash Sale</div>
        </div>

        <div className="bg-white  ">
          <div className="flex justify-between p-3 items-baseline">
            <div className="text-md text-primary font-normal ">On Sale Now</div>
            <Link
              href="/products"
              className=" w-fit
              relative flex items-center justify-center
              text-xs uppercase font-normal
              text-primary border border-primary
              px-4 py-2
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
          <hr className="border-gray-200 " />
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6  gap-2 p-3 ">
            {products.slice(0, 6).map((product) => (
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
