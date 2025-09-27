import ProductList from "../../../../../components/admin/(productgroup)/product/ProductList";
import AddProductForm from "../../../../../components/admin/(productgroup)/product/form/AddProductForm";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      cache: "no-store", // ✅ always fresh SSR data
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
}

export default async function ProductAdmin({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const [productRes, allProductRes, notesRes, manuRes, catRes] =
    await Promise.all([
      getData(`${baseUrl}/getadminproducts`, { page_number: page, limit }),
      getData(`${baseUrl}/getadminproducts`, { page_number: page, limit: 0 }),
      getData(`${baseUrl}/getproductnotes`, { page_number: page, limit: 0 }),
      getData(`${baseUrl}/getmanufacturer`, { page_number: page, limit: 0 }),
      getData(`${baseUrl}/getcategory`, { page_number: page, limit: 0 }),
    ]);

  const data = productRes?.details || [];
  const meta = productRes?.hint || { page_number: page, total_pages: 1 };
  const allProduct = allProductRes?.details || [];
  const productNotes = notesRes?.details || [];
  const manu = manuRes?.details || [];
  const cat = catRes?.details || [];

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Products
        </h2>
        <div className="flex gap-2">
          {cat && manu && <AddProductForm category={cat} manu={manu} />}
        </div>
      </div>

      {/* Product List (client-side for interactivity) */}
      <ProductList
        data={data}
        allProduct={allProduct}
        productNotes={productNotes}
        category={cat}
        manu={manu}
        meta={meta}
        page={page}
      />
    </div>
  );
}
