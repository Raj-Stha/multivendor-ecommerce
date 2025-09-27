import ProductMapList from "@/components/admin/(productgroup)/product-map/ProductMapList";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-store", // disable caching (always fresh)
    });

    if (!res.ok) {
      console.error("Failed to fetch:", url);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function ProductAdmin({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const limit = 10;

  // Fetch all products
  const allProductRes = await getData(`${baseUrl}/getadminproducts`, {
    page_number: page,
    limit: 0,
  });
  const allProduct = allProductRes?.details || [];

  // Fetch unmapped vendor variants
  const productMapRes = await getData(`${baseUrl}/getunmappedvendorvariants`, {
    page_number: page,
    limit,
  });

  const data = productMapRes?.details || [];
  const meta = productMapRes?.hint || { page_number: page, total_pages: 1 };

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Product Map
        </h2>
      </div>

      <ProductMapList
        data={data}
        allProduct={allProduct}
        meta={meta}
        page={page}
      />
    </div>
  );
}
