import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/(home)/_context/CartContext";

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative hover:text- group transition-colors items-baseline pt-1"
    >
      <ShoppingCart className="h-6 w-6 text-white   transition-colors" />
      {cartCount > 0 && (
        <span className="absolute -top-3 -right-2 bg-white border-primary text-primary group-hover:bg-secondary  group-hover:text-white text-xs rounded-full h-5 w-5 flex items-center justify-center nunito-text font-medium">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
