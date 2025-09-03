import Hero from "./_components/slider";
import ProductSliderSection from "./_components/product-slider-section";
import CategoriesSection from "./_components/categories-section";
import ProductGrid from "./_components/product-grid-section";

const baseurl = process.env.NEXT_PUBLIC_API_URL;

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
  const [productData, categoryData, productData2] = await Promise.all([
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
        limit: 2,
        page_number: 1,
        price_from: 0,
        price_to: 100000,
        product_name: "",
        order_by: "price_desc",
      },
    }),
  ]);

  return (
    <div className="bg-[#f5f5f5]">
      <Hero />
      <ProductSliderSection products={productData?.details} />
      <CategoriesSection categories={categoryData?.details} />
      <ProductGrid initialProducts={productData2?.details} baseurl={baseurl} />
    </div>
  );
}
