import Hero from "./_components/slider";
import ProductSliderSection from "./_components/product-slider-section";
import CategoriesSection from "./_components/categories-section";
import ProductGrid from "./_components/product-grid-section";
import LocationPopup from "@/components/LocationPopup";
import ProductSlider from "./_components/product-slider";
import ProductGrid2 from "./_components/product-grid-2";
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
  const [productData, categoryData, productData2, category21] =
    await Promise.all([
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
          limit: 12,
          page_number: 1,
          price_from: 0,
          price_to: 100000,
          product_name: "",
          order_by: "price_desc",
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
          // category_id: "21",
        },
      }),
    ]);

  return (
    <div className="bg-[#f5f5f5]">
      <LocationPopup />
      <Hero />
      <ProductSliderSection products={productData?.details} />
      <CategoriesSection categories={categoryData?.details} />
      <ProductSlider products={productData?.details} />
      <ProductGrid2 initialProducts={category21?.details} />
      {/* <ProductGrid initialProducts={productData2?.details} baseurl={baseurl} /> */}
      <FeaturesBar />
    </div>
  );
}

export const dynamic = "force-dynamic";
