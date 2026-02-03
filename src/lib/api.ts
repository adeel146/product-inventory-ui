import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  FilterOptions,
} from "@/types/product";
import type { ApiResponse } from "@/types/api";
import { mockProducts } from "@/data/mockProducts";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Optimized: Single-pass filtering with proper validation
export async function getProducts(filters?: FilterOptions): Promise<Product[]> {
  await delay(800); // Simulate API delay

  let products = [...mockProducts];

  if (filters) {
    // Single-pass filtering for better performance
    products = products.filter((product) => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Price range filters with proper null checks
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }

      // Stock filter - fixed logic
      if (filters.inStock !== undefined) {
        const isInStock = product.stock > 0;
        if (filters.inStock !== isInStock) {
          return false;
        }
      }

      return true;
    });
  }

  return products;
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay(300);

  const product = mockProducts.find((p) => p.id === id);
  return product || null;
}

// Create product with comprehensive validation
export async function createProduct(
  data: CreateProductRequest,
): Promise<ApiResponse<Product>> {
  await delay(500);

  // Validate required fields
  if (!data.name?.trim()) {
    throw new Error("Product name is required");
  }

  if (!data.category?.trim()) {
    throw new Error("Category is required");
  }

  if (!data.sku?.trim()) {
    throw new Error("SKU is required");
  }

  // Validate price with bounds checking
  if (typeof data.price !== "number" || isNaN(data.price)) {
    throw new Error("Price must be a valid number");
  }

  if (data.price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (data.price > 999999) {
    throw new Error("Price exceeds maximum allowed value");
  }

  // Validate stock
  if (typeof data.stock !== "number" || isNaN(data.stock) || data.stock < 0) {
    throw new Error("Stock must be a non-negative number");
  }

  const newProduct: Product = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    ...data,
    name: data.name.trim(),
    description: data.description?.trim() || "",
    category: data.category.trim(),
    sku: data.sku.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // In a real app, this would persist to a database
  mockProducts.push(newProduct);

  return {
    success: true,
    data: newProduct,
    message: "Product created successfully",
  };
}

export async function updateProduct(
  data: UpdateProductRequest,
): Promise<ApiResponse<Product>> {
  await delay(400);

  const index = mockProducts.findIndex((p) => p.id === data.id);

  if (index === -1) {
    throw new Error("Product not found");
  }

  const existing = mockProducts[index];
  const updates: Partial<Product> = {};

  // Validate and normalize string fields if provided
  if (typeof data.name === "string") {
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      throw new Error("Product name cannot be empty");
    }
    updates.name = trimmedName;
  }

  if (typeof data.category === "string") {
    const trimmedCategory = data.category.trim();
    if (!trimmedCategory) {
      throw new Error("Category cannot be empty");
    }
    updates.category = trimmedCategory;
  }

  if (typeof data.sku === "string") {
    const trimmedSku = data.sku.trim();
    if (!trimmedSku) {
      throw new Error("SKU cannot be empty");
    }
    updates.sku = trimmedSku;
  }

  if (typeof data.description === "string") {
    updates.description = data.description.trim();
  }

  // Validate numeric fields if provided
  if (data.price !== undefined) {
    if (typeof data.price !== "number" || isNaN(data.price)) {
      throw new Error("Price must be a valid number");
    }
    if (data.price < 0) {
      throw new Error("Price cannot be negative");
    }
    if (data.price > 999999) {
      throw new Error("Price exceeds maximum allowed value");
    }
    updates.price = data.price;
  }

  if (data.stock !== undefined) {
    if (typeof data.stock !== "number" || isNaN(data.stock) || data.stock < 0) {
      throw new Error("Stock must be a non-negative number");
    }
    updates.stock = data.stock;
  }

  // Merge validated updates; avoid blindly spreading all of `data`
  const updatedProduct: Product = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockProducts[index] = updatedProduct;

  return {
    success: true,
    data: updatedProduct,
    message: "Product updated successfully",
  };
}

export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  await delay(300);

  const index = mockProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Product not found");
  }

  mockProducts.splice(index, 1);

  return {
    success: true,
    data: undefined,
    message: "Product deleted successfully",
  };
}
