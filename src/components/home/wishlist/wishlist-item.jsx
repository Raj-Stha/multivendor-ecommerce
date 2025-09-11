"use client";

import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWishlist } from "@/app/(home)/_context/WishlistContext";
import { useCart } from "@/app/(home)/_context/CartContext";
import { useState } from "react";

export function WishlistItem({ item }) {
  const { toggleWishlistItem, wishlist } = useWishlist();
  const { updateCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = wishlist.some(
    (w) => w.product_id === item.product_id && w.variant_id === item.variant_id
  );

  const handleRemove = () => {
    toggleWishlistItem(item.product_id, item.variant_id, item.vendor_id);
  };

  const handleAddToCart = () => {
    updateCart({
      product_id: item.product_id,
      vendor_id: item.vendor_id,
      variant_id: item.variant_id,
      order_count: quantity,
      type: "add",
    });
  };

  const handleWishlistToggle = () => {
    toggleWishlistItem(item.product_id, item.variant_id, item.vendor_id);
  };

  return (
    <Card className="flex flex-col gap-4 rounded-none p-4 hover:shadow-lg transition-shadow relative">
      {/* Image */}
      <div className="relative w-full aspect-square">
        <img
          src={item.product_image || "/placeholder.svg"}
          alt={item.product_name}
          className="w-full h-full object-cover rounded-none"
        />

        {/* Heart Button on top-right */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors z-10 ${
            isWishlisted
              ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
              : "bg-white text-red-500 border-red-300 hover:bg-red-50"
          }`}
        >
          <Heart
            size={12}
            className={
              isWishlisted ? "fill-white" : "fill-white/0 stroke-red-500"
            }
          />
        </Button>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-foreground">
          {item.product_name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {item.variant_description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
          <ShoppingCart size={16} /> Add to Cart
        </Button>
      </div>
    </Card>
  );
}
