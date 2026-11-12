"use client";

import { PackageOpen } from "lucide-react";
import type {
  AdminProductItem,
  AdminProductStatus,
} from "@/feature/slice/admin/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: AdminProductItem[];
  updatingProductId?: number | null;
  emptyMessage?: string;
  onView: (product: AdminProductItem) => void;
  onEdit: (product: AdminProductItem) => void;
  onToggleStatus: (
    product: AdminProductItem,
    nextStatus: AdminProductStatus,
  ) => void;
  onReject?: (product: AdminProductItem) => void;
  onRemove: (product: AdminProductItem) => void;
}

export default function ProductGrid({
  products,
  updatingProductId = null,
  emptyMessage = "No products found in this category.",
  onView,
  onEdit,
  onToggleStatus,
  onReject,
  onRemove,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-10 text-center">
        <PackageOpen className="mb-2 h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isUpdatingStatus={updatingProductId === product.id}
          onView={onView}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onReject={onReject}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
