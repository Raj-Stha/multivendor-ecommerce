"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./cart-items";
import { OrderSummary } from "./order-summary";
import { ArrowLeft } from "lucide-react";

export function CartList({ cart }) {
  // Group items by vendor
  const itemsByVendor = cart.reduce((acc, item) => {
    if (!acc[item.vendor_id]) {
      acc[item.vendor_id] = {
        vendor_name: item.vendor_name,
        items: [],
      };
    }
    acc[item.vendor_id].items.push(item);
    return acc;
  }, {});

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-balance">
            Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
          </h2>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {Object.entries(itemsByVendor).map(([vendorId, vendor]) => (
          <Card key={vendorId} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Vendor
                </Badge>
                {vendor.vendor_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {vendor.items.map((item, index) => (
                <div key={item.variant_id}>
                  <CartItem item={item} />
                  {index < vendor.items.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="lg:col-span-1">
        <OrderSummary items={cart} />
      </div>
    </div>
  );
}
