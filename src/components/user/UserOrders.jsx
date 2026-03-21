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
  const [expandedOrders, setExpandedOrders] = useState({});
  const [payingId, setPayingId] = useState(null);

  /* 🇳🇵 Nepal Currency Formatter */
  const formatCurrency = (value) => {
    return (
      "Rs. " +
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0)
    );
  };

  const toggleExpand = (billId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [billId]: !prev[billId],
    }));
  };

  /* Fetch Orders */
  const fetchOrders = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/getbills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            limit,
            page_number: page,
          }),
        },
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

  /* Handle Payment */
  const handlePayment = async (billId) => {
    try {
      setPayingId(billId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/paybill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            bill_id: billId,
          }),
        },
      );

      if (!res.ok) throw new Error("Payment failed");

      const data = await res.json();

      console.log(data);

      if (data.code === "00000") {
        alert("Payment successful 🎉");

        fetchOrders(); // refresh list
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong during payment");
    } finally {
      setPayingId(null);
    }
  };

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
    <div className="space-y-5">
      {/* Page Title */}

      <div>
        <h1 className="text-xl font-bold text-gray-900">Order History</h1>

        <p className="text-gray-600 text-sm">Track and manage your orders</p>
      </div>

      {orders.map((order) => (
        <Card key={order.bill_id} className="p-4">
          {/* HEADER */}

          <CardHeader className="px-0 pb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Bill #{order.bill_id}
                  </CardTitle>
                  <p className="font-semibold text-xs text-green-600">
                    Date: {new Date(order.creation_time).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <Badge
                    className={`${getStatusColor(order.bill_status)} flex items-center gap-1 text-xs`}
                  >
                    {getStatusIcon(order.bill_status)}
                    {order.bill_status}
                  </Badge>

                  <span className="font-bold text-lg text-green-600">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* TOP PAY BUTTON */}
              {order.bill_status === "UNPAID" && (
                <div className="mt-3 sm:mt-0">
                  <Button
                    size="sm"
                    disabled={payingId === order.bill_id}
                    className="bg-green-600 cursor-pointer hover:bg-blue-700 text-white transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                    onClick={() => handlePayment(order.bill_id)}
                  >
                    {payingId === order.bill_id ? (
                      "Processing..."
                    ) : (
                      <> Proceed to Pay</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-0">
            {/* SUMMARY */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm border rounded-lg p-3 bg-gray-50">
              <div>
                <p className="text-gray-500 text-xs">Items</p>

                <p className="font-semibold">{order.bill_details.length}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Subtotal</p>

                <p className="font-semibold">{formatCurrency(order.amount)}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Discount</p>

                <p className="font-semibold text-red-600">
                  -{formatCurrency(order.total_discount)}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Tax</p>

                <p className="font-semibold text-blue-600">
                  +{formatCurrency(order.total_tax)}
                </p>
              </div>
            </div>

            {/* TOGGLE */}

            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleExpand(order.bill_id)}
            >
              {expandedOrders[order.bill_id] ? "Hide Items" : "View Items"}
            </Button>

            {/* ITEMS */}

            {expandedOrders[order.bill_id] && (
              <div className="space-y-3">
                {order.bill_details.map((product, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-gray-50 text-sm space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {product.product_name}
                        </p>

                        <p className="text-gray-500 text-xs">
                          {product.variant_description}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-800">
                        {formatCurrency(product.bill_rate)}
                      </p>
                    </div>

                    <div className="flex justify-between font-semibold text-xs text-green-600">
                      <span>Vendor: {product.vendor_name}</span>

                      <span>Qty: {product.bill_quantity}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t pt-2 text-gray-600">
                      <span>
                        Subtotal: {formatCurrency(product.bill_amount)}
                      </span>

                      <span>
                        Discount: -{" "}
                        {formatCurrency(product.bill_discount_amount)}
                      </span>

                      <span>
                        Tax: + {formatCurrency(product.bill_tax_amount)}
                      </span>

                      <span className="font-medium text-gray-800">
                        Net: {formatCurrency(product.bill_net_amount)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* FINAL TOTAL + PAY BUTTON */}

                <div className="border-t pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex justify-between w-full sm:w-auto gap-4 items-center">
                    <span className="font-semibold text-gray-700">
                      Total Amount
                    </span>

                    <span className="font-bold text-lg text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>

                  {/* {order.bill_status === "UNPAID" && (
                    <Button
                      size="sm"
                      disabled={payingId === order.bill_id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handlePayment(order.bill_id)}
                    >
                      {payingId === order.bill_id
                        ? "Processing..."
                        : "Proceed to Pay"}
                    </Button>
                  )} */}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* PAGINATION */}

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
