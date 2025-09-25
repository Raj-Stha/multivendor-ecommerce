import ProductList from "../../../../../components/vendor/(productgroup)/product/ProductList";
import AddProductForm from "../../../../../components/vendor/(productgroup)/product/form/AddProductForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

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
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Products
        </h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-white px-4 py-4 hover:bg-primary hover:opacity-90">
                <PlusIcon className="w-5 h-5" />
                <span className="hidden md:inline">Add Product</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80%] overflow-y-auto rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProductForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
  );
}
