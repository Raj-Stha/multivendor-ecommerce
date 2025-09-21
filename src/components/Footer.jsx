"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-primary/90 text-white  jost-text">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">Daraz</h2>
          <p className="text-white/90 mb-4">
            Your one-stop multivendor marketplace for cosmetics, accessories,
            and more. Quality products from trusted sellers across Nepal.
          </p>
          <div className="flex space-x-4 mt-4">
            <Link href="https://facebook.com" target="_blank">
              <Facebook className="w-5 h-5 hover:text-white transition" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <Instagram className="w-5 h-5 hover:text-white transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="w-5 h-5 hover:text-white transition" />
            </Link>
            <Link href="https://youtube.com" target="_blank">
              <Youtube className="w-5 h-5 hover:text-white transition" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-white/90">
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/vendors" className="hover:text-white transition">
                Our Vendors
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
          <ul className="space-y-2 text-white/90">
            <li>
              <Link
                href="/category/cosmetics"
                className="hover:text-white transition"
              >
                Cosmetics
              </Link>
            </li>
            <li>
              <Link
                href="/category/skincare"
                className="hover:text-white transition"
              >
                Skincare
              </Link>
            </li>
            <li>
              <Link
                href="/category/accessories"
                className="hover:text-white transition"
              >
                Accessories
              </Link>
            </li>
            <li>
              <Link
                href="/category/makeup-tools"
                className="hover:text-white transition"
              >
                Makeup Tools
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Subscribe to Newsletter
          </h3>
          <p className="text-white/90 mb-4">
            Get the latest offers and updates from our vendors directly to your
            inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-white hover:bg-gray-50 text-primary"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-8 py-6 text-center text-white text-sm">
        &copy; {new Date().getFullYear()} Daraz. All rights reserved. | Designed
        with ❤️ in Nepal
      </div>
    </footer>
  );
}
