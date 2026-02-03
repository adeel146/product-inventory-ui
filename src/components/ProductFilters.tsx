"use client";

import { useCallback, useMemo, memo } from "react";
import type { ChangeEvent } from "react";
import type { FilterOptions, ProductCategory } from "@/types/product";

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const categories: ProductCategory[] = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Beauty",
  "Automotive",
];

// Optimized component with useCallback and memoization
export const ProductFilters = memo(function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const handleCategoryChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onFiltersChange({
        ...filters,
        category: e.target.value,
      });
    },
    [filters, onFiltersChange],
  );

  const handleMinPriceChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onFiltersChange({
        ...filters,
        minPrice: value ? parseFloat(value) : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleMaxPriceChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onFiltersChange({
        ...filters,
        maxPrice: value ? parseFloat(value) : undefined,
      });
    },
    [filters, onFiltersChange],
  );

  const handleStockChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      let inStock: boolean | undefined = undefined;
      if (value === "true") inStock = true;
      if (value === "false") inStock = false;

      onFiltersChange({
        ...filters,
        inStock,
      });
    },
    [filters, onFiltersChange],
  );

  // Reset doesn't need filters - it sets explicit values
  const handleReset = useCallback(() => {
    onFiltersChange({
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
    });
  }, [onFiltersChange]);

  // Memoize filter summary to prevent recalculation
  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.category) parts.push(`Category: ${filters.category}`);
    if (filters.minPrice !== undefined) parts.push(`Min: $${filters.minPrice}`);
    if (filters.maxPrice !== undefined) parts.push(`Max: $${filters.maxPrice}`);
    if (filters.inStock !== undefined)
      parts.push(filters.inStock ? "In Stock" : "Out of Stock");
    return parts.join(" • ");
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.inStock]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.category ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.inStock !== undefined
    );
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.inStock]);

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
      role="search"
      aria-label="Product filters"
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-4 space-y-4 lg:space-y-0">
        <div className="flex-1">
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-describedby="category-filter-desc"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <span id="category-filter-desc" className="sr-only">
            Filter products by category
          </span>
        </div>

        <div className="flex-1">
          <label
            htmlFor="min-price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Min Price
          </label>
          <input
            type="number"
            id="min-price"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={filters.minPrice ?? ""}
            onChange={handleMinPriceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-describedby="min-price-desc"
          />
          <span id="min-price-desc" className="sr-only">
            Minimum price filter in dollars
          </span>
        </div>

        <div className="flex-1">
          <label
            htmlFor="max-price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Max Price
          </label>
          <input
            type="number"
            id="max-price"
            placeholder="999.99"
            min="0"
            step="0.01"
            value={filters.maxPrice ?? ""}
            onChange={handleMaxPriceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-describedby="max-price-desc"
          />
          <span id="max-price-desc" className="sr-only">
            Maximum price filter in dollars
          </span>
        </div>

        <div className="flex-1">
          <label
            htmlFor="stock-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Availability
          </label>
          <select
            id="stock-filter"
            value={
              filters.inStock === undefined ? "" : filters.inStock.toString()
            }
            onChange={handleStockChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-describedby="stock-filter-desc"
          >
            <option value="">All Products</option>
            <option value="true">In Stock Only</option>
            <option value="false">Out of Stock Only</option>
          </select>
          <span id="stock-filter-desc" className="sr-only">
            Filter products by stock availability
          </span>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            type="button"
            aria-label="Reset all filters to default values"
            disabled={!hasActiveFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filter summary with live region for screen readers */}
      {filterSummary && (
        <div
          className="mt-3 text-xs text-gray-500"
          role="status"
          aria-live="polite"
          aria-label={`Active filters: ${filterSummary}`}
        >
          {filterSummary}
        </div>
      )}
    </div>
  );
});
