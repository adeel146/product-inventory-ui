"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice } from "@/utils/formatters";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
}

// Optimized component with proper memoization and accessibility
export function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  // Memoize computed values to prevent recalculation on every render
  const stockStatus = useMemo(() => {
    if (product.stock === 0)
      return { label: "Out of Stock", color: "text-error-600 bg-error-50" };
    if (product.stock <= 5)
      return { label: "Low Stock", color: "text-warning-600 bg-warning-50" };
    return { label: "In Stock", color: "text-success-600 bg-success-50" };
  }, [product.stock]);

  // Deterministic discount calculation based on product ID (not random)
  const discountedPrice = useMemo(() => {
    // Use product ID hash to determine if item is on sale (deterministic)
    const idSum = product.id
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return idSum % 3 === 0 ? product.price * 0.9 : null;
  }, [product.id, product.price]);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    }
  };

  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
      aria-labelledby={`product-name-${product.id}`}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <ProductImage
          src={product.imageUrl}
          alt={`${product.name} - ${product.category} product image`}
        />
        {discountedPrice && (
          <div
            className="absolute top-2 right-2 bg-error-500 text-white px-2 py-1 text-xs rounded font-medium z-10"
            aria-label="This item is on sale with 10% discount"
          >
            10% Off
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3
            id={`product-name-${product.id}`}
            className="text-lg font-semibold text-gray-900 truncate"
          >
            {product.name}
          </h3>
          {/* Accessible stock badge */}
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${stockStatus.color}`}
            role="status"
            aria-label={`Availability: ${stockStatus.label}`}
          >
            {stockStatus.label}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Category</span>
            <span className="text-sm font-medium">{product.category}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500">Stock</span>
            <span
              className="text-sm font-medium"
              aria-label={`${product.stock} items in stock`}
            >
              {product.stock}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-baseline">
            {discountedPrice ? (
              <>
                <span className="text-lg font-bold text-error-600">
                  {formatPrice(discountedPrice)}
                </span>
                <span
                  className="text-sm text-gray-500 line-through ml-2"
                  aria-label={`Original price ${formatPrice(product.price)}`}
                >
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">SKU: {product.sku}</span>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            className="flex-1"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            aria-label={
              isOutOfStock
                ? `${product.name} is out of stock`
                : `Add ${product.name} to cart`
            }
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewDetails}
            aria-label={`View details for ${product.name}`}
          >
            Details
          </Button>
        </div>
      </div>
    </article>
  );
}
