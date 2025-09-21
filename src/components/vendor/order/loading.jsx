"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

export default function OrdersTableSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-6">
      {/* Skeleton Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[130px] bg-gray-200 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>

      {/* Skeleton Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-10 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
