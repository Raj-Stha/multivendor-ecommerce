"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/home/products/list/product-card2";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function ProductGrid2({ initialProducts }) {
  if (!initialProducts || initialProducts.length === 0) return null;

  return (
    <section className=" noto-sans-text">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-white  shadow-sm p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl   text-gray-900">Vegetables</h2>
            <Link
              href="/products?category=21"
              className="flex text-sm gap-1 sm:gap-2 items-center font-medium text-primary "
            >
              <span>View All</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialProducts.map((product) => (
              <motion.div
                key={`${product.product_id}-${product.vendor_id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group"
              >
                <ProductCard product={product} border={false} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
