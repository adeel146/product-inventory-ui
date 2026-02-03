import {
  formatPrice,
  formatDate,
  truncateText,
  calculateDiscount,
} from "@/utils/formatters";

describe("Formatter Utilities", () => {
  describe("formatPrice", () => {
    it("formats regular prices correctly", () => {
      expect(formatPrice(99.99)).toBe("$99.99");
      expect(formatPrice(10)).toBe("$10.00");
      expect(formatPrice(0)).toBe("$0.00");
    });

    it("handles edge cases gracefully", () => {
      expect(formatPrice(NaN)).toBe("$0.00");
      expect(formatPrice(Infinity)).toBe("$∞");
      expect(formatPrice(-Infinity)).toBe("-$∞");
    });
  });

  describe("formatDate", () => {
    it("formats valid dates correctly", () => {
      const result = formatDate("2024-01-15T10:30:00Z");
      expect(result).toMatch(/Jan 15, 2024/);
    });

    it("handles invalid dates gracefully", () => {
      expect(formatDate("invalid-date")).toBe("Invalid date");
      expect(formatDate("")).toBe("Unknown date");
    });
  });

  describe("truncateText", () => {
    it("truncates long text correctly", () => {
      const longText = "This is a very long text that should be truncated";
      expect(truncateText(longText, 13)).toBe("This is a ...");
    });

    it("returns short text unchanged", () => {
      expect(truncateText("Short", 10)).toBe("Short");
    });

    it("handles edge cases gracefully", () => {
      expect(truncateText("", 5)).toBe("");
      expect(truncateText("test", -1)).toBe("");
      expect(truncateText("test", 0)).toBe("");
    });
  });

  describe("calculateDiscount", () => {
    it("calculates discount correctly", () => {
      expect(calculateDiscount(100, 10)).toBe(90);
      expect(calculateDiscount(50, 20)).toBe(40);
    });

    it("clamps invalid discount percentages", () => {
      // Negative discount should be treated as 0%
      expect(calculateDiscount(100, -10)).toBe(100);
      // Discount > 100% should be clamped to 100%
      expect(calculateDiscount(100, 150)).toBe(0);
    });
  });
});
