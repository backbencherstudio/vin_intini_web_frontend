"use client";

import { useMemo, useState } from "react";
import type {
  AdminIndustryType,
  AdminNetworkType,
  AdminProductItem,
  AdminProductSection,
  AdminProductStatus,
} from "@/feature/slice/admin/products";
import CategoryTabs, { type CategoryTab } from "./CategoryTabs";
import ProductGrid from "./ProductGrid";
import SectionHeader from "./SectionHeader";

const PREVIEW_LIMIT = 3;

interface ProductCatalogSectionProps {
  section: AdminProductSection;
  networkType: AdminNetworkType;
  industryType: AdminIndustryType;
  searchQuery: string;
  updatingProductId?: number | null;
  onAddToSection: (sectionId: number, categoryId?: number) => void;
  onViewProduct: (product: AdminProductItem) => void;
  onEditProduct: (product: AdminProductItem) => void;
  onToggleStatus: (
    product: AdminProductItem,
    nextStatus: AdminProductStatus,
  ) => void;
  onRejectProduct?: (product: AdminProductItem) => void;
  onRemoveProduct: (product: AdminProductItem) => void;
}

export default function ProductCatalogSection({
  section,
  networkType,
  industryType,
  searchQuery,
  updatingProductId = null,
  onAddToSection,
  onViewProduct,
  onEditProduct,
  onToggleStatus,
  onRejectProduct,
  onRemoveProduct,
}: ProductCatalogSectionProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  const activeCategoryId = useMemo(() => {
    if (selectedCategoryId === "all") return "all";
    const exists = section.categories.some(
      (cat) => String(cat.id) === selectedCategoryId,
    );
    return exists ? selectedCategoryId : "all";
  }, [section.categories, selectedCategoryId]);

  const tabs: CategoryTab[] = useMemo(
    () => [
      {
        id: "all",
        label: "All Items",
        count: section.total_products,
      },
      ...section.categories.map((cat) => ({
        id: String(cat.id),
        label: cat.category_name,
        count: cat.products_count,
      })),
    ],
    [section.categories, section.total_products],
  );

  const filteredProducts = useMemo(() => {
    if (activeCategoryId === "all") {
      return section.products;
    }
    return section.products.filter(
      (product) => String(product.category_id) === activeCategoryId,
    );
  }, [activeCategoryId, section.products]);

  const visibleProducts = filteredProducts.slice(0, PREVIEW_LIMIT);

  const preselectedCategoryNumericId =
    activeCategoryId !== "all" ? Number(activeCategoryId) : undefined;

  const seeMoreHref =
    activeCategoryId !== "all"
      ? `/dashboard/${networkType}/${industryType}/${section.id}?category=${activeCategoryId}`
      : `/dashboard/${networkType}/${industryType}/${section.id}`;

  return (
    <section className="rounded-2xl border border-[#E9EAEC] bg-white p-5 shadow-2xs sm:p-6">
      <SectionHeader
        title={section.name}
        totalCount={section.total_products}
        seeMoreHref={seeMoreHref}
        onAddToSection={() =>
          onAddToSection(section.id, preselectedCategoryNumericId)
        }
      />

      {tabs.length > 1 && (
        <CategoryTabs
          tabs={tabs}
          activeTabId={activeCategoryId}
          onTabChange={setSelectedCategoryId}
        />
      )}

      <ProductGrid
        products={visibleProducts}
        updatingProductId={updatingProductId}
        emptyMessage={
          searchQuery.trim()
            ? `No products matching "${searchQuery.trim()}" in this section.`
            : "No products available in this category yet."
        }
        onView={onViewProduct}
        onEdit={onEditProduct}
        onToggleStatus={onToggleStatus}
        onReject={onRejectProduct}
        onRemove={onRemoveProduct}
      />
    </section>
  );
}
