"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

export function OrderSummary({ items }) {
  const router = useRouter();
  const subtotal = items.reduce((sum, item) => {
    const discountedPrice =
      item.product_price * (1 - item.product_discount / 100);
    return sum + discountedPrice * item.cart_quantity;
  }, 0);

  const originalTotal = items.reduce((sum, item) => {
    return sum + item.product_price * item.cart_quantity;
  }, 0);

  const totalSavings = originalTotal - subtotal;
  const averageTaxRate = items.length > 0 ? items[0].tax_rate : 0; // Assuming same tax rate
  const tax = subtotal * (averageTaxRate / 100);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return (
    <Card className="sticky top-24 jost-text">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({items.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {totalSavings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Total Savings</span>
              <span>-${totalSavings.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Tax ({averageTaxRate}%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <span>Shipping</span>
              {shipping === 0 && (
                <Badge variant="secondary" className="text-xs">
                  FREE
                </Badge>
              )}
            </div>
            <span>${shipping.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push("/checkout")}
          >
            Proceed to Checkout
          </Button>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>

        {shipping > 0 && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
            <p className="text-xs text-accent-foreground">
              <strong>Free shipping</strong> on orders over $50! Add $
              {(50 - subtotal).toFixed(2)} more to qualify.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
