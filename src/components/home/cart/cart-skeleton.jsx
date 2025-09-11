"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CartSkeleton({ vendorCount = 1, itemsPerVendor = 1 }) {
  const vendors = Array.from({ length: vendorCount });
  const items = Array.from({ length: itemsPerVendor });

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-pulse">
      {/* Left: Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <div className="h-12 w-1/3 bg-gray-100 rounded"></div>

        {vendors.map((_, vIndex) => (
          <Card key={vIndex} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Vendor
                </Badge>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {items.map((_, iIndex) => (
                <div key={iIndex} className="flex gap-4">
                  <div className="h-24 w-24 bg-gray-300 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                    <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
                    <div className="h-3 w-1/4 bg-gray-300 rounded mt-1"></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-1 space-y-4">
        <div className="h-48 bg-gray-100 rounded-md"></div>
        <div className="h-12  bg-gray-100 rounded mt-2"></div>
      </div>
    </div>
  );
}
