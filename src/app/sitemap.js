const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ecom.kalpabrikshya.com.np/api";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ecom.kalpabrikshya.com.np";

async function safeFetch(url, options) {
  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

export default async function sitemap() {
  // Fetch product data from backend API
  const productData = await safeFetch(`${apiBaseUrl}/getproducts`, {
    method: "POST",
    body: {
      limit: 1000,
      page_number: 1,
      price_from: 0,
      price_to: 100000,
      product_name: "",
      order_by: "price_desc",
    },
  });

  const products = productData?.data || [];

  // Static pages (frontend URLs)
  const staticPages = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // Dynamic product URLs (frontend routes)
  const productUrls = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug || product.id}`,
    lastModified: new Date(
      product.updatedAt || product.updated_at || new Date()
    ),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productUrls];
}
