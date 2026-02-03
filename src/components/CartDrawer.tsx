"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCart, CartItem } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatters";
import { ProductImage } from "@/components/ui/ProductImage";

export function CartDrawer() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartOpen,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when drawer opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
      }

      // Focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Prevent body scroll when drawer is open
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setCartOpen]);

  const handleOverlayClick = useCallback(() => {
    setCartOpen(false);
  }, [setCartOpen]);

  const handleQuantityChange = useCallback(
    (productId: string, newQuantity: number) => {
      updateQuantity(productId, newQuantity);
    },
    [updateQuantity],
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2
            id="cart-drawer-title"
            className="text-lg font-semibold text-gray-900"
          >
            Shopping Cart ({totalItems})
          </h2>
          <button
            ref={closeButtonRef}
            onClick={() => setCartOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add some products to get started</p>
            </div>
          ) : (
            <ul className="space-y-4" aria-label="Cart items">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onRemove={removeFromCart}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="space-y-2">
              <button
                className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => {
                  // TODO: Implement checkout
                  alert("Checkout functionality coming soon!");
                }}
              >
                Proceed to Checkout
              </button>
              <button
                className="w-full py-2 px-4 text-gray-600 font-medium hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Individual cart item row
function CartItemRow({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
}) {
  const { product, quantity } = item;

  return (
    <li className="flex gap-4 p-3 bg-gray-50 rounded-lg">
      {/* Product Image */}
      <div className="w-16 h-16 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          width={64}
          height={64}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {formatPrice(product.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onQuantityChange(product.id, quantity - 1)}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={`Decrease quantity of ${product.name}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <span
            className="w-8 text-center text-sm font-medium"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>

          <button
            onClick={() => onQuantityChange(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Increase quantity of ${product.name}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(product.id)}
        className="self-start p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-error-500"
        aria-label={`Remove ${product.name} from cart`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </li>
  );
}
