"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";

export function FilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  isLoading = false,
}) {
  const [manufacturerSearch, setManufacturerSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const maxPrice = filters?.priceRange?.max || 4000;

  // 🔥 sync priceInputs with selectedFilters
  const [priceInputs, setPriceInputs] = useState({
    min: selectedFilters.priceRange?.min || 0,
    max: selectedFilters.priceRange?.max || maxPrice,
  });

  useEffect(() => {
    setPriceInputs({
      min: selectedFilters.priceRange?.min || 0,
      max: selectedFilters.priceRange?.max || maxPrice,
    });
  }, [selectedFilters, maxPrice]);

  const filterBySearch = (items, search, key) =>
    items.filter((item) =>
      item[key].toLowerCase().includes(search.toLowerCase())
    );

  const handlePriceChange = (key, value) => {
    const newRange = { ...priceInputs, [key]: value };
    setPriceInputs(newRange);
    onFilterChange("priceRange", newRange);
  };

  return (
    <div className="w-full bg-white border-r p-6">
      {/* Clear Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-primary hover:text-secondary cursor-pointer"
          disabled={isLoading}
        >
          <RotateCcw className="h-4 w-4 mr-2 " /> Clear
        </Button>
      </div>

      {/* Price */}
      <div className="border p-4 rounded-lg mb-6">
        <Label className="block mb-2">Price</Label>
        <div className="flex gap-2 mb-3">
          <Input
            type="number"
            value={priceInputs.min}
            onChange={(e) => handlePriceChange("min", +e.target.value)}
            min={0}
            max={maxPrice}
            disabled={isLoading}
          />
          <Input
            type="number"
            value={priceInputs.max}
            onChange={(e) => handlePriceChange("max", +e.target.value)}
            min={0}
            max={maxPrice}
            disabled={isLoading}
          />
        </div>
        <Slider
          value={[
            selectedFilters.priceRange?.min || 0,
            selectedFilters.priceRange?.max || maxPrice,
          ]}
          onValueChange={(val) =>
            onFilterChange("priceRange", { min: val[0], max: val[1] })
          }
          max={maxPrice}
          step={10}
          disabled={isLoading}
        />
      </div>

      {/* Categories */}
      <div className="border p-4 rounded-lg mb-6">
        <Label className="block mb-2">Categories</Label>
        <Input
          placeholder="Search..."
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          disabled={isLoading}
        />
        <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
          {filterBySearch(
            filters?.categories || [],
            categorySearch,
            "category_name"
          ).map((cat) => {
            const isSelected =
              selectedFilters.category === cat.category_id.toString();
            return (
              <label
                key={cat.category_id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  isSelected ? "bg-primary/10" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    onFilterChange(
                      "category",
                      isSelected ? "" : cat.category_id.toString()
                    )
                  }
                  disabled={isLoading}
                />
                {cat.category_name}
              </label>
            );
          })}
        </div>
      </div>

      {/* Vendors */}
      <div className="border p-4 rounded-lg mb-6">
        <Label className="block mb-2">Vendors</Label>
        <Input
          placeholder="Search..."
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
          disabled={isLoading}
        />
        <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
          {filterBySearch(
            filters?.vendor || [],
            vendorSearch,
            "vendor_name"
          ).map((v) => {
            const isSelected =
              selectedFilters.vendor === v.vendor_id.toString();
            return (
              <label
                key={v.vendor_id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  isSelected ? "bg-primary/10" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    onFilterChange(
                      "vendor",
                      isSelected ? "" : v.vendor_id.toString()
                    )
                  }
                  disabled={isLoading}
                />
                {v.vendor_name}
              </label>
            );
          })}
        </div>
      </div>

      {/* Manufacturers */}
      <div className="border p-4 rounded-lg">
        <Label className="block mb-2">Manufacturers</Label>
        <Input
          placeholder="Search..."
          value={manufacturerSearch}
          onChange={(e) => setManufacturerSearch(e.target.value)}
          disabled={isLoading}
        />
        <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
          {filterBySearch(
            filters?.manufacturer || [],
            manufacturerSearch,
            "manufacturer_name"
          ).map((m) => {
            const isSelected =
              selectedFilters.manufacturer === m.manufacturer_id.toString();
            return (
              <label
                key={m.manufacturer_id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  isSelected ? "bg-primary/10" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    onFilterChange(
                      "manufacturer",
                      isSelected ? "" : m.manufacturer_id.toString()
                    )
                  }
                  disabled={isLoading}
                />
                {m.manufacturer_name}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
