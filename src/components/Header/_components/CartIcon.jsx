import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/(home)/_context/CartContext";

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative hover:text-primary transition-colors items-baseline pt-1"
    >
      <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-primary md:hover:text-white transition-colors" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center nunito-text font-medium">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
