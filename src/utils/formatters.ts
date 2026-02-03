// Utility functions for formatting data with proper edge case handling

export function formatPrice(price: number): string {
  // Handle edge cases
  if (price === null || price === undefined || isNaN(price)) {
    return "$0.00";
  }

  if (!isFinite(price)) {
    return price > 0 ? "$∞" : "-$∞";
  }

  // Handle very large numbers with compact notation
  if (Math.abs(price) >= 1000000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(price);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(dateString: string): string {
  // Handle null/undefined/empty input
  if (!dateString) {
    return "Unknown date";
  }

  const date = new Date(dateString);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  // Handle null/undefined input
  if (text === null || text === undefined) {
    return "";
  }

  // Handle invalid maxLength
  if (maxLength <= 0) {
    return "";
  }

  // Handle maxLength less than ellipsis length
  if (maxLength <= 3) {
    return text.substring(0, maxLength);
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + "...";
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number,
): number {
  // Validate inputs
  if (
    originalPrice === null ||
    originalPrice === undefined ||
    isNaN(originalPrice)
  ) {
    return 0;
  }

  if (
    discountPercent === null ||
    discountPercent === undefined ||
    isNaN(discountPercent)
  ) {
    return originalPrice;
  }

  // Clamp discount percent to valid range (0-100)
  const clampedDiscount = Math.max(0, Math.min(100, discountPercent));

  const discountedPrice = originalPrice * (1 - clampedDiscount / 100);

  // Ensure we don't return negative values
  return Math.max(0, discountedPrice);
}
