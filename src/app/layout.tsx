import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientWrapper from "@/components/ClientWrapper";
import { Providers } from "@/components/Providers";

// Load fonts
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Eommerce - Online Shopping for Electronics, Home & Appliances",
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
        className={`${nunito.variable} ${poppins.variable} antialiased h-full`}
      >
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
