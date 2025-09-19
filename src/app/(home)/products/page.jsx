import { generatePageMetadata } from "@/components/page-seo";
import { ProductFilterClient } from "@/components/home/products/filter/FilterPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      return null;
    }

    const responseText = await res.text();

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchFilterData() {
  const additionalParams = { page_number: 1, limit: 0 };

  const returnData = {
    categories: [],
    manufacturer: [],
    vendor: [],
    priceRange: { min: 0, max: 1000 },
  };

  try {
    const [categoryRes, manufacturerRes, vendorRes] = await Promise.all([
      getData(`${baseUrl}/getcategory`, additionalParams),
      getData(`${baseUrl}/getmanufacturer`, additionalParams),
      getData(`${baseUrl}/getvendor`, additionalParams),
    ]);

    if (categoryRes && categoryRes.details) {
      returnData.categories = categoryRes.details;
    }

    if (manufacturerRes && manufacturerRes.details) {
      returnData.manufacturer = manufacturerRes.details;
    }

    if (vendorRes && vendorRes.details) {
      returnData.vendor = vendorRes.details;
    }

    return returnData;
  } catch (error) {
    return returnData;
  }
}

async function fetchProducts(params, limit) {
  try {
    const requestBody = {
      limit: limit,
      page_number: Number.parseInt(params.page || "1"),
      price_from: params.minPrice || "0",
      price_to: params.maxPrice || "1000",
      order_by:
        params.sort === "asc"
          ? "price_asc"
          : params.sort === "desc"
          ? "price_desc"
          : "latest",
    };

    if (params.search) requestBody.search_word = params.search;
    if (params.category)
      requestBody.category_id = Number.parseInt(params.category);
    if (params.manufacturer)
      requestBody.manufacturer_id = Number.parseInt(params.manufacturer);
    if (params.vendor) requestBody.vendor_id = Number.parseInt(params.vendor);

    const response = await fetch(`${baseUrl}/getproducts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      products: data.details || [],
      total: data.hint?.total_count || 0,
      totalPages: data.hint?.total_pages || 0,
      currentPage: data.hint?.page_number || 1,
    };
  } catch (error) {
    return {
      products: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const searchTerm = params.search || "";
  const category = params.category || "";

  let title = "Products - Find Quality Items";
  let description =
    "Browse our extensive collection of quality products with advanced filtering and search capabilities.";

  if (searchTerm) {
    title = `Search Results for "${searchTerm}" - Products`;
    description = `Find products matching "${searchTerm}". Browse through our filtered results with advanced search capabilities.`;
  } else if (category) {
    title = `Category Products - Filtered Results`;
    description = `Browse products in your selected category with advanced filtering options.`;
  }

  return generatePageMetadata({
    title,
    description,
    keywords: `products, search, filter, ${searchTerm}, category, shopping, quality items`,
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/products`,
  });
}

export default async function ProductPage({ searchParams }) {
  const params = await searchParams;
  const limit = 12;

  const [filterData, productsData] = await Promise.all([
    fetchFilterData(),
    fetchProducts(params, limit),
  ]);

  const currentPage = Number.parseInt(params.page || "1");
  const totalItems = productsData.total || 0;
  const totalPages = productsData.totalPages || 0;
  const products = productsData.products || [];

  const selectedFilters = {
    category: params.category || "",
    manufacturer: params.manufacturer || "",
    vendor: params.vendor || "",
    createdBy: params.createdBy || "",
    hasVariant: params.hasVariant || "",
    priceRange: {
      min: Number.parseInt(params.minPrice || filterData.priceRange.min || "0"),
      max: Number.parseInt(
        params.maxPrice || filterData.priceRange.max || "1000"
      ),
    },
  };

  const searchTerm = params.search || "";
  const sortBy = params.sort || "latest";

  const hasActiveFilters =
    searchTerm ||
    selectedFilters.category ||
    selectedFilters.manufacturer ||
    selectedFilters.vendor ||
    selectedFilters.createdBy ||
    selectedFilters.hasVariant ||
    selectedFilters.priceRange.min !== (filterData?.priceRange?.min || 0) ||
    selectedFilters.priceRange.max !== (filterData?.priceRange?.max || 1000);

  return (
    <div className="bg-gray-50 min-h-screen nunito-text">
      <div className="container max-w-7xl mx-auto py-3 sm:py-6 px-1 sm:px-2 lg:px-3">
        {products && (
          <ProductFilterClient
            initialFilterData={filterData}
            initialProducts={products}
            initialTotalItems={totalItems}
            initialTotalPages={totalPages}
            initialCurrentPage={currentPage}
            initialSelectedFilters={selectedFilters}
            initialSearchTerm={searchTerm}
            initialSortBy={sortBy}
            hasActiveFilters={hasActiveFilters}
          />
        )}
      </div>
    </div>
  );
}
