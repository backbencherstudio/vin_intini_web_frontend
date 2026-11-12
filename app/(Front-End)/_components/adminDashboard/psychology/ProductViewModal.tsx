"use client";

import Image from "next/image";
import {
  BarChart3,
  Building2,
  Eye,
  Heart,
  Mail,
  MousePointerClick,
  Package,
  Pencil,
  Phone,
  Power,
  PowerOff,
  ShieldBan,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import {
  useGetAdminProductByIdQuery,
  type AdminProductItem,
  type AdminProductStatus,
} from "@/feature/slice/admin/products";
import {
  PRODUCT_STATUS_BADGE_MAP,
  sanitizeProductHtml,
} from "./productHelpers";

interface ProductViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AdminProductItem | null;
  isUpdatingStatus?: boolean;
  onEdit: (product: AdminProductItem) => void;
  onToggleStatus: (
    product: AdminProductItem,
    nextStatus: AdminProductStatus,
  ) => void;
  onReject?: (product: AdminProductItem) => void;
}

export default function ProductViewModal({
  open,
  onOpenChange,
  product,
  isUpdatingStatus = false,
  onEdit,
  onToggleStatus,
  onReject,
}: ProductViewModalProps) {
  const { data: detailResponse, isFetching } = useGetAdminProductByIdQuery(
    product?.id ?? 0,
    {
      skip: !open || !product?.id,
    },
  );

  const activeProduct = detailResponse?.data ?? product;

  if (!activeProduct) {
    return null;
  }

  const statusMeta =
    PRODUCT_STATUS_BADGE_MAP[activeProduct.status] ??
    PRODUCT_STATUS_BADGE_MAP.active;
  const isRejected = activeProduct.status === "rejected";
  const safeDescriptionHtml = sanitizeProductHtml(activeProduct.description);
  const hasPocInfo = Boolean(
    activeProduct.poc_name ||
      activeProduct.poc_email ||
      activeProduct.poc_phone,
  );
  const nextStatus: AdminProductStatus =
    activeProduct.status === "active" ? "inactive" : "active";

  const isBoosted = Boolean(activeProduct.is_boosted);
  const impressionsCount = activeProduct.impressions_count ?? 0;
  const clicksCount = activeProduct.clicks_count ?? 0;
  const computedCtr =
    typeof activeProduct.ctr === "number"
      ? activeProduct.ctr
      : impressionsCount > 0
        ? Number(((clicksCount / impressionsCount) * 100).toFixed(2))
        : 0;
  const ctrDisplay = activeProduct.ctr_formatted ?? `${computedCtr}%`;

  const metricGroups = [
    {
      key: "engagement",
      containerClass: "border-gray-200 bg-gray-50/70",
      labelClass: "text-gray-500",
      items: [
        {
          label: "Total Views",
          value: (activeProduct.views_count ?? 0).toLocaleString(),
          icon: Eye,
          iconClass: "text-[#04A1B7]",
        },
        {
          label: "Unique Views",
          value: (activeProduct.unique_views_count ?? 0).toLocaleString(),
          icon: Users,
          iconClass: "text-indigo-500",
        },
        {
          label: "Likes",
          value: (activeProduct.likes_count ?? 0).toLocaleString(),
          icon: Heart,
          iconClass: "text-rose-500",
        },
      ],
    },
    ...(isBoosted
      ? [
          {
            key: "boost",
            containerClass: "border-cyan-200/80 bg-[#E9FAF7]/65",
            labelClass: "text-[#037889]",
            items: [
              {
                label: "Impressions",
                value: impressionsCount.toLocaleString(),
                icon: BarChart3,
                iconClass: "text-[#04A1B7]",
              },
              {
                label: "Clicks",
                value: clicksCount.toLocaleString(),
                icon: MousePointerClick,
                iconClass: "text-indigo-600",
              },
              {
                label: "CTR",
                value: ctrDisplay,
                icon: TrendingUp,
                iconClass: "text-emerald-600",
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Product Details"
    >
      <div className="space-y-5 p-3">
        {/* Hero Image & Status Summary */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr]">
          <div className="relative h-52 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {activeProduct.image_url ? (
              <Image
                src={activeProduct.image_url}
                alt={activeProduct.product_name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                <Package className="h-9 w-9" />
                <span className="text-xs">No image available</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-3">
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`}
                    />
                    {statusMeta.label}
                  </span>

                  {activeProduct.is_boosted && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-[#E9FAF7] px-2.5 py-0.5 text-xs font-semibold text-[#04A1B7]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Boosted
                      {activeProduct.boost_remaining_text
                        ? ` (${activeProduct.boost_remaining_text})`
                        : ""}
                    </span>
                  )}

                  {activeProduct.is_new_release && (
                    <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                      New Release
                    </span>
                  )}
                </div>

                {activeProduct.product_id && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-[#4A4C56]">
                    <span className="text-gray-500">Product ID:</span>
                    <span className="font-semibold text-[#1D1F2C]">
                      {activeProduct.product_id}
                    </span>
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-[#1D1F2C]">
                {activeProduct.product_name}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#4A4C56]">
                {activeProduct.section_name && (
                  <span>
                    <strong className="text-[#1D1F2C]">Section:</strong>{" "}
                    {activeProduct.section_name}
                  </span>
                )}
                {activeProduct.category_name && (
                  <span>
                    <strong className="text-[#1D1F2C]">Category:</strong>{" "}
                    {activeProduct.category_name}
                  </span>
                )}
              </div>

              {activeProduct.industry && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-medium text-emerald-900">
                  <Building2 className="h-4 w-4 text-emerald-700" />
                  <span>Industry: {activeProduct.industry.name}</span>
                  {activeProduct.creator?.name && (
                    <span className="text-emerald-700">
                      • Submitted by {activeProduct.creator.name}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Engagement Metrics */}
            <div className="space-y-2.5">
              {metricGroups.map((group) => (
                <div
                  key={group.key}
                  className={`grid grid-cols-3 gap-2.5 rounded-xl border p-3 ${group.containerClass}`}
                >
                  {group.items.map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div
                        key={metric.label}
                        className="flex items-center gap-2"
                      >
                        <MetricIcon
                          className={`h-4 w-4 shrink-0 ${metric.iconClass}`}
                        />
                        <div className="min-w-0">
                          <p
                            className={`truncate text-[11px] ${group.labelClass}`}
                          >
                            {metric.label}
                          </p>
                          <p className="text-sm font-bold text-[#1D1F2C]">
                            {metric.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rejection Reason Notice */}
        {isRejected && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-900">
            <ShieldBan className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-red-950">
                  Rejected by Admin &amp; Hidden from Platform
                </p>
                {activeProduct.rejected_at && (
                  <span className="text-[11px] text-red-700">
                    {new Date(activeProduct.rejected_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="leading-relaxed text-red-800">
                {activeProduct.rejection_reason ||
                  "No rejection reason recorded."}
              </p>
            </div>
          </div>
        )}

        {/* Tags */}
        {Array.isArray(activeProduct.tags) && activeProduct.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeProduct.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-[#4A4C56]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Sanitized Full Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#1D1F2C]">Description</h4>
            {isFetching && (
              <span className="text-xs text-gray-400">Refreshing...</span>
            )}
          </div>

          {safeDescriptionHtml ? (
            <div
              className="prose prose-sm max-w-none text-sm leading-relaxed text-[#4A4C56] [&_a]:text-[#04A1B7] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: safeDescriptionHtml }}
            />
          ) : (
            <p className="text-sm text-gray-500">No description available.</p>
          )}
        </div>

        {/* Point of Contact */}
        {hasPocInfo && (
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <h4 className="mb-2.5 text-sm font-semibold text-[#1D1F2C]">
              Point of Contact
            </h4>
            <div className="grid grid-cols-1 gap-2.5 text-xs text-[#4A4C56] sm:grid-cols-3">
              {activeProduct.poc_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{activeProduct.poc_name}</span>
                </div>
              )}
              {activeProduct.poc_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{activeProduct.poc_email}</span>
                </div>
              )}
              {activeProduct.poc_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{activeProduct.poc_phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            {!isRejected && onReject && (
              <CustomButton
                type="button"
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  onOpenChange(false);
                  onReject(activeProduct);
                }}
              >
                <ShieldBan className="h-3.5 w-3.5" />
                <span>Reject Product</span>
              </CustomButton>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CustomButton
              type="button"
              variant="outline"
              size="sm"
              loading={isUpdatingStatus}
              onClick={() => onToggleStatus(activeProduct, nextStatus)}
            >
              {activeProduct.status === "active" ? (
                <>
                  <PowerOff className="h-3.5 w-3.5 text-amber-600" />
                  <span>Set Inactive</span>
                </>
              ) : (
                <>
                  <Power className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isRejected ? "Restore & Activate" : "Activate"}</span>
                </>
              )}
            </CustomButton>

            <CustomButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(activeProduct);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Product</span>
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}

