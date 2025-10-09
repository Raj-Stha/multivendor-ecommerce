import Hero from "./_components/slider";
import ProductSliderSection from "./_components/product-slider-section";
import CategoriesSection from "./_components/categories-section";
import ProductGrid2 from "./_components/product-grid-2";
import LocationPopup from "@/components/LocationPopup";
import ProductSlider from "./_components/product-slider";
import { FeaturesBar } from "./_components/features-bar";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch: ${res.status} ${errorText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`Error fetching: ${url}`, err);
    return null;
  }
}

export default async function Home() {
  const [productData, categoryData, category21] = await Promise.all([
    safeFetch(`${baseurl}/getproducts`, {
      method: "POST",
      body: {
        limit: 12,
        page_number: 1,
        price_from: 0,
        price_to: 100000,
        product_name: "",
        order_by: "price_desc",
      },
    }),
    safeFetch(`${baseurl}/getcategory`, {
      method: "POST",
      body: {
        page_number: 1,
        limit: 16,
      },
    }),
    safeFetch(`${baseurl}/getproducts`, {
      method: "POST",
      body: {
        limit: 8,
        page_number: 1,
        price_from: 0,
        price_to: 100000,
        product_name: "",
        order_by: "price_desc",
      },
    }),
  ]);

  const banners = [
    {
      id: "1",
      primaryTitle: "Shop Freely",
      title: "Redefine Your Style",
      description:
        "<h3>Discover trendy designs and premium collections crafted for modern elegance and comfort.</h3>",
      image: "/banner/banner-1.jpg",
      buttons: [
        { text: "Explore Collection", link: "/collection" },
        { text: "Order Product", link: "/order" },
      ],
    },

    {
      id: "2",
      primaryTitle: "WELCOME TO Ecom",
      title: "Your Choice, Our Store",
      description:
        "<h3>We believe in turning imagination into innovation. Whether it's fashion, lifestyle, or custom solutions — we bring your vision to life.</h3>",
      image: "/banner/banner-2.jpg",
      buttons: [
        { text: "Shop Now", link: "/shop" },
        { text: "Order Product", link: "/order" },
      ],
    },
    {
      id: "3",
      primaryTitle: "WELCOME TO Our Store",
      title: "Luxury Meets Comfort",
      description:
        "<h3>Experience timeless beauty with our carefully curated fashion pieces.</h3>",
      image: "/banner/banner-3.jpg",
      buttons: [
        { text: "Discover Now", link: "/discover" },
        { text: "Order Product", link: "/order" },
      ],
    },

    {
      id: "4",
      primaryTitle: "Shop Now",
      title: "Redefine Your Style",
      description:
        "<h3>Discover trendy designs and premium collections crafted for modern elegance and comfort.</h3>",
      image: "/banner/banner-4.jpg",
      buttons: [
        { text: "Explore Collection", link: "/collection" },
        { text: "Order Product", link: "/order" },
      ],
    },
  ];

  return (
    <div className="bg-[#f5f5f5]">
      <LocationPopup />
      {/* ✅ Pass banners here */}
      <Hero banners={banners} />
      <ProductSliderSection products={productData?.details} />
      <CategoriesSection categories={categoryData?.details} />
      <ProductSlider products={productData?.details} />
      <ProductGrid2 initialProducts={category21?.details} />
      <FeaturesBar />
    </div>
  );
}

export const dynamic = "force-dynamic";
