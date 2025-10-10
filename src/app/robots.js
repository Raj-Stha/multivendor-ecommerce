export default function robots() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ecom.kalpabrikshya.com.np";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*", // API routes
          "/checkout", // Private pages
          "/cart",
          "/wishlist",
          "/*?*", // Avoid duplicate content due to query parameters
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/*", "/checkout", "/cart", "/wishlist"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl, // Optional but good for SEO clarity
  };
}
