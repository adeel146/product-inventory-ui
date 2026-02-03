"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { createProduct } from "@/lib/api";
import type { CreateProductRequest, ProductCategory } from "@/types/product";

const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  category: z.string().min(1, "Please select a category"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0.01, "Price must be at least $0.01")
    .max(999999, "Price cannot exceed $999,999"),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(20, "SKU must be 20 characters or less")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "SKU can only contain letters, numbers, and hyphens",
    ),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories: ProductCategory[] = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Beauty",
  "Automotive",
];

export default function ProductsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setFocus,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: undefined,
      stock: undefined,
      sku: "",
      imageUrl: "",
    },
  });

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (submitStatus.type === "success") {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus.type]);

  // Focus first field with error on submit failure
  useEffect(() => {
    const fieldOrder: (keyof ProductFormData)[] = [
      "name",
      "description",
      "category",
      "price",
      "stock",
      "sku",
      "imageUrl",
    ];

    const firstError = fieldOrder.find((field) => errors[field]);
    if (firstError) {
      setFocus(firstError);
    }
  }, [errors, setFocus]);

  const onSubmit = useCallback(
    async (data: ProductFormData) => {
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: "" });

      try {
        const productData: CreateProductRequest = {
          name: data.name.trim(),
          description: data.description.trim(),
          category: data.category,
          price: data.price,
          stock: data.stock,
          sku: data.sku.trim().toUpperCase(),
          imageUrl: data.imageUrl?.trim() || undefined,
        };

        const response = await createProduct(productData);

        if (response.success) {
          setSubmitStatus({
            type: "success",
            message: `Product "${productData.name}" has been created successfully!`,
          });
          reset();
        }
      } catch (error) {
        // Provide user-friendly error messages
        let errorMessage = "Unable to create product. Please try again.";

        if (error instanceof Error) {
          // Map API errors to user-friendly messages
          if (error.message.includes("name")) {
            errorMessage =
              "Product name is invalid. Please check and try again.";
          } else if (error.message.includes("SKU")) {
            errorMessage = "SKU is invalid or already exists.";
          } else if (error.message.includes("price")) {
            errorMessage = "Price is invalid. Please enter a valid amount.";
          } else if (
            error.message.includes("network") ||
            error.message.includes("fetch")
          ) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else {
            errorMessage = error.message;
          }
        }

        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [reset],
  );

  const handleReset = useCallback(() => {
    reset();
    setSubmitStatus({ type: null, message: "" });
  }, [reset]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Product
        </h2>

        {/* Status Message with accessibility */}
        {submitStatus.type && (
          <div
            role="alert"
            aria-live="polite"
            className={`mb-4 p-4 rounded-md text-sm flex items-start ${
              submitStatus.type === "error"
                ? "bg-error-100 text-error-700 border border-error-200"
                : "bg-success-100 text-success-700 border border-success-200"
            }`}
          >
            <span className="mr-2" aria-hidden="true">
              {submitStatus.type === "success" ? "✓" : "⚠"}
            </span>
            <span>{submitStatus.message}</span>
            <button
              type="button"
              onClick={() => setSubmitStatus({ type: null, message: "" })}
              className="ml-auto text-current opacity-70 hover:opacity-100"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          aria-label="Add new product form"
        >
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name <span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? "border-error-500" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-error-600"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.description ? "border-error-500" : "border-gray-300"
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p
                id="description-error"
                className="mt-1 text-sm text-error-600"
                role="alert"
              >
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category and SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <select
                id="category"
                {...register("category")}
                aria-invalid={errors.category ? "true" : "false"}
                aria-describedby={
                  errors.category ? "category-error" : undefined
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.category ? "border-error-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p
                  id="category-error"
                  className="mt-1 text-sm text-error-600"
                  role="alert"
                >
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                SKU <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                type="text"
                id="sku"
                {...register("sku")}
                aria-invalid={errors.sku ? "true" : "false"}
                aria-describedby={errors.sku ? "sku-error" : "sku-hint"}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.sku ? "border-error-500" : "border-gray-300"
                }`}
                placeholder="e.g., PROD-001"
              />
              {errors.sku ? (
                <p
                  id="sku-error"
                  className="mt-1 text-sm text-error-600"
                  role="alert"
                >
                  {errors.sku.message}
                </p>
              ) : (
                <p id="sku-hint" className="mt-1 text-xs text-gray-500">
                  Letters, numbers, and hyphens only
                </p>
              )}
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price ($) <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0.01"
                max="999999"
                {...register("price", { valueAsNumber: true })}
                aria-invalid={errors.price ? "true" : "false"}
                aria-describedby={errors.price ? "price-error" : undefined}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.price ? "border-error-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p
                  id="price-error"
                  className="mt-1 text-sm text-error-600"
                  role="alert"
                >
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock Quantity <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                step="1"
                {...register("stock", { valueAsNumber: true })}
                aria-invalid={errors.stock ? "true" : "false"}
                aria-describedby={errors.stock ? "stock-error" : undefined}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.stock ? "border-error-500" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p
                  id="stock-error"
                  className="mt-1 text-sm text-error-600"
                  role="alert"
                >
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              {...register("imageUrl")}
              aria-invalid={errors.imageUrl ? "true" : "false"}
              aria-describedby={
                errors.imageUrl ? "imageUrl-error" : "imageUrl-hint"
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.imageUrl ? "border-error-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl ? (
              <p
                id="imageUrl-error"
                className="mt-1 text-sm text-error-600"
                role="alert"
              >
                {errors.imageUrl.message}
              </p>
            ) : (
              <p id="imageUrl-hint" className="mt-1 text-xs text-gray-500">
                Enter a valid image URL (HTTPS recommended)
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting || (!isDirty && !submitStatus.type)}
              aria-label="Reset form to default values"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              aria-label={
                isSubmitting ? "Creating product..." : "Create product"
              }
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
