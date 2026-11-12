"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  FolderKanban,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import {
  useGetAdminSectionProductsQuery,
  type AdminIndustryType,
  type AdminNetworkType,
  type AdminProductItem,
  type AdminProductSection,
  type GetAdminSectionProductsParams,
  type GetAdminSectionProductsResponse,
} from "@/feature/slice/admin/products";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import CreateNewProductAction from "../psychology/biotechnology/CreateNewProductAction";
import CategoryTabs, { type CategoryTab } from "../psychology/CategoryTabs";
import { extractApiErrorMessage } from "../psychology/productHelpers";
import ProductGrid from "../psychology/ProductGrid";
import AdminProductModals from "./AdminProductModals";
import {
  buildStatusTabs,
  PAGE_META_MAP,
  type StatusFilterValue,
} from "./productPageConfig";
import { useAdminProductActions } from "./useAdminProductActions";

interface NetworkSectionProductsPageProps {
  networkType: AdminNetworkType;
  industryType: AdminIndustryType;
}

interface NetworkSectionProductsLoadedProps {
  networkType: AdminNetworkType;
  industryType: AdminIndustryType;
  sectionId: number;
}

function NetworkSectionProductsLoaded({
  networkType,
  industryType,
  sectionId,
}: NetworkSectionProductsLoadedProps) {
  const searchParams = useSearchParams();
  const pageMeta = PAGE_META_MAP[`${networkType}:${industryType}`];
  const initialCategoryParam = searchParams.get("category") ?? "all";

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>(initialCategoryParam);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

  const resetCursorRef = useRef<(() => void) | null>(null);
  const activeCursorRef = useRef<string | null>(null);

  const actions = useAdminProductActions({
    onMutationSuccess: () => {
      // If admin modified data after scrolling beyond page 1, reset cursor to refresh cleanly from the top.
      if (activeCursorRef.current) {
        resetCursorRef.current?.();
      }
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const activeCategoryNumericId = useMemo(() => {
    if (selectedCategoryId === "all") return undefined;
    const parsed = Number(selectedCategoryId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  }, [selectedCategoryId]);

  const queryParams: GetAdminSectionProductsParams = useMemo(
    () => ({
      network_type: networkType,
      industry_type: industryType,
      section_id: sectionId,
      ...(activeCategoryNumericId
        ? { category_id: activeCategoryNumericId }
        : {}),
      status: statusFilter,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      flat: true,
      per_page: 12,
    }),
    [
      activeCategoryNumericId,
      debouncedSearch,
      industryType,
      networkType,
      sectionId,
      statusFilter,
    ],
  );

  const {
    items: products,
    data,
    cursor,
    hasMore,
    isLoading,
    isFetching,
    isInitialLoading,
    isFetchingMore,
    isError,
    error,
    refetch,
    loadMore,
    reset,
    observerRef,
  } = useCursorQuery<AdminProductItem>(
    useGetAdminSectionProductsQuery,
    queryParams,
    {
      getItemId: (item) => item.id,
    },
  );

  useEffect(() => {
    activeCursorRef.current = cursor;
    resetCursorRef.current = reset;
  }, [cursor, reset]);

  const response = data as GetAdminSectionProductsResponse | undefined;
  const sectionMeta = response?.section ?? null;
  const totalMatching = response?.pagination?.total ?? products.length;
  const summary = response?.summary ?? {
    total_products: 0,
    active_products: 0,
    inactive_products: 0,
    draft_products: 0,
    rejected_products: 0,
  };

  const activeCategoryTabId = useMemo(() => {
    if (selectedCategoryId === "all") return "all";
    if (!sectionMeta) return selectedCategoryId;
    const exists = sectionMeta.categories.some(
      (cat) => String(cat.id) === selectedCategoryId,
    );
    return exists ? selectedCategoryId : "all";
  }, [sectionMeta, selectedCategoryId]);

  const categoryTabs: CategoryTab[] = useMemo(() => {
    if (!sectionMeta) return [];

    return [
      {
        id: "all",
        label: "All Items",
        count: sectionMeta.total_products ?? totalMatching,
      },
      ...sectionMeta.categories.map((cat) => ({
        id: String(cat.id),
        label: cat.category_name,
        ...(typeof cat.products_count === "number"
          ? { count: cat.products_count }
          : {}),
      })),
    ];
  }, [sectionMeta, totalMatching]);

  const modalSections: AdminProductSection[] = useMemo(() => {
    if (!sectionMeta) return [];
    return [
      {
        id: sectionMeta.id,
        name: sectionMeta.name,
        network_type: sectionMeta.network_type,
        industry_type: sectionMeta.industry_type,
        total_products: sectionMeta.total_products ?? totalMatching,
        has_more: hasMore,
        categories: sectionMeta.categories.map((cat) => ({
          id: cat.id,
          category_name: cat.category_name,
          products_count: cat.products_count ?? 0,
        })),
        products,
      },
    ];
  }, [hasMore, products, sectionMeta, totalMatching]);

  const statusTabs = buildStatusTabs(summary);

  return (
    <div className="space-y-6 pb-8">
      {/* Header + Back Link + Search + Add */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E9EAEC] bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href={pageMeta.baseHref}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#04A1B7] transition-colors hover:text-[#038A9D]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to {pageMeta.title}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#1D1F2C] sm:text-2xl">
                {sectionMeta?.name ?? "Section Products"}
              </h1>
              {sectionMeta && (
                <span className="rounded-full border border-[#E5E7EB] bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-[#4A4C56]">
                  {totalMatching}{" "}
                  {totalMatching === 1 ? "product" : "products"}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-[#777980]">
              Browse, filter, inspect, and manage all products inside this section.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, company, or tags..."
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pr-8 pl-9 text-sm text-[#1D1F2C] outline-none placeholder:text-gray-400 focus:border-[#04A1B7] focus:ring-2 focus:ring-[#04A1B7]/15"
              />
              {searchInput && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchInput("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <CreateNewProductAction
              onClick={() =>
                actions.handleOpenCreateModal(
                  modalSections.length > 0,
                  sectionId,
                  activeCategoryNumericId,
                )
              }
            />
          </div>
        </div>

        {/* Status Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 p-1">
            {statusTabs.map((tab) => {
              const isSelected = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                    isSelected
                      ? "bg-[#111827] text-white shadow-xs"
                      : "text-[#4A4C56] hover:bg-white hover:text-[#1D1F2C]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-200/80 text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            {isFetching && !isLoading && !isFetchingMore && (
              <span className="inline-flex items-center gap-1.5 text-[#04A1B7]">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Refreshing...</span>
              </span>
            )}

            <Link
              href={pageMeta.categoriesHref}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#4A4C56] transition-colors hover:border-[#04A1B7] hover:text-[#04A1B7]"
            >
              <FolderKanban className="h-3.5 w-3.5" />
              <span>Manage Sections & Categories</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isInitialLoading && (
        <div className="rounded-2xl border border-[#E9EAEC] bg-white p-6">
          <div className="mb-5 h-10 w-96 animate-pulse rounded-xl bg-gray-100" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div
                key={card}
                className="h-80 animate-pulse rounded-2xl border border-gray-100 bg-gray-100/80"
              />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isInitialLoading && isError && products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-12 text-center">
          <AlertCircle className="mb-3 h-10 w-10 text-rose-500" />
          <h3 className="text-base font-semibold text-rose-950">
            Could not load section products
          </h3>
          <p className="mt-1 max-w-md text-sm text-rose-700">
            {extractApiErrorMessage(
              error,
              "An unexpected error occurred while loading this section.",
            )}
          </p>
          <div className="mt-4 flex items-center gap-2.5">
            <Link
              href={pageMeta.baseHref}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-[#4A4C56] hover:bg-gray-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Go Back</span>
            </Link>
            <CustomButton
              variant="primary"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </CustomButton>
          </div>
        </div>
      )}

      {/* Main Content + Cursor Infinite Scroll */}
      {!isInitialLoading && !(isError && products.length === 0) && (
        <div className="rounded-2xl border border-[#E9EAEC] bg-white p-5 shadow-2xs sm:p-6">
          {categoryTabs.length > 1 && (
            <CategoryTabs
              tabs={categoryTabs}
              activeTabId={activeCategoryTabId}
              onTabChange={setSelectedCategoryId}
            />
          )}

          <ProductGrid
            products={products}
            updatingProductId={actions.updatingStatusId}
            emptyMessage={
              debouncedSearch
                ? `No products matching "${debouncedSearch}" in this section.`
                : "No products available in this category yet."
            }
            onView={(prod) => actions.setViewingProduct(prod)}
            onEdit={(prod) => actions.handleOpenEditModal(prod)}
            onToggleStatus={actions.handleToggleStatus}
            onReject={(prod) => actions.setRejectingProduct(prod)}
            onRemove={(prod) => actions.setDeletingProduct(prod)}
          />

          {(isFetchingMore || hasMore) && (
            <div className="mt-6 flex flex-col items-center justify-center gap-2">
              {isFetchingMore ? (
                <div className="inline-flex items-center gap-2 py-2 text-sm text-[#78797E]">
                  <RefreshCw className="h-4 w-4 animate-spin text-[#04A1B7]" />
                  <span>Loading more products...</span>
                </div>
              ) : (
                <CustomButton variant="outline" size="sm" onClick={loadMore}>
                  Load More Products
                </CustomButton>
              )}
            </div>
          )}

          <div ref={observerRef} className="h-1" />
        </div>
      )}

      <AdminProductModals
        networkType={networkType}
        industryType={industryType}
        sections={modalSections}
        actions={actions}
      />
    </div>
  );
}

function NetworkSectionProductsContent({
  networkType,
  industryType,
}: NetworkSectionProductsPageProps) {
  const params = useParams();
  const pageMeta = PAGE_META_MAP[`${networkType}:${industryType}`];

  const rawSectionId = Array.isArray(params?.sectionId)
    ? params.sectionId[0]
    : params?.sectionId;
  const numericSectionId = Number(rawSectionId);
  const isValidSectionId =
    Number.isInteger(numericSectionId) && numericSectionId > 0;

  if (!isValidSectionId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-14 text-center">
        <AlertCircle className="mb-3 h-10 w-10 text-rose-500" />
        <h2 className="text-base font-semibold text-rose-950">
          Invalid section ID
        </h2>
        <Link
          href={pageMeta.baseHref}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#04A1B7] px-4 py-2 text-sm font-medium text-white hover:bg-[#038A9D]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {pageMeta.title}</span>
        </Link>
      </div>
    );
  }

  return (
    <NetworkSectionProductsLoaded
      networkType={networkType}
      industryType={industryType}
      sectionId={numericSectionId}
    />
  );
}

export default function NetworkSectionProductsPage({
  networkType,
  industryType,
}: NetworkSectionProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-[#E9EAEC] bg-white p-6">
          <div className="mb-4 h-7 w-72 animate-pulse rounded-lg bg-gray-200" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="h-80 animate-pulse rounded-2xl border border-gray-100 bg-gray-100/80"
              />
            ))}
          </div>
        </div>
      }
    >
      <NetworkSectionProductsContent
        networkType={networkType}
        industryType={industryType}
      />
    </Suspense>
  );
}
