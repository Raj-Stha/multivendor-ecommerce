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
      <ShoppingCart className="h-6 w-6 text-primary  group-hover:text-secondary  transition-colors" />
      {cartCount > 0 && (
        <span className="absolute -top-3 -right-2 bg-primary border-primary text-white  group-hover:bg-secondary   text-xs rounded-full h-5 w-5 flex items-center justify-center nunito-text font-medium">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
