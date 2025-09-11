import { generatePageMetadata } from "@/components/page-seo"
import { WishlistContent } from "@/components/home/wishlist/wishlist-content"

export const metadata = generatePageMetadata({
  title: "My Wishlist - Save Your Favorite Products",
  description: "View and manage your saved products. Keep track of items you love and want to purchase later.",
  keywords: "wishlist, saved products, favorites, shopping list",
  url:"/wishlist"
})

export default function WishlistPage() {
  return <WishlistContent />
}
