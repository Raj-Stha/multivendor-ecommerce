"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Footer() {
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseurl}/getcategory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_number: 1,
            limit: 16,
          }),
        });

        const data = await res.json();
        if (data?.details) {
          const normalized = data.details.slice(0, 6).map((category) => ({
            id: category.category_id || category.id,
            name: category.category_name || category.name,
            image: category.category_image || category.image,
          }));
          setCategories(normalized);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="bg-white  border-t-2 border-gray-200  text-black jost-text">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <div className="flex-shrink-0 pb-2">
            {/* <Link href="/" className="transition-opacity hover:opacity-80">
              <img
                src="/logo/logo.png"
                alt="KinMel Mandu Logo"
                className="h-12 w-auto"
              />
            </Link> */}
            <h3 className="text-3xl font-semibold">E-COM</h3>
          </div>
          <p className=" mb-4">
            Your one-stop multivendor marketplace for cosmetics, accessories,
            and more. Quality products from trusted sellers across Nepal.
          </p>
          <div className="flex space-x-4 mt-4 text-primary">
            <Link href="https://facebook.com" target="_blank">
              <Facebook className="w-5 h-5 hover:text-secondary transition" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <Instagram className="w-5 h-5 hover:text-secondary transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="w-5 h-5 hover:text-secondary transition" />
            </Link>
            <Link href="https://youtube.com" target="_blank">
              <Youtube className="w-5 h-5 hover:text-secondary transition" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 ">
            <li>
              <Link href="/about" className="hover:text-secondary transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-secondary transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/vendors" className="hover:text-secondary transition">
                Our Vendors
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-secondary transition">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-secondary transition">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories (dynamic) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
          <ul className="space-y-2 text-black">
            {categories.length > 0 ? (
              categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="hover:text-secondary transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-white/70 text-sm">Loading...</li>
            )}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Subscribe to Newsletter
          </h3>
          <p className=" mb-4">
            Get the latest offers and updates from our vendors directly to your
            inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/50"
            />
            <Button
              type="submit"
              className="text-white bg-primary hover:bg-secondary"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className=" shadow-xl border-t-2 border-gray-200  py-6 text-center  text-sm">
        &copy; {new Date().getFullYear()} E-COM. All rights reserved.
      </div>
    </footer>
  );
}
