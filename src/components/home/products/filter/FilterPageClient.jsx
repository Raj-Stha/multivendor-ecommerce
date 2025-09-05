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
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Skeleton placeholder for products while loading
function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-sm p-3">
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
  hasActiveFilters: initialHasActiveFilters,
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
  const [hasActiveFilters, setHasActiveFilters] = useState(
    initialHasActiveFilters
  );

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const sortRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUpdatedProducts = async (url, requestBody) => {
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

      const data = await res.json();
      const fetchedProducts = data.details || [];

      setProducts(fetchedProducts);
      setTotalItems(data.hint?.total_count || 0);
      setTotalPages(data.hint?.total_pages || 0);
      setCurrentPage(data.hint?.page_number || 1);
    } catch (e) {
      setProducts([]);
      setTotalItems(0);
      setTotalPages(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
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
      if (newFilters.createdBy) params.set("createdBy", newFilters.createdBy);
      if (newFilters.hasVariant)
        params.set("hasVariant", newFilters.hasVariant);
      if (newFilters.priceRange.min !== (filterData?.priceRange?.min || 0)) {
        params.set("minPrice", newFilters.priceRange.min.toString());
      }
      if (newFilters.priceRange.max !== (filterData?.priceRange?.max || 1000)) {
        params.set("maxPrice", newFilters.priceRange.max.toString());
      }

      const newURL = params.toString()
        ? `/products?${params.toString()}`
        : "/products";

      router.push(newURL);

      const requestBody = {
        limit: 10,
        page_number: newPage,
        price_from: newFilters.priceRange.min.toString(),
        price_to: newFilters.priceRange.max.toString(),
        order_by:
          newSortBy === "asc"
            ? "price_asc"
            : newSortBy === "desc"
            ? "price_desc"
            : "latest",
      };

      if (newSearchTerm) requestBody.search_word = newSearchTerm;
      if (newFilters.category)
        requestBody.category_id = Number.parseInt(newFilters.category);
      if (newFilters.manufacturer)
        requestBody.manufacturer_id = Number.parseInt(newFilters.manufacturer);
      if (newFilters.vendor)
        requestBody.vendor_id = Number.parseInt(newFilters.vendor);

      fetchUpdatedProducts(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api"
        }/getproducts`,
        requestBody
      );
    },
    [filterData, router]
  );

  useEffect(() => {
    if (debouncedSearchTerm !== initialSearchTerm) {
      updateURL(selectedFilters, debouncedSearchTerm, sortBy, 1);
    }
  }, [
    debouncedSearchTerm,
    selectedFilters,
    sortBy,
    updateURL,
    initialSearchTerm,
  ]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(newFilters);
    updateURL(newFilters, debouncedSearchTerm, sortBy, 1);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    updateURL(selectedFilters, debouncedSearchTerm, newSortBy, currentPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURL(selectedFilters, debouncedSearchTerm, sortBy, newPage);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: "",
      manufacturer: "",
      vendor: "",
      createdBy: "",
      hasVariant: "",
      priceRange: {
        min: filterData?.priceRange?.min || 0,
        max: filterData?.priceRange?.max || 1000,
      },
    };
    setSelectedFilters(clearedFilters);
    setSearchTerm("");
    setSortBy("latest");
    setCurrentPage(1);
    setProducts(initialProducts);
    router.push("/products");
  };

  const sortOptions = [
    { name: "Latest", value: "latest" },
    { name: "Oldest", value: "oldest" },
    { name: "Price: Low to High", value: "asc" },
    { name: "Price: High to Low", value: "desc" },
  ];

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Header (Search + Filter + Sort) */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
        {/* Mobile Header */}
        <div className="flex flex-col space-y-3 md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Category Products
              </h1>
              <p className="text-xs text-gray-600">{totalItems} Items found</p>
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
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Search */}
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
              <p className="text-sm text-gray-600">{totalItems} Items found</p>
            </div>

            {/* Desktop Search */}
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

          {/* Desktop Sort */}
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
        {/* Sidebar */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <FilterSidebar
            filters={filterData}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            showCreatedBy={false}
            showVariants={false}
          />
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
            </div>
          ) : products?.length > 0 ? (
            <>
              {/* <ProductCardList products={products} /> */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4   gap-2 p-3 ">
                {products.slice(0, 6).map((product) => (
                  <motion.div
                    key={`${product.product_id}-${product.vendor_id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard
                      product={product}
                      key={`${product.product_id}-${product.vendor_id}`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent className="flex-wrap gap-1">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              handlePageChange(currentPage - 1);
                          }}
                          className={`${
                            currentPage <= 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          } text-xs sm:text-sm px-2 sm:px-3 hover:bg-primary/20`}
                        />
                      </PaginationItem>

                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNum);
                                }}
                                isActive={currentPage === pageNum}
                                className={
                                  currentPage === pageNum
                                    ? "bg-primary text-white"
                                    : "hover:bg-primary/20"
                                }
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              handlePageChange(currentPage + 1);
                          }}
                          className={`${
                            currentPage >= totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          } text-xs sm:text-sm px-2 sm:px-3 hover:bg-primary/20`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-base sm:text-lg mb-4">
                No products found matching your criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors text-sm sm:text-base"
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
