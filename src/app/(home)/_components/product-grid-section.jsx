"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/home/products/list/product-card";

export default function ProductGrid({ initialProducts, baseurl }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseurl}/getproducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 2,
          page_number: page + 1,
          price_from: 0,
          price_to: 100000,
          product_name: "",
          order_by: "price_desc",
        }),
      });

      const data = await res.json();
      if (data?.details?.length > 0) {
        setProducts([...products, ...data.details]);
        setPage(page + 1);
      }
    } catch (err) {
      console.error("Error loading more products:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="my-2 noto-sans-text">
      <div className="container max-w-7xl mx-auto px-4 py-4 relative">
        <div className="flex justify-between items-center mb-3">
          <div className="text-2xl text-black">Just For You</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {products.map((product) => (
            <motion.div
              key={`${product.product_id}-${product.vendor_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={product} border="true" />
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-transparent text-primary px-12 md:px-24 py-2 rounded-none border-primary border-1 cursor-pointer  transition"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
    </section>
  );
}
