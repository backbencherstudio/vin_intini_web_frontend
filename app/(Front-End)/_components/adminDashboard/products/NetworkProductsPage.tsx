"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, FolderKanban, RefreshCw, Search, X } from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import {
  useGetAdminProductsQuery,
  type AdminIndustryType,
  type AdminNetworkType,
} from "@/feature/slice/admin/products";
import CreateNewProductAction from "../psychology/biotechnology/CreateNewProductAction";
import ProductCatalogSection from "../psychology/ProductCatalogSection";
import { extractApiErrorMessage } from "../psychology/productHelpers";
import AdminProductModals from "./AdminProductModals";
import {
  buildStatusTabs,
  PAGE_META_MAP,
  type StatusFilterValue,
} from "./productPageConfig";
import { useAdminProductActions } from "./useAdminProductActions";

interface NetworkProductsPageProps {
  networkType: AdminNetworkType;
  industryType: AdminIndustryType;
}

export default function NetworkProductsPage({
  networkType,
  industryType,
}: NetworkProductsPageProps) {
  const pageMeta = PAGE_META_MAP[`${networkType}:${industryType}`];

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

  const actions = useAdminProductActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAdminProductsQuery({
    network_type: networkType,
    industry_type: industryType,
    status: statusFilter,
    search: debouncedSearch || undefined,
    limit_per_section: 50,
  });

  const sections = response?.data?.sections ?? [];
  const summary = response?.data?.summary ?? {
    total_products: 0,
    active_products: 0,
    inactive_products: 0,
    draft_products: 0,
    rejected_products: 0,
  };

  const statusTabs = buildStatusTabs(summary);

  return (
    <div className="space-y-6 pb-8">
      {/* Top Page Header + Actions */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E9EAEC] bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1D1F2C] sm:text-2xl">
              {pageMeta.title}
            </h1>
            <p className="mt-1 text-sm text-[#777980]">{pageMeta.subtitle}</p>
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
              onClick={() => actions.handleOpenCreateModal(sections.length > 0)}
            />
          </div>
        </div>

        {/* Status Filter Strip & Sync Indicator */}
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
            {isFetching && !isLoading && (
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

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2].map((skeletonSection) => (
            <div
              key={skeletonSection}
              className="rounded-2xl border border-[#E9EAEC] bg-white p-6"
            >
              <div className="mb-4 h-7 w-72 animate-pulse rounded-lg bg-gray-200" />
              <div className="mb-5 h-10 w-96 animate-pulse rounded-xl bg-gray-100" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((card) => (
                  <div
                    key={card}
                    className="h-80 animate-pulse rounded-2xl border border-gray-100 bg-gray-100/80"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-12 text-center">
          <AlertCircle className="mb-3 h-10 w-10 text-rose-500" />
          <h3 className="text-base font-semibold text-rose-950">
            Could not load products
          </h3>
          <p className="mt-1 max-w-md text-sm text-rose-700">
            {extractApiErrorMessage(
              error,
              "An unexpected error occurred while loading sections and products.",
            )}
          </p>
          <CustomButton
            variant="primary"
            size="sm"
            onClick={() => refetch()}
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </CustomButton>
        </div>
      )}

      {/* Empty Sections State */}
      {!isLoading && !isError && sections.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <FolderKanban className="mb-3 h-10 w-10 text-gray-400" />
          <h3 className="text-base font-semibold text-[#1D1F2C]">
            No sections configured yet
          </h3>
          <p className="mt-1 max-w-md text-sm text-[#777980]">
            Add sections and categories for this network first, then upload products under a verified industry.
          </p>
          <Link
            href={pageMeta.categoriesHref}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#04A1B7] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#038A9D]"
          >
            <FolderKanban className="h-4 w-4" />
            <span>Go to Categories Setup</span>
          </Link>
        </div>
      )}

      {/* Section-Wise Product Catalog */}
      {!isLoading && !isError && sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section) => (
            <ProductCatalogSection
              key={section.id}
              section={section}
              networkType={networkType}
              industryType={industryType}
              searchQuery={debouncedSearch}
              updatingProductId={actions.updatingStatusId}
              onAddToSection={(secId, catId) =>
                actions.handleOpenCreateModal(true, secId, catId)
              }
              onViewProduct={(prod) => actions.setViewingProduct(prod)}
              onEditProduct={(prod) => actions.handleOpenEditModal(prod)}
              onToggleStatus={actions.handleToggleStatus}
              onRejectProduct={(prod) => actions.setRejectingProduct(prod)}
              onRemoveProduct={(prod) => actions.setDeletingProduct(prod)}
            />
          ))}
        </div>
      )}

      <AdminProductModals
        networkType={networkType}
        industryType={industryType}
        sections={sections}
        actions={actions}
      />
    </div>
  );
}
