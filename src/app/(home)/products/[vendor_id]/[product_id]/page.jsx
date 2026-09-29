import { generatePageMetadata } from "@/components/page-seo";
import ProductDetails from "@/components/home/products/single/ProductDetails";
import ProductSliderSection from "../../_components/products-slider-section";

export async function generateMetadata({ params }) {
  const { vendor_id, product_id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/getproductdetails`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_id: Number(vendor_id),
          product_id: Number(product_id),
        }),
        cache: "no-store",
      },
    );

    if (!res.ok) throw new Error("Failed to fetch product details");

    const data = await res.json();
    const product = data.details[0];

    // Pick the SEO image: featured_image first, else first variant image
    const seoImage =
      product.featured_image ||
      product.variants?.[0]?.product_image?.[0]?.image ||
      "/og-logo.png";

    return generatePageMetadata({
      title: `${product.product_name} by ${product.vendor_name}`,
      description:
        product.product_details.product_description ||
        "High-quality product available now",
      image: seoImage,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${vendor_id}/${product_id}`,
      keywords: `${product.product_name}, ${product.vendor_name}, ${product.product_name} online`,
    });
  } catch (error) {
    console.error(error);
    return generatePageMetadata({
      title: "Product Not Found",
      description: "We couldn't find this product.",
    });
  }
}

async function getRelatedProduct({ category_id }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/getproducts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 5,
          page_number: 1,
          category_id: category_id || null,
        }),
      },
    );
    const relatedProducts = await response.json();
    return relatedProducts;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return { details: [] };
  }
}

export default async function ProductPage({ params }) {
  const { vendor_id, product_id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/getproductdetails`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: Number(product_id),
          vendor_id: Number(vendor_id),
        }),
      },
    );

    if (!res.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Product Not Found
            </h1>
            <p className="text-muted-foreground">
              We couldn't load this product. Please try again later.
            </p>
          </div>
        </div>
      );
    }

    const data = await res.json();

    let relatedProducts = [];
    if (data?.details.length > 0) {
      relatedProducts = await getRelatedProduct({
        category_id: data?.details[0]?.category_id || null,
      });
    }
    return (
      <>
        <ProductDetails product={data.details} />
        {relatedProducts.details.length > 0 && (
          <ProductSliderSection products={relatedProducts.details} />
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We encountered an error loading this product.
          </p>
        </div>
      </div>
    );
  }
}
