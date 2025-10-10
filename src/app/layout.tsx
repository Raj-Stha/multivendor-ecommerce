import type { Metadata } from "next";
import { Nunito, Rubik, Jost, Noto_Sans } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientWrapper from "@/components/ClientWrapper";
import { Providers } from "@/components/Providers";
import { CartProvider } from "@/app/(home)/_context/CartContext";
import { WishlistProvider } from "@/app/(home)/_context/WishlistContext";
import { UserProvider } from "@/app/(home)/_context/UserContext";

// Load fonts
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

// Base URLs from environment variables
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ecom.kalpabrikshya.com.np";
const siteName =
  process.env.NEXT_PUBLIC_WEBSITE_NAME || "Organic Grocery Store";
const logoUrl = `${siteUrl}/logo/logo.png`; // Adjust if stored elsewhere

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Fresh Vegetables, Organics & Daily Groceries Online`,
    template: `%s | ${siteName}`,
  },
  description:
    "Buy farm-fresh vegetables, organic products, and daily groceries online. Enjoy healthy living with fresh, natural, and locally sourced goods delivered to your doorstep.",
  keywords: [
    "Fresh Vegetables",
    "Organic Products",
    "Daily Groceries",
    "Organic Store",
    "Healthy Food",
    "Grocery Delivery",
    "Nepal",
    "Buy Vegetables Online",
    "Organic Grocery Nepal",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,

  // ✅ Open Graph (for Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${siteName} - Fresh Vegetables, Organics & Daily Groceries Online`,
    description:
      "Shop organic vegetables, fruits, grains, and everyday groceries online. Locally grown and delivered fresh from farms to your home.",
    siteName,
    images: [
      {
        url: `${siteUrl}/logo/logo.png`, // Preferably 1200x630px farm/grocery banner
        width: 1200,
        height: 630,
        alt: `${siteName} - Fresh Organics & Groceries`,
      },
      {
        url: logoUrl,
        width: 512,
        height: 512,
        alt: `${siteName} Logo`,
      },
    ],
  },

  // ✅ Twitter Card (for X / Twitter)
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Fresh Vegetables, Organics & Groceries Online`,
    description:
      "Get your favorite fresh vegetables, fruits, and organic groceries delivered to your home. Eat fresh, live healthy!",
    images: [`${siteUrl}/logo/logo.png`],
    creator: "@yourhandle", // optional
  },

  // ✅ Icons and manifest
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${nunito.variable} ${rubik.variable} ${jost.variable} ${notoSans.variable} antialiased h-full`}
      >
        <Providers>
          <UserProvider>
            <CartProvider>
              <WishlistProvider>
                <ClientWrapper>{children}</ClientWrapper>
              </WishlistProvider>
            </CartProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
