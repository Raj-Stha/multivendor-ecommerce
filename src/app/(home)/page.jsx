import Hero from "./_components/slider";
import ProductSliderSection from "./_components/product-slider-section";

const baseurl = process.env.NEXT_PUBLIC_API_URL;

// Safe fetch function that supports GET and POST
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
  const [productData] = await Promise.all([
    safeFetch(`${baseurl}/getproducts`, {
      method: "POST",
      body: {
        limit: 1000,
        page_number: 1,
        price_from: 0,
        price_to: 100000,
        product_name: "",
        order_by: "price_desc",
      },
    }),
  ]);
  // console.log(productData?.details);
  return (
    <div className="bg-gray-100">
      <Hero />
      <ProductSliderSection products={productData?.details} />
    </div>
  );
}
