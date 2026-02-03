"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductDetailsModal } from "@/components/ProductDetailsModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import type { Product, FilterOptions } from "@/types/product";
import { getProducts } from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
  });

  // Product details modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cart and toast hooks
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const toast = useToast();

  // Fetch products for given filters
  const fetchProducts = useCallback(async (currentFilters: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(currentFilters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect responds to filter changes - filters is in deps so always current
  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  // Filter change handler - only updates state, effect handles the fetch
  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  // Memoized product count info
  const productCountInfo = useMemo(
    () => ({
      filtered: products.length,
      hasFilters: !!(
        filters.category ||
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined ||
        filters.inStock !== undefined
      ),
    }),
    [products.length, filters],
  );

  // Handler for cart actions - now fully implemented
  const handleAddToCart = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        toast.error("Product not found");
        return;
      }

      if (product.stock <= 0) {
        toast.warning(`${product.name} is out of stock`);
        return;
      }

      const currentQty = getItemQuantity(productId);
      if (currentQty >= product.stock) {
        toast.warning(`Maximum quantity reached for ${product.name}`);
        return;
      }

      const alreadyInCart = isInCart(productId);

      addToCart(product, 1);

      if (alreadyInCart) {
        toast.success(`Added another ${product.name} to cart`);
      } else {
        toast.success(`${product.name} added to cart!`);
      }
    },
    [products, addToCart, isInCart, getItemQuantity, toast],
  );

  // Handler for view details - opens modal
  const handleViewDetails = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
      }
    },
    [products],
  );

  // Close modal handler - modal handles its own exit animation
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  if (loading && products.length === 0) {
    return (
      <div role="status" aria-label="Loading products">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" role="alert" aria-live="assertive">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 mb-4">
          <svg
            className="w-8 h-8 text-error-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to Load Products
        </h3>
        <p className="text-error-600 mb-4">{error}</p>
        <button
          onClick={() => fetchProducts(filters)}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Product Inventory
          </h2>
          <div
            className="text-sm text-gray-500"
            role="status"
            aria-live="polite"
          >
            {productCountInfo.hasFilters
              ? `Found ${products.length} products matching filters`
              : `Showing all ${products.length} products`}
          </div>
        </div>

        <ProductFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {loading && (
          <div
            className="flex justify-center py-4"
            role="status"
            aria-label="Updating results"
          >
            <LoadingSpinner size="sm" />
          </div>
        )}

        {!loading && products.length === 0 ? (
          <div className="text-center py-12" role="status" aria-live="polite">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 mb-4">
              No products match your current filter criteria.
            </p>
            <button
              onClick={() =>
                handleFiltersChange({
                  category: "",
                  minPrice: undefined,
                  maxPrice: undefined,
                  inStock: undefined,
                })
              }
              className="text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Product list"
          >
            {products.map((product) => (
              <div key={product.id} role="listitem">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
