"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice, formatDate } from "@/utils/formatters";
import type { Product } from "@/types/product";

// Shared animation duration constant (in ms)
const MODAL_ANIMATION_DURATION = 200;

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Internal state to manage exit animation
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle the close with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  // Handle animation end - call onClose after exit animation completes
  const handleAnimationEnd = useCallback(() => {
    if (isClosing) {
      setIsClosing(false);
      setShouldRender(false);
      onClose();
    }
  }, [isClosing, onClose]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleClose],
  );

  // Sync internal render state with isOpen prop
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (shouldRender && !isClosing) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);

      // Focus the modal
      const focusTimer = setTimeout(() => {
        modalRef.current?.focus();
      }, 0);

      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
        previousActiveElement.current?.focus();
      };
    }
  }, [shouldRender, isClosing, handleKeyDown]);

  if (!shouldRender || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const stockStatus =
    product.stock === 0
      ? { label: "Out of Stock", color: "text-error-600 bg-error-50" }
      : product.stock <= 5
        ? { label: "Low Stock", color: "text-warning-600 bg-warning-50" }
        : { label: "In Stock", color: "text-success-600 bg-success-50" };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-50"
        }`}
        style={{ transitionDuration: `${MODAL_ANIMATION_DURATION}ms` }}
        aria-hidden="true"
        onClick={handleClose}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.propertyName !== "opacity") return;
          handleAnimationEnd();
        }}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-200 ${
            isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{ transitionDuration: `${MODAL_ANIMATION_DURATION}ms` }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={handleClose}
            aria-label="Close product details"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Product Image */}
          <div className="relative h-64 sm:h-80 bg-gray-100">
            <ProductImage
              src={product.imageUrl}
              alt={`${product.name} - ${product.category} product image`}
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2
                  id="modal-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  {product.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}
              >
                {stockStatus.label}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold text-gray-900">
                  {product.category}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold text-gray-900 text-xl">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Stock Available</p>
                <p className="font-semibold text-gray-900">
                  {product.stock} units
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(product.updatedAt)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                disabled={isOutOfStock || isClosing}
                onClick={() => {
                  onAddToCart(product.id);
                  handleClose();
                }}
                aria-label={
                  isOutOfStock
                    ? `${product.name} is out of stock`
                    : `Add ${product.name} to cart`
                }
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isClosing}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
