"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  CalendarIcon,
  Users,
  ShoppingCart,
  Store,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboardList({
  initialData,
  initialDateFrom,
  initialDateTo,
}) {
  const router = useRouter();

  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  // ✅ unwrap array from API response
  const normalized = Array.isArray(initialData)
    ? initialData[0]
    : initialData || {};

  const user = normalized.user || {};
  const order = normalized.order || {};
  const vendor = normalized.vendor || {};
  const products = normalized.products || {};

  const handleDateFilter = () => {
    router.push(`/dashboard/admin?date_from=${dateFrom}&date_to=${dateTo}`);
  };

  // --- Chart Data ---
  const userChartData = [
    { name: "Active", value: user.active ?? 0, color: "#10b981" },
    {
      name: "Inactive",
      value: user.inactive ?? 0,
      color: "black",
    },
  ];

  const orderChartData = [
    { name: "New", value: order.new ?? 0 },
    { name: "Sent", value: order.sent ?? 0 },
    { name: "Accepted", value: order.accepted ?? 0 },
    { name: "Completed", value: order.completed ?? 0, color: "green" },
    { name: "Rejected", value: order.rejected ?? 0 },
  ];

  const vendorChartData = [
    { name: "Active", value: vendor.active ?? 0, color: "green" },
    {
      name: "Inactive",
      value: vendor.inactive ?? 0,
      color: "red",
    },
    {
      name: "Restricted",
      value: vendor.restricted ?? 0,
      color: "hsl(var(--chart-5))",
    },
  ];

  const productChartData = [
    {
      name: "Active",
      value: products.active ?? 0,
      color: "green",
    },
    {
      name: "Inactive",
      value: products.inactive ?? 0,
      color: "red",
    },
    {
      name: "Restricted",
      value: products.restricted ?? 0,
      color: "hsl(var(--chart-5))",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with Date Filter */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4 bg-white/90 p-5 rounded-xl border border-slate-200/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <Label htmlFor="date-from">From:</Label>
                <Input
                  type="date"
                  id="date-from"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="date-to">To:</Label>
                <Input
                  type="date"
                  id="date-to"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <Button onClick={handleDateFilter}>Apply Filter</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{user.total ?? 0}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{order.total ?? 0}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-purple-600" />
                Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{vendor.total ?? 0}</p>
              <p className="text-sm text-muted-foreground">Total Vendors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{products.total ?? 0}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {userChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vendors Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-purple-600" />
                Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vendorChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {vendorChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Products Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {productChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
