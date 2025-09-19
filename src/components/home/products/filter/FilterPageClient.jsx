"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Filter } from "lucide-react";
import { FilterSidebar } from "./filter-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ProductCard } from "../list/product-card";
import { motion } from "framer-motion";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 animate-pulse">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm p-3 border flex flex-col gap-2"
        >
          <div className="w-full h-32 sm:h-40 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export function ProductFilterClient({
  initialFilterData,
  initialProducts,
  initialTotalItems,
  initialTotalPages,
  initialCurrentPage,
  initialSelectedFilters,
  initialSearchTerm,
  initialSortBy,
}) {
  const router = useRouter();

  const [filterData] = useState(initialFilterData);
  const [products, setProducts] = useState(initialProducts);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [selectedFilters, setSelectedFilters] = useState(
    initialSelectedFilters
  );

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const sortRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUpdatedProducts = async (url, requestBody) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error(`API responded with ${res.status}`);

      const data = await res.json();
      if (!abortControllerRef.current.signal.aborted) {
        setProducts(data.details || []);
        setTotalItems(data.hint?.total_count || 0);
        setTotalPages(data.hint?.total_pages || 0);
        setCurrentPage(data.hint?.page_number || 1);
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        setProducts([]);
        setTotalItems(0);
        setTotalPages(0);
        setCurrentPage(1);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) setLoading(false);
    }
  };

  const updateURL = useCallback(
    (newFilters, newSearchTerm, newSortBy, newPage = 1) => {
      const params = new URLSearchParams();
      if (newSearchTerm) params.set("search", newSearchTerm);
      if (newSortBy && newSortBy !== "latest") params.set("sort", newSortBy);
      if (newPage > 1) params.set("page", newPage.toString());

      if (newFilters.category) params.set("category", newFilters.category);
      if (newFilters.manufacturer)
        params.set("manufacturer", newFilters.manufacturer);
      if (newFilters.vendor) params.set("vendor", newFilters.vendor);
      if (newFilters.priceRange) {
        params.set("minPrice", newFilters.priceRange.min.toString());
        params.set("maxPrice", newFilters.priceRange.max.toString());
      }

      router.replace(params.toString() ? `/products?${params}` : "/products");

      fetchUpdatedProducts(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api"
        }/getproducts`,
        {
          limit: 12,
          page_number: newPage,
          price_from: newFilters.priceRange.min,
          price_to: newFilters.priceRange.max,
          order_by:
            newSortBy === "asc"
              ? "price_asc"
              : newSortBy === "desc"
              ? "price_desc"
              : "latest",
          ...(newSearchTerm && { search_word: newSearchTerm }),
          ...(newFilters.category && {
            category_id: Number(newFilters.category),
          }),
          ...(newFilters.manufacturer && {
            manufacturer_id: Number(newFilters.manufacturer),
          }),
          ...(newFilters.vendor && { vendor_id: Number(newFilters.vendor) }),
        }
      );
    },
    [router]
  );

  useEffect(() => {
    if (debouncedSearchTerm !== initialSearchTerm) {
      updateURL(selectedFilters, debouncedSearchTerm, sortBy, 1);
    }
  }, [debouncedSearchTerm]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(newFilters);
    updateURL(newFilters, debouncedSearchTerm, sortBy, 1);
  };

  const handleClearFilters = () => {
    const cleared = {
      category: "",
      manufacturer: "",
      vendor: "",
      priceRange: {
        min: filterData?.priceRange?.min || 0,
        max: filterData?.priceRange?.max || 1000,
      },
    };

    setSelectedFilters(cleared);
    setSearchTerm("");
    setSortBy("latest");
    setCurrentPage(1);

    updateURL(cleared, "", "latest", 1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    updateURL(selectedFilters, debouncedSearchTerm, newSortBy, 1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      updateURL(selectedFilters, debouncedSearchTerm, sortBy, page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const sortOptions = [
    { name: "Latest", value: "age_asc" },
    { name: "Oldest", value: "age_desc" },
    { name: "Price: Low to High", value: "price_asc" },
    { name: "Price: High to Low", value: "price_desc" },
  ];

  return (
    <>
      {/* Header */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
        {/* Mobile Header */}
        <div className="flex flex-col space-y-3 md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Category Products
              </h1>
              <p className="text-xs text-gray-600">
                {loading ? "Loading..." : `${totalItems} Items found`}
              </p>
            </div>
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter By
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <FilterSidebar
                  filters={filterData}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  showCreatedBy={false}
                  showVariants={false}
                  isLoading={loading}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-12 placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary/90 focus:border-primary/90"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-lg hover:bg-primary transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex lg:flex-row flex-col gap-4 lg:gap-0">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Category Products
              </h1>
              <p className="text-sm text-gray-600">
                {loading ? "Loading..." : `${totalItems} Items found`}
              </p>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-12 placeholder-gray-500 focus:ring-2 focus:ring-primary/90 focus:border-primary/90"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-lg hover:bg-primary transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              ref={sortRef}
              className="flex items-center justify-between gap-3"
            >
              <span className="font-base text-xs md:text-sm text-gray-600">
                Sort by
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-white text-gray-900 px-3 py-2 rounded-lg flex items-center gap-2 min-w-40 border hover:border-primary/90 transition-colors"
                  disabled={loading}
                >
                  <p className="text-sm">
                    {sortOptions.find((opt) => opt.value === sortBy)?.name ||
                      "Default"}
                  </p>
                  <ChevronDown
                    className={`h-4 w-4 ml-auto transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-0 top-full w-full bg-white border z-50 transition-all duration-300 origin-top rounded-lg ${
                    isOpen
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="space-y-1 max-h-[450px] overflow-y-auto">
                    {sortOptions.map((option, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setIsOpen(false);
                          handleSortChange(option.value);
                        }}
                        className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <span className="text-gray-700 font-medium text-sm">
                          {option.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="hidden md:block w-80 flex-shrink-0">
          <FilterSidebar
            filters={filterData}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isLoading={loading}
          />
        </div>

        <div className="flex-1 min-w-0 relative">
          {/* Show skeleton while loading */}
          {loading ? (
            <ProductSkeletonGrid count={8} />
          ) : products?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3">
                {products.map((product, i) => (
                  <motion.div
                    key={`${product.product_id}-${product.vendor_id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <ProductCard product={product} border="true" />
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage <= 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {currentPage > 3 && (
                        <>
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(1)}
                              className="cursor-pointer"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {currentPage > 4 && <span className="px-2">...</span>}
                        </>
                      )}

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(
                              1,
                              Math.min(totalPages - 4, currentPage - 2)
                            ) + i;
                          if (pageNum > totalPages) return null;
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNum)}
                                isActive={pageNum === currentPage}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <span className="px-2">...</span>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(totalPages)}
                              className="cursor-pointer"
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={
                            currentPage >= totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No products found.</p>
              <button
                onClick={handleClearFilters}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 mt-4"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
