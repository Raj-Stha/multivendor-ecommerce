"use client";

import { OrdersTable } from "@/components/vendor/order/order-table";
import OrdersTableSkeleton from "@/components/vendor/order/loading";
import { useEffect, useState } from "react";

// Mock API fetch function
async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function VendorDashboard() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page_number: 1, total_pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const getOrders = async () => {
    setLoading(true); // Start loading
    try {
      const url = `${baseUrl}/getvendororder`;
      const res = await getData(url, { page_number: page, limit });
      setData(res?.details || []);
      setMeta(res?.hint || { page_number: page, total_pages: 1 });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getOrders();
  }, [page]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-1">
            Manage Order
          </h3>
          <p className="text-muted-foreground">
            Manage your orders and track performance
          </p>
        </div>

        {/* Show skeleton while loading */}
        {loading ? (
          <OrdersTableSkeleton />
        ) : (
          <OrdersTable data={data} meta={meta} page={page} setPage={setPage} />
        )}
      </div>
    </div>
  );
}
