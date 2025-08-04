// Placeholder for NotificationIcon.tsx
"use client";

import { Bell, Heart } from "lucide-react";
import Link from "next/link";

export default function NotificationIcon({ count = 0 }) {
  return (
    <Link
      href="/notifications"
      className="relative hover:text-primary transition-colors items-baseline"
    >
      <Heart className="h-5 w-5 text-gray-700 hover:text-primary transition-colors" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center nunito-text font-medium">
          {count}
        </span>
      )}
    </Link>
  );
}
