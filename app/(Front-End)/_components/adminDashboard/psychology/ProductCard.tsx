"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Eye,
  Heart,
  Package,
  Sparkles,
} from "lucide-react";
import type {
  AdminProductItem,
  AdminProductStatus,
} from "@/feature/slice/admin/products";
import ProductCardActions from "./ProductCardActions";
import {
  PRODUCT_STATUS_BADGE_MAP,
  stripHtmlToText,
} from "./productHelpers";

interface ProductCardProps {
  product: AdminProductItem;
  isUpdatingStatus?: boolean;
  onView: (product: AdminProductItem) => void;
  onEdit: (product: AdminProductItem) => void;
  onToggleStatus: (
    product: AdminProductItem,
    nextStatus: AdminProductStatus,
  ) => void;
  onReject?: (product: AdminProductItem) => void;
  onRemove: (product: AdminProductItem) => void;
}

export default function ProductCard({
  product,
  isUpdatingStatus = false,
  onView,
  onEdit,
  onToggleStatus,
  onReject,
  onRemove,
}: ProductCardProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const imageUrl =
    product.image_url && failedImageUrl !== product.image_url
      ? product.image_url
      : null;

  const statusMeta =
    PRODUCT_STATUS_BADGE_MAP[product.status] ?? PRODUCT_STATUS_BADGE_MAP.active;
  const plainDescription =
    stripHtmlToText(product.short_description) ||
    stripHtmlToText(product.description) ||
    "No description provided.";
  const highlightBadge = product.is_boosted
    ? "Boosted"
    : product.is_new_release
      ? "New Release"
      : product.badge;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-[#E9EAEC] bg-white p-4 shadow-xs transition-all hover:border-[#04A1B7]/45 hover:shadow-md">
      <div>
        {/* Product Image + Overlay Badges + Card Actions */}
        <div className="relative mb-3.5 h-44 w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.product_name}
              fill
              unoptimized
              onError={() => setFailedImageUrl(product.image_url)}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-gray-400">
              <Package className="h-8 w-8 stroke-[1.5]" />
              <span className="text-xs font-medium">No image uploaded</span>
            </div>
          )}

          {/* Top-left Status & Highlight Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-xs ${statusMeta.badgeClass}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`}
              />
              {statusMeta.label}
            </span>

            {highlightBadge && (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-[#E9FAF7]/95 px-2.5 py-0.5 text-[11px] font-semibold text-[#04A1B7]">
                <Sparkles className="h-3 w-3" />
                {highlightBadge}
              </span>
            )}
          </div>

          {/* Top-right Actions Menu */}
          <div className="absolute top-2.5 right-2.5">
            <ProductCardActions
              status={product.status}
              isUpdatingStatus={isUpdatingStatus}
              onView={() => onView(product)}
              onEdit={() => onEdit(product)}
              onToggleStatus={(nextStatus) =>
                onToggleStatus(product, nextStatus)
              }
              onReject={onReject ? () => onReject(product) : undefined}
              onRemove={() => onRemove(product)}
            />
          </div>
        </div>

        {/* Title & Category */}
        <button
          type="button"
          onClick={() => onView(product)}
          className="line-clamp-2 cursor-pointer text-left text-base font-bold leading-snug text-[#1D1F2C] transition-colors hover:text-[#04A1B7]"
        >
          {product.product_name}
        </button>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {product.category_name && (
            <span className="font-medium text-[#04A1B7]">
              {product.category_name}
            </span>
          )}

          {product.industry?.name && (
            <span className="inline-flex items-center gap-1 text-[#4A4C56]">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span className="truncate font-medium">
                {product.industry.name}
              </span>
            </span>
          )}
        </div>

        {/* Plain Text Description Preview */}
        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-[#777980]">
          {plainDescription}
        </p>

        {product.status === "rejected" && product.rejection_reason && (
          <p className="mt-2.5 line-clamp-2 rounded-lg border border-red-200 bg-red-50/80 px-2.5 py-1.5 text-[11px] leading-snug text-red-700">
            <strong className="font-semibold">Rejected:</strong>{" "}
            {product.rejection_reason}
          </p>
        )}
      </div>

      {/* Footer Actions & Metrics */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => onView(product)}
          className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#04A1B7] transition-colors hover:text-[#038A9D]"
        >
          <span>Learn more</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span
            className="inline-flex items-center gap-1"
            title="Total likes"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>{(product.likes_count ?? 0).toLocaleString()}</span>
          </span>

          <span
            className="inline-flex items-center gap-1"
            title="Total views"
          >
            <Eye className="h-3.5 w-3.5 text-[#04A1B7]" />
            <span>{(product.views_count ?? 0).toLocaleString()}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
