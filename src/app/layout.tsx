import type { Metadata } from "next";
import { Nunito, Rubik, Jost, Noto_Sans } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientWrapper from "@/components/ClientWrapper";
import { Providers } from "@/components/Providers";
import { CartProvider } from "@/app/(home)/_context/CartContext";
import { WishlistProvider } from "@/app/(home)/_context/WishlistContext";

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

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Ecommerce - Online Shopping for Electronics, Home & Appliances",
  description:
    "Online Shopping for Electronics, Home & Appliances. Buy and sell the latest technology and gadgets.",
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
          <CartProvider>
            <WishlistProvider>
              <ClientWrapper>{children}</ClientWrapper>
            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
