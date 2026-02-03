"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/CartDrawer";

export function Navigation() {
  const pathname = usePathname();
  const { totalItems, toggleCart } = useCart();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const linkClasses = (path: string) => {
    const baseClasses =
      "px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";
    const activeClasses = "text-primary-600 bg-primary-50";
    const inactiveClasses =
      "text-gray-500 hover:text-gray-700 hover:bg-gray-50";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav
      className="bg-white shadow-sm border-b"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:rounded-md"
            >
              Product Inventory
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className={linkClasses("/")}
              aria-current={isActive("/") ? "page" : undefined}
            >
              Dashboard
            </Link>
            <Link
              href="/products"
              className={linkClasses("/products")}
              aria-current={isActive("/products") ? "page" : undefined}
            >
              Add Product
            </Link>

            {/* Cart indicator */}
            <button
              type="button"
              className="relative ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={`Shopping cart with ${totalItems} items`}
              onClick={toggleCart}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </nav>
  );
}
