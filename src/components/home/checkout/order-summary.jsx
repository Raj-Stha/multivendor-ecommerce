"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "react-hot-toast";

export function OrderSummary({ cartData, isLoading, onCompleteOrder }) {
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Calculate totals
  const subtotal = cartData.reduce((sum, item) => {
    const discountedPrice =
      item.product_price * (1 - item.product_discount / 100);
    return sum + discountedPrice * item.cart_quantity;
  }, 0);

  const originalTotal = cartData.reduce((sum, item) => {
    return sum + item.product_price * item.cart_quantity;
  }, 0);

  const totalSavings = originalTotal - subtotal;

  const tax = cartData.reduce((sum, item) => {
    const discountedPrice =
      item.product_price * (1 - item.product_discount / 100);
    const itemTotal = discountedPrice * item.cart_quantity;
    return sum + (itemTotal * item.tax_rate) / 100;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return (
    <>
      <Card className="elegant-shadow sticky top-24">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartData.map((item, index) => {
              const discountedPrice =
                item.product_price * (1 - item.product_discount / 100);
              const itemTotal = discountedPrice * item.cart_quantity;

              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-card">
                    <Image
                      src={item.product_image || "/placeholder.svg"}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm">{item.product_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.variant_description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {item.vendor_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      {item.product_discount > 0 && (
                        <>
                          <span className="text-xs text-muted-foreground line-through">
                            ${item.product_price.toFixed(2)}
                          </span>
                          <Badge className="text-xs">
                            {item.product_discount}% off
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Qty: {item.cart_quantity}
                    </div>
                    <div className="font-medium">${itemTotal.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Order Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {totalSavings > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Total Savings</span>
                <span>-${totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <span>Shipping</span>
                {shipping === 0 && <Badge className="text-xs">FREE</Badge>}
              </div>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full h-12 text-base font-medium bg-primary text-primary-foreground cursor-pointer  hover:bg-secondary"
            onClick={onCompleteOrder}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "🔒 Complete Order"}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            By completing your order, you agree to our Terms of Service and
            Privacy Policy
          </div>
        </CardContent>
      </Card>
    </>
  );
}
