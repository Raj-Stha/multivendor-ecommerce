"use client";

import { Search, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ImprovedSearchBar({
  placeholder = "Search here...",
  className = "",
  onProductSelect,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
  limit = 8,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  const searchProducts = useCallback(
    async (searchTerm) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (!searchTerm.trim()) {
        setResults([]);
        setIsOpen(false);
        setTotalResults(0);
        return;
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiBaseUrl}/getproducts`, {
          method: "POST",
          signal: abortControllerRef.current.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            limit: limit,
            page_number: 1,
            search_word: searchTerm.trim(),
          }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        const products = data.details.map((product) => ({
          id: product.variants[0]?.variant_id,
          vendor_id: product.vendor_id, // add vendor_id
          product_id: product.product_id,
          name: product.variants[0]?.variant_description,
          price: product.variants[0]?.product_price,
          sellPrice:
            product.variants[0]?.product_price -
            (product.variants[0]?.product_discount || 0),
          image: product.variants[0]?.featured_image || "/placeholder.svg",
          category: { name: product.category_name || "General" },
          brand: { name: product.brand_name || "" },
          slug: product.slug || "#",
        }));

        setResults(products);
        setTotalResults(data.hint?.total_count || 0);
        setIsOpen(true);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while searching";
        setError(errorMessage);
        setResults([]);
        setTotalResults(0);
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, limit]
  );

  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleInputChange = (e) => setQuery(e.target.value);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter") {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleSearchButtonClick = () => {
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative flex w-full sm:min-w-[350px] sm:max-w-[5500px] sm:mx-auto  overflow-hidden   rounded-none  bg-white text-black noto-sans-text">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 text-sm focus:outline-none transition-all duration-200"
          autoComplete="off"
        />

        <button
          onClick={handleSearchButtonClick}
          className="bg-secondary  text-white px-5  h-auto flex cursor-pointer  justify-center items-center  hover:bg-secondary/90 transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-96 overflow-hidden">
          {error ? (
            <div className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 text-sm font-medium">Search Error</p>
              <p className="text-red-500 text-xs mt-1">{error}</p>
              <button
                onClick={() => searchProducts(debouncedQuery)}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : isLoading && query ? (
            <div className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-gray-600 text-sm font-medium mt-2">
                Searching...
              </p>
            </div>
          ) : results.length > 0 ? (
            <>
              {totalResults > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs text-gray-600">
                    {totalResults > limit
                      ? `Showing ${results.length} of ${totalResults} results`
                      : `${totalResults} result${
                          totalResults !== 1 ? "s" : ""
                        } found`}
                  </p>
                </div>
              )}
              <div className="max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.vendor_id}/${product.product_id}`}
                    onClick={() => {
                      setIsOpen(false);
                      onProductSelect?.(product);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover"
                        onError={(e) =>
                          (e.target.src = "/placeholder.svg?height=40&width=40")
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {product.category.name}
                        </span>
                        {product.brand && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-500">
                              {product.brand.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex flex-col items-end">
                        {product.sellPrice < product.price ? (
                          <>
                            <span className="text-sm font-semibold text-primary">
                              {formatPrice(product.sellPrice)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : query && !isLoading ? (
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm font-medium">
                No products found
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Try searching with different keywords for "{query}"
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
