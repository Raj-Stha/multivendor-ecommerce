"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ProductList from "../../../../../components/admin/(productgroup)/product/ProductList";
import AddProductForm from "../../../../../components/admin/(productgroup)/product/form/AddProductForm";
import CategoryListSkeleton from "../../../../../components/admin/Skeleton/CategooryListSkeleton";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      console.error("Failed to fetch categories");
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function ProductAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [productNotes, setProductNotes] = useState([]);
  const [manu, setManu] = useState([]);
  const [cat, setCat] = useState([]);
  const [data, setData] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [meta, setMeta] = useState({ page_number: 1, total_pages: 1 });
  const [page, setPage] = useState(1);
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const getAllProducts = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getadminproducts`;
      const productRes = await getData(url, { page_number: page, limit });
      const allProductRes = await getData(url, { page_number: page, limit: 0 });

      if (productRes) {
        setData(productRes.details || []);
        setMeta(productRes.hint || { page_number: page, total_pages: 1 });
      }
      if (allProductRes) {
        setAllProduct(allProductRes.details || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductNotes = async () => {
    try {
      let url = `${baseUrl}/getproductnotes`;
      const res = await getData(url, { page_number: page, limit: 0 });
      setProductNotes(res?.details || []);
    } catch (error) {
      console.error("Error fetching product notes:", error);
    }
  };

  const getManufactures = async () => {
    try {
      let url = `${baseUrl}/getmanufacturer`;
      const res = await getData(url, { page_number: page, limit: 0 });
      setManu(res?.details || []);
    } catch (error) {
      console.error("Error fetching manufacturer", error);
    }
  };

  const getCategory = async () => {
    try {
      let url = `${baseUrl}/getcategory`;
      const res = await getData(url, { page_number: page, limit: 0 });
      setCat(res?.details || []);
    } catch (error) {
      console.error("Error fetching category", error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getProductNotes();
    getCategory();
    getManufactures();
  }, [page]);

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Products
        </h2>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              {cat && manu && (
                <AddProductForm
                  setIsOpen={setIsOpen}
                  category={cat}
                  manu={manu}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        <>
          {cat && manu && data && (
            <ProductList
              data={data}
              productNotes={productNotes}
              category={cat}
              manu={manu}
              meta={meta}
              page={page}
              setPage={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
