"use client";
import {
  Package,
  DollarSign,
  Tag,
  TrendingUp,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const getStatusColor = (status) => {
  if (!status) return "bg-gray-100 text-gray-800 border-gray-200";
  switch (status.toUpperCase()) {
    case "NEW":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ACCEPTED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function OrdersTable({ data, meta, page, setPage }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState({});

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  useEffect(() => {
    if (data && data.length > 0) {
      setOrderStatuses(
        Object.fromEntries(
          data.map((order) => [
            order.order_id,
            order.order_status || "COMPLETED",
          ])
        )
      );
    }
  }, [data]);

  const toggleRow = (orderId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  async function updateData(url, formData) {
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

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const url = `${baseUrl}/updatevendororder`;
      const res = await updateData(url, {
        order_id: orderId,
        status: newStatus,
      });

      if (!res) {
        toast.error("Something went wrong!");
        return;
      }

      setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
      toast.success(`Order ${orderId} marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {meta.total_count}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(
                    data.reduce((sum, order) => sum + order.total_amount, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Discounts
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(
                    data.reduce((sum, order) => sum + order.total_discount, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tax
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(
                    data.reduce((sum, order) => sum + order.total_tax, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold">Method</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((order) => (
                <React.Fragment key={order.order_id}>
                  <TableRow
                    key={order.order_id}
                    onClick={() => toggleRow(order.order_id)}
                    className="border-border hover:bg-muted/50 cursor-pointer"
                  >
                    <TableCell>
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(order.order_id);
                            }}
                            className="p-0 h-8 w-8"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedRows.has(order.order_id)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      #{order.order_id}
                    </TableCell>

                    <TableCell className="font-semibold text-green-800">
                      {formatCurrency(order.total_amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(
                          orderStatuses[order.order_id]
                        )}
                      >
                        {orderStatuses[order.order_id]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">Paid</span>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.creation_time)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.order_id, "PROCESSING")
                            }
                          >
                            PROCESSING
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.order_id, "NEW")
                            }
                          >
                            NEW
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.order_id, "ACCEPTED")
                            }
                          >
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.order_id, "CANCELLED")
                            }
                          >
                            CANCELLED
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {expandedRows.has(order.order_id) && (
                    <TableRow>
                      <TableCell colSpan={9} className="p-0">
                        <div className="bg-muted/30 p-6 space-y-4">
                          <h4 className="font-semibold text-foreground mb-4">
                            Order Details
                          </h4>
                          {order.order_details.map((detail, index) => (
                            <div
                              key={index}
                              className="bg-card rounded-lg p-4 space-y-3 border border-border"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h5 className="font-medium text-foreground">
                                    {detail.vendor_product_name}
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    {detail.vendor_variant_description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>
                                      Product ID: {detail.vendor_product_id}
                                    </span>
                                    <span>
                                      Variant ID: {detail.vendor_variant_id}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right space-y-1">
                                  <p className="font-medium text-foreground">
                                    {formatCurrency(detail.order_rate)} ×{" "}
                                    {detail.order_quantity}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatCurrency(detail.order_amount)}
                                  </p>
                                </div>
                              </div>

                              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border">
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Net Amount
                                  </p>
                                  <p className="text-sm font-medium text-foreground">
                                    {formatCurrency(detail.order_net_amount)}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Tax Amount
                                  </p>
                                  <p className="text-sm font-medium text-foreground">
                                    {formatCurrency(detail.order_tax_amount)}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Discount
                                  </p>
                                  <p className="text-sm font-medium text-destructive">
                                    -
                                    {formatCurrency(
                                      detail.order_discount_amount
                                    )}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Tax Rates
                                  </p>
                                  <p className="text-sm font-medium text-foreground">
                                    {detail.tax1_rate}% + {detail.tax2_rate}% +{" "}
                                    {detail.tax3_rate}%
                                  </p>
                                </div>
                              </div> */}
                              <div className="bg-accent/50 rounded-lg px-4 py-4  mt-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Order Amount
                                    </p>
                                    <p className="text-lg font-bold text-green-600 text-success">
                                      {formatCurrency(order.total_amount)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      MPR (Exc. Tax)
                                    </p>
                                    <p className="text-lg font-bold text-foreground">
                                      {formatCurrency(order.amount)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Total Tax
                                    </p>
                                    <p className="text-lg font-bold text-foreground">
                                      {formatCurrency(order.total_tax)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Discount (MRP)
                                    </p>
                                    <p className="text-lg font-bold text-destructive">
                                      -{formatCurrency(order.total_discount)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {meta.total_pages > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              <Button
                onClick={() => setPage(page - 1)}
                disabled={meta.page_number <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 self-center">
                Page {meta.page_number} of {meta.total_pages}
              </span>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={meta.page_number >= meta.total_pages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
