import ProductList from "../../../../../components/vendor/(productgroup)/product/ProductList";
import AddProductForm from "../../../../../components/vendor/(productgroup)/product/form/AddProductForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch data");
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function ProductAdmin({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const productRes = await getData(`${baseUrl}/getvendorproducts`, {
    page_number: page,
    limit,
  });

  const data = productRes?.details || [];
  const meta = productRes?.hint || { page_number: page, total_pages: 1 };

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow py-5 px-3 bg-white">
        <div className="flex items-center justify-between ">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <h2 className="text-2xl font-semibold text-gray-800">
              Manage Products
            </h2>
          </div>
          <div className="flex gap-2">
            <AddProductForm />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-[2%] py-[2%]">
        {data.length === 0 ? (
          <div className="w-full text-center py-8">
            <p className="text-gray-500">
              No product found. Add a new product to get started.
            </p>
          </div>
        ) : (
          <ProductList data={data} meta={meta} />
        )}
      </div>
    </>
  );
}
