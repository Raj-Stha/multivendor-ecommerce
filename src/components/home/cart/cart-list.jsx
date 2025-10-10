"use client";

import { Button } from "@/components/ui/button";
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
    <div className="grid lg:grid-cols-3 gap-6 jost-text">
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-balance">
            Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
          </h2>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Cart Items */}
        <div className="space-y-6">
          {Object.entries(itemsByVendor).map(([vendorId, vendor]) => (
            <div key={vendorId} className="space-y-3 border border-gray-300">
              {/* Vendor Name */}
              <div className="flex items-center mt-2">
                <span className="font-medium px-2">{vendor.vendor_name}</span>
              </div>

              {/* Vendor Items */}
              <div className="space-y-4 border-b border-gray-200 pb-1">
                {vendor.items.map((item, index) => (
                  <div key={item.variant_id}>
                    <CartItem item={item} />
                    {index < vendor.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <OrderSummary items={cart} />
      </div>
    </div>
  );
}
