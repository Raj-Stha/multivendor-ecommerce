"use client";

import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/getbills`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ limit, page_number: page }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      if (data.code === "00000") {
        setOrders(data.details || []);
        setTotalPages(data.hint?.total_pages || 1);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "shipped":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
      case "unpaid":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <p className="text-center py-6">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="text-gray-500 text-sm mb-5">
          When you place your first order, it will appear here.
        </p>
        <Button size="sm">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600 text-sm">Track and manage your orders</p>
      </div>

      {orders.map((order) => (
        <Card key={order.bill_id} className="p-4">
          {/* Bill Header */}
          <CardHeader className="pb-3 px-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Bill #{order.bill_id}
                </CardTitle>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(order.creation_time).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getStatusColor(
                    order.bill_status
                  )} flex items-center gap-1 text-xs`}
                >
                  {getStatusIcon(order.bill_status)}
                  {order.bill_status}
                </Badge>
                <span className="font-semibold text-sm">
                  ${order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardHeader>

          {/* Bill Details */}
          <CardContent className="space-y-4 px-0">
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Items:</span>
                <span className="ml-1 font-medium">
                  {order.bill_details.length}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Tax:</span>
                <span className="ml-1 font-medium">
                  ${order.total_tax.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Discount:</span>
                <span className="ml-1 font-medium">
                  ${order.total_discount.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Amount:</span>
                <span className="ml-1 font-medium">
                  ${order.amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Itemized Products */}
            <div className="border-t pt-3">
              <h4 className="font-medium text-sm mb-2">Items in this order</h4>
              <div className="space-y-2">
                {order.bill_details.map((product, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-2 bg-gray-50 text-xs"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        {product.product_name} × {product.bill_quantity}
                      </span>
                      <span className="font-medium">${product.bill_rate}</span>
                    </div>
                    <p className="text-gray-500">
                      {product.variant_description}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-1 text-gray-600">
                      <span>Vendor: {product.vendor_name}</span>
                      <span>
                        Discount: ${product.bill_discount_amount.toFixed(2)}
                      </span>
                      <span>Tax: ${product.bill_tax_amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`text-sm ${
                page === 1 ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                isActive={page === idx + 1}
                onClick={() => setPage(idx + 1)}
                className="text-sm"
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`text-sm ${
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
