"use client";

import { useEffect, useState } from "react";
import ProductMapList from "../../../../../components/admin/(productgroup)/product-map/ProductMapList";
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
  const [data, setData] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [meta, setMeta] = useState({ page_number: 1, total_pages: 1 });
  const [page, setPage] = useState(1);
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const getAllProducts = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getadminproducts`;
      const allProductRes = await getData(url, { page_number: page, limit: 0 });
      if (allProductRes) {
        setAllProduct(allProductRes.details || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductMaps = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getunmappedvendorvariants`;
      const productMapRes = await getData(url, { page_number: page, limit });
      if (productMapRes) {
        setData(productMapRes.details || []);
        setMeta(productMapRes.hint || { page_number: page, total_pages: 1 });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
    getProductMaps();
  }, [page]);

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Product Map
        </h2>
      </div>

      {isLoading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        <>
          {data && (
            <ProductMapList
              data={data}
              allProduct={allProduct}
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
