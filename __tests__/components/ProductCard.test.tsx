import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  description: "This is a test product description",
  category: "Electronics",
  price: 99.99,
  stock: 10,
  imageUrl: "https://example.com/image.jpg",
  sku: "TEST-001",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const outOfStockProduct: Product = {
  ...mockProduct,
  id: "2",
  stock: 0,
};

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test product description"),
    ).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText(/SKU:/)).toBeInTheDocument();
  });

  it("displays correct stock status", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("shows out of stock status and disables button", () => {
    render(<ProductCard product={outOfStockProduct} />);

    // Use getAllByText since "Out of Stock" appears in both badge and button
    const outOfStockElements = screen.getAllByText("Out of Stock");
    expect(outOfStockElements.length).toBeGreaterThan(0);

    // Find the button by its aria-label
    const addToCartButton = screen.getByRole("button", {
      name: /is out of stock/i,
    });
    expect(addToCartButton).toBeDisabled();
  });

  it("handles add to cart click", () => {
    const mockOnAddToCart = jest.fn();

    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    // Button has aria-label "Add Test Product to cart"
    const addToCartButton = screen.getByRole("button", {
      name: /Add .* to cart/i,
    });
    fireEvent.click(addToCartButton);

    expect(mockOnAddToCart).toHaveBeenCalledWith("1");
  });

  it("handles details button click", () => {
    const mockOnViewDetails = jest.fn();

    render(
      <ProductCard product={mockProduct} onViewDetails={mockOnViewDetails} />,
    );

    const detailsButton = screen.getByRole("button", {
      name: /View details for/i,
    });
    fireEvent.click(detailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith("1");
  });

  it("shows low stock warning for products with stock <= 5", () => {
    const lowStockProduct = { ...mockProduct, stock: 3 };
    render(<ProductCard product={lowStockProduct} />);

    expect(screen.getByText("Low Stock")).toBeInTheDocument();
  });
});
