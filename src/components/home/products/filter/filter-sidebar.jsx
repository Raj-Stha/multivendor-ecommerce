"use client";

import { useState } from "react";
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
  showCreatedBy = true,
  showVariants = true,
}) {
  const [manufacturerSearch, setManufacturerSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState([]);

  const [priceInputs, setPriceInputs] = useState({
    min: selectedFilters.priceRange?.min || 0,
    max: selectedFilters.priceRange?.max || 1000,
  });

  const filterBySearch = (items, search, key = "name") =>
    items.filter((item) =>
      item[key].toLowerCase().includes(search.toLowerCase())
    );

  const handlePriceSliderChange = (value) => {
    const newRange = { min: value[0], max: value[1] };
    setPriceInputs(newRange);
    onFilterChange("priceRange", newRange);
  };

  const handlePriceInputChange = (type, value) => {
    const numValue = Number.parseInt(value) || 0;
    const newInputs = { ...priceInputs, [type]: numValue };
    setPriceInputs(newInputs);
  };

  const handlePriceInputBlur = () => {
    // Ensure min is not greater than max
    const min = Math.min(priceInputs.min, priceInputs.max);
    const max = Math.max(priceInputs.min, priceInputs.max);
    const newRange = { min, max };
    setPriceInputs(newRange);
    onFilterChange("priceRange", newRange);
  };

  const maxPrice = filters?.priceRange?.max || 4000;

  return (
    <div className="w-full bg-white border-r border-gray-200 h-full overflow-y-auto p-6 nunito-text">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-slate-600 hover:bg-slate-50 bg-transparent"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        <div className="border border-red-500 p-4 rounded-lg bg-white shadow-sm">
          <Label className="text-sm font-medium text-slate-700 mb-4 block">
            Price
          </Label>

          {/* Min/Max Input Fields */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <Label className="text-xs text-gray-500 mb-1 block">Min</Label>
              <Input
                type="number"
                value={priceInputs.min}
                onChange={(e) => handlePriceInputChange("min", e.target.value)}
                onBlur={handlePriceInputBlur}
                className="text-center"
                min="0"
                max={maxPrice}
              />
            </div>
            <span className="text-gray-400 mt-5">-</span>
            <div className="flex-1">
              <Label className="text-xs text-gray-500 mb-1 block">Max</Label>
              <Input
                type="number"
                value={priceInputs.max}
                onChange={(e) => handlePriceInputChange("max", e.target.value)}
                onBlur={handlePriceInputBlur}
                className="text-center"
                min="0"
                max={maxPrice}
              />
            </div>
            <Button
              size="sm"
              onClick={handlePriceInputBlur}
              className="bg-blue-600 hover:bg-blue-700 text-white mt-5"
            >
              →
            </Button>
          </div>

          {/* Price Slider */}
          <div className="px-2">
            <Slider
              value={[
                selectedFilters.priceRange?.min || 0,
                selectedFilters.priceRange?.max || maxPrice,
              ]}
              onValueChange={handlePriceSliderChange}
              max={maxPrice}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$0</span>
              <span>${maxPrice}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Categories
          </Label>
          <Input
            placeholder="Search Categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="mb-3"
          />
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {/* API Categories */}
            {filterBySearch(
              filters?.categories || [],
              categorySearch,
              "category_name"
            ).map((cat) => (
              <div key={cat.category_id}>
                <label
                  htmlFor={`cat-${cat.category_id}-single`}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="category"
                    id={`cat-${cat.category_id}-single`}
                    checked={
                      selectedFilters.category === cat.category_id.toString()
                    }
                    onChange={() =>
                      onFilterChange("category", cat.category_id.toString())
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm text-slate-700">
                    {cat.category_name}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Vendors
          </Label>
          <Input
            placeholder="Search Vendors..."
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            className="mb-3"
          />
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {filterBySearch(
              filters?.vendor || [],
              vendorSearch,
              "vendor_name"
            ).map((vendor) => (
              <div
                key={vendor.vendor_id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <input
                  type="radio"
                  name="vendor"
                  id={`vendor-${vendor.vendor_id}`}
                  checked={
                    selectedFilters.vendor === vendor.vendor_id.toString()
                  }
                  onChange={() =>
                    onFilterChange("vendor", vendor.vendor_id.toString())
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label
                  htmlFor={`vendor-${vendor.vendor_id}`}
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  {vendor.vendor_name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Manufacturers
          </Label>
          <Input
            placeholder="Search Manufacturers..."
            value={manufacturerSearch}
            onChange={(e) => setManufacturerSearch(e.target.value)}
            className="mb-3"
          />
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {filterBySearch(
              filters?.manufacturer || [],
              manufacturerSearch,
              "manufacturer_name"
            ).map((manufacturer) => (
              <div
                key={manufacturer.manufacturer_id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <input
                  type="radio"
                  name="manufacturer"
                  id={`manufacturer-${manufacturer.manufacturer_id}`}
                  checked={
                    selectedFilters.manufacturer ===
                    manufacturer.manufacturer_id.toString()
                  }
                  onChange={() =>
                    onFilterChange(
                      "manufacturer",
                      manufacturer.manufacturer_id.toString()
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label
                  htmlFor={`manufacturer-${manufacturer.manufacturer_id}`}
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  {manufacturer.manufacturer_name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Created By (conditionally shown) */}
        {/* {showCreatedBy && (
          <div className="border p-4 rounded-lg bg-white shadow-sm">
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Created By
            </Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filters.users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedFilters.createdBy?.includes(user.id)}
                    onChange={(e) =>
                      onFilterChange(
                        "createdBy",
                        e.target.checked
                          ? [...(selectedFilters.createdBy || []), user.id]
                          : selectedFilters.createdBy.filter(
                              (u) => u !== user.id
                            )
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label
                    htmlFor={`user-${user.id}`}
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    {user.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Has Variant */}
        {/* {showVariants && (
          <div className="border p-4 rounded-lg bg-white shadow-sm">
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Has Variants
            </Label>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant={
                  selectedFilters.hasVariant === "true" ? "default" : "outline"
                }
                onClick={() => onFilterChange("hasVariant", "true")}
                className="transition-all"
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant={
                  selectedFilters.hasVariant === "false" ? "default" : "outline"
                }
                onClick={() => onFilterChange("hasVariant", "false")}
                className="transition-all"
              >
                No
              </Button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
