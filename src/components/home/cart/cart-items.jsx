"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/app/(home)/_context/CartContext";

export function CartItem({ item }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateCart } = useCart();

  const discountedPrice =
    item.product_price * (1 - item.product_discount / 100);
  const totalPrice = discountedPrice * item.cart_quantity;
  const savings = (item.product_price - discountedPrice) * item.cart_quantity;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 0) return;
    setIsUpdating(true);

    await updateCart({
      product_id: item.product_id,
      vendor_id: item.vendor_id,
      variant_id: item.variant_id,
      order_count: newQuantity,
    });

    setIsUpdating(false);
  };

  return (
    <div className="p-6">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border">
          <Image
            src={item.product_image || "/placeholder.svg"}
            alt={item.product_name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-pretty">{item.product_name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.variant_description}
              </p>
              {item.product_discount > 0 && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  {item.product_discount}% OFF
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(0)}
              className="text-muted-foreground hover:text-destructive"
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(item.cart_quantity - 1)}
                disabled={isUpdating || item.cart_quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">
                {item.cart_quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(item.cart_quantity + 1)}
                disabled={isUpdating}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <div className="font-semibold">${totalPrice.toFixed(2)}</div>
              {item.product_discount > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="line-through">
                    ${(item.product_price * item.cart_quantity).toFixed(2)}
                  </span>
                  <span className="ml-1 text-green-600">
                    Save ${savings.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                ${discountedPrice.toFixed(2)} each
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
