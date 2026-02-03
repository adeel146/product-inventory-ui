"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Product image component with error handling and fallback
 * Gracefully handles invalid URLs and loading errors
 */
export function ProductImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "object-cover",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: ProductImageProps) {
  // Use fill by default unless width/height are provided
  const useFill = fill ?? (!width && !height);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate URL
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  };

  const showFallback = !src || hasError || !isValidUrl(src);

  if (showFallback) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gray-100 text-gray-400"
        style={useFill ? { width: "100%", height: "100%" } : { width, height }}
        aria-hidden="true"
      >
        <svg
          className={width && width < 80 ? "w-6 h-6" : "w-12 h-12 mb-2"}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {(!width || width >= 80) && <span className="text-sm">No Image</span>}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={
            useFill
              ? "absolute inset-0 flex items-center justify-center bg-gray-100"
              : "flex items-center justify-center bg-gray-100"
          }
          style={!useFill ? { width, height } : undefined}
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={useFill}
        width={useFill ? undefined : width}
        height={useFill ? undefined : height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </>
  );
}
