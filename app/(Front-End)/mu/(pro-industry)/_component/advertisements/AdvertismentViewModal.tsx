"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useGetAdvertisemetDetailsQuery,
  useGetAdvertisemetEditeQuery,
} from "@/feature/slice/jobs/advertisementSlice";
import { useLikebyIndustryProductMutation } from "@/feature/slice/jobs/industrySlice";
import dayjs from "dayjs";
import {
  Building2,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Hash,
  Layers,
  Mail,
  Phone,
  Sparkles,
  Tag,
  ThumbsUp,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface AdvertismentViewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  adId?: string | number | null;
  is_owner?: boolean;
  isLiked?: boolean;
  likesCount?: number;
  isLiking?: boolean;
  onToggleLike?: () => void;
  onViewsUpdated?: (viewsCount: number) => void;
}

const formatLabel = (value?: string | null) =>
  value ? value.replace(/[-_]+/g, " ") : "N/A";

const toExternalUrl = (url: string) =>
  url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;

export default function AdvertismentViewModal({
  open,
  setOpen,
  adId,
  is_owner,
  isLiked: controlledIsLiked,
  likesCount: controlledLikesCount,
  isLiking: controlledIsLiking,
  onToggleLike,
  onViewsUpdated,
}: AdvertismentViewModalProps) {
  const modalInstanceKey = `${adId ?? ""}:${open ? "open" : "closed"}`;
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [likeOverride, setLikeOverride] = useState<{
    adId: string | number | null | undefined;
    isLiked: boolean;
    likesCount: number;
  } | null>(null);
  const [isLocalLiking, setIsLocalLiking] = useState(false);
  const [likebyIndustryProduct] = useLikebyIndustryProductMutation();
  const wasOpenRef = useRef(false);
  const onViewsUpdatedRef = useRef(onViewsUpdated);

  useEffect(() => {
    onViewsUpdatedRef.current = onViewsUpdated;
  }, [onViewsUpdated]);

  const isDescriptionExpanded = expandedKey === modalInstanceKey;
  const copiedId = copiedKey === modalInstanceKey;

  const detailsQuery = useGetAdvertisemetDetailsQuery(adId ?? "", {
    skip: Boolean(is_owner || !adId || !open),
    refetchOnMountOrArgChange: true,
  });
  const editQuery = useGetAdvertisemetEditeQuery(adId ?? "", {
    skip: Boolean(!is_owner || !adId || !open),
  });
  const { data: response, isLoading } = is_owner ? editQuery : detailsQuery;

  const ad = response?.data || response;
  const { refetch: refetchDetails, isUninitialized: isDetailsUninitialized, isFetching: isDetailsFetching } = detailsQuery;

  // Ensure re-opening the modal calls /details again so views respect backend cooldowns
  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;
    wasOpenRef.current = open;
    if (justOpened && !is_owner && adId && !isDetailsUninitialized && !isDetailsFetching) {
      refetchDetails();
    }
  }, [open, is_owner, adId, isDetailsUninitialized, isDetailsFetching, refetchDetails]);

  useEffect(() => {
    if (!is_owner && open && typeof ad?.views_count === "number") {
      onViewsUpdatedRef.current?.(ad.views_count);
    }
  }, [is_owner, open, ad?.id, ad?.views_count]);
  const imageSrc = ad?.image_url;
  const productCode = ad?.product_id ? String(ad.product_id) : null;
  const publisherName =
    ad?.industry?.name || ad?.creator?.name || "Verified Industry Partner";
  const sectionName = ad?.section_name || ad?.section?.name;
  const categoryName = ad?.category_name || ad?.category?.name;
  const pocName = ad?.poc_name || ad?.contact_name || ad?.creator?.name;
  const pocEmail = ad?.poc_email || ad?.contact_email;
  const pocPhone = ad?.poc_phone || ad?.contact_phone;

  const plainDescription = String(ad?.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const isLongDescription = plainDescription.length > 220;

  const hasLocalLikeOverride = likeOverride && likeOverride.adId === (ad?.id ?? adId);
  const resolvedIsLiked =
    typeof controlledIsLiked === "boolean"
      ? controlledIsLiked
      : hasLocalLikeOverride
        ? likeOverride.isLiked
        : Boolean(ad?.is_liked);
  const resolvedLikesCount =
    typeof controlledLikesCount === "number"
      ? controlledLikesCount
      : hasLocalLikeOverride
        ? likeOverride.likesCount
        : Number(ad?.likes_count ?? 0);
  const resolvedIsLiking =
    typeof controlledIsLiking === "boolean" ? controlledIsLiking : isLocalLiking;

  const handleModalLike = async () => {
    if (onToggleLike) {
      onToggleLike();
      return;
    }

    const targetId = ad?.id ?? adId;
    if (!targetId || isLocalLiking) return;

    const prevLiked = resolvedIsLiked;
    const prevCount = resolvedLikesCount;
    const nextLiked = !prevLiked;

    setLikeOverride({
      adId: targetId,
      isLiked: nextLiked,
      likesCount: nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1),
    });
    setIsLocalLiking(true);

    try {
      const res = await likebyIndustryProduct(targetId).unwrap();
      const payload = res?.data || res;
      if (payload) {
        setLikeOverride({
          adId: targetId,
          isLiked: Boolean(payload.is_liked),
          likesCount: Number(payload.likes_count ?? prevCount),
        });
        if (typeof payload.views_count === "number") {
          onViewsUpdated?.(payload.views_count);
        }
      }
    } catch {
      setLikeOverride({
        adId: targetId,
        isLiked: prevLiked,
        likesCount: prevCount,
      });
    } finally {
      setIsLocalLiking(false);
    }
  };

  const handleCopyProductId = async () => {
    if (!productCode || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(productCode);
      setCopiedKey(modalInstanceKey);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === modalInstanceKey ? null : prev));
      }, 1800);
    } catch {
      // Clipboard write may be unavailable in restricted contexts
    }
  };

  const statusBadgeClass =
    ad?.status === "rejected"
      ? "border-red-200 bg-red-50 text-red-700"
      : ad?.status === "inactive"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-lightGreenColor2/30 bg-lightGreenColor2/10 text-lightGreenColor2";

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-2xl overflow-hidden p-0 max-h-[92vh]"
      ariaLabel={is_owner ? "View Product Advertisement" : "Product Overview"}
      ariaDescription="Detailed view of product"
    >
      <div className="flex max-h-[90vh] flex-col overflow-hidden bg-white">
        {/* Header */}
        <div
          className={`sticky top-0 z-10 shrink-0 border-b flex justify-between items-center gap-3 px-5 py-4 md:px-7 ${
            is_owner
              ? "border-borderColor/60 bg-white"
              : "border-slate-200/80 bg-linear-to-r from-[#F4FBFB] via-white to-[#F7FAFC]"
          }`}
        >
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <h2 className="text-lg md:text-xl font-bold text-headerColor">
              {is_owner ? "View Product" : "Product Details"}
            </h2>
            {!isLoading && productCode && (
              <button
                type="button"
                onClick={handleCopyProductId}
                title="Copy Product ID"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#04A1B7]/25 bg-[#04A1B7]/8 px-2.5 py-1 text-xs font-semibold text-[#038598] transition-colors hover:bg-[#04A1B7]/15"
              >
                <Hash className="h-3.5 w-3.5" />
                <span>ID: {productCode}</span>
                {copiedId ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3 opacity-70" />
                )}
              </button>
            )}
          </div>

          <ButtonReuseable
            type="button"
            onClick={() => setOpen(false)}
            icon={<X size={20} />}
            className="w-9 h-9 p-0! rounded-full bg-slate-100/80! text-descriptionColor! shadow-none! hover:bg-slate-200/80! transition-colors shrink-0"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-7 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <span className="inline-block w-8 h-8 border-3 border-primaryColor border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-descriptionColor">
                Loading product details...
              </p>
            </div>
          ) : ad ? (
            <div className="space-y-6">
              {/* Hero Showcase Section */}
              <div
                className={
                  is_owner
                    ? "grid gap-4 sm:grid-cols-[250px_minmax(0,1fr)]"
                    : "grid gap-5 rounded-2xl border border-slate-200/80 bg-linear-to-br from-[#F8FCFD] via-white to-[#F4F7FA] p-4 md:grid-cols-[270px_minmax(0,1fr)] md:p-6 shadow-2xs"
                }
              >
                {/* Product Image */}
                <div
                  className={`relative aspect-square sm:aspect-auto sm:min-h-[250px] md:min-h-[270px] w-full overflow-hidden rounded-2xl flex items-center justify-center ${
                    is_owner
                      ? "border border-borderColor/60 bg-white p-3 shadow-2xs"
                      : "border border-slate-200/70 bg-white p-4 shadow-xs"
                  }`}
                >
                  {!is_owner && (ad.is_boosted || ad.is_new_release) && (
                    <span
                      className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs ${
                        ad.is_new_release
                          ? "bg-linear-to-r from-amber-400 to-orange-400"
                          : "bg-linear-to-r from-cyan-500 to-blue-500"
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>
                        {ad.badge ||
                          (ad.is_new_release ? "New Release" : "Sponsored")}
                      </span>
                    </span>
                  )}

                  {imageSrc ? (
                    <div className="relative h-full w-full min-h-[210px]">
                      <Image
                        src={imageSrc}
                        alt={ad.product_name || "Product"}
                        fill
                        unoptimized
                        className="object-contain p-1"
                        sizes="(max-width: 768px) 100vw, 270px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50 text-4xl font-bold text-[#04A1B7]">
                      {(ad.product_name || "P").charAt(0)}
                    </div>
                  )}
                </div>

                {/* Product Summary Info */}
                <div
                  className={
                    is_owner
                      ? "flex min-w-0 flex-col justify-between gap-5 rounded-xl border border-borderColor bg-bgLightColor p-4 md:p-5"
                      : "flex min-w-0 flex-col justify-between gap-4 py-1"
                  }
                >
                  <div className="space-y-3.5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {!is_owner && (
                          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#038598]">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#04A1B7]/10 px-2.5 py-0.5 capitalize">
                              <Building2 className="h-3.5 w-3.5" />
                              {publisherName}
                            </span>
                            {ad.network_type && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600 capitalize">
                                {formatLabel(ad.network_type)}
                              </span>
                            )}
                            {ad.industry_type && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600 capitalize">
                                {formatLabel(ad.industry_type)}
                              </span>
                            )}
                          </div>
                        )}

                        <h3
                          className={`min-w-0 wrap-break-word font-bold leading-snug text-headerColor ${
                            is_owner
                              ? "text-base md:text-lg"
                              : "text-xl md:text-2xl"
                          }`}
                        >
                          {ad.product_name || "Product Name"}
                        </h3>
                      </div>

                      {/* Status badge reserved strictly for owner management view */}
                      {is_owner && (
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusBadgeClass}`}
                        >
                          {ad.status || "Active"}
                        </span>
                      )}
                    </div>

                    {is_owner && ad.status === "rejected" && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-red-950">
                            Rejected by Admin &amp; Hidden from Platform
                          </p>
                          {ad.rejected_at && (
                            <span className="text-[11px] text-red-700">
                              {dayjs(ad.rejected_at).format("DD MMM YYYY")}
                            </span>
                          )}
                        </div>
                        <p className="leading-relaxed">
                          <span className="font-semibold">Reason:</span>{" "}
                          {ad.rejection_reason ||
                            "No rejection reason provided."}
                        </p>
                      </div>
                    )}

                    {/* Owner metadata grid vs Public showcase metadata pills */}
                    {is_owner ? (
                      <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                          {[
                            ["Product ID", productCode || "N/A"],
                            ["Network Type", formatLabel(ad.network_type)],
                            ["Industry Type", formatLabel(ad.industry_type)],
                            ["Section", sectionName || "N/A"],
                            ["Category", categoryName || "N/A"],
                          ].map(([label, value]) => (
                            <div key={label} className="min-w-0">
                              <p className="text-xs text-grayColor1 font-medium">
                                {label}
                              </p>
                              <p className="mt-0.5 truncate text-xs md:text-sm font-semibold text-headerColor">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-grayColor1 pt-1">
                          Published:{" "}
                          <span className="font-medium text-descriptionColor">
                            {ad.created_at
                              ? dayjs(ad.created_at).format(
                                  "DD MMM YYYY, hh:mm A",
                                )
                              : "N/A"}
                          </span>
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {sectionName && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs text-slate-700">
                            <Layers className="h-3.5 w-3.5 text-[#04A1B7]" />
                            <span className="text-slate-400">Section:</span>
                            <span className="font-semibold text-slate-800">
                              {sectionName}
                            </span>
                          </div>
                        )}
                        {categoryName && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs text-slate-700">
                            <Tag className="h-3.5 w-3.5 text-[#04A1B7]" />
                            <span className="text-slate-400">Category:</span>
                            <span className="font-semibold text-slate-800">
                              {categoryName}
                            </span>
                          </div>
                        )}
                        {ad.created_at && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs text-slate-600">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              Published{" "}
                              {dayjs(ad.created_at).format("DD MMM YYYY")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Engagement & Action Footer */}
                  {is_owner ? (
                    <div className="flex flex-wrap items-center gap-4 border-t border-borderColor/60 pt-3 text-xs md:text-sm text-descriptionColor">
                      <div className="flex items-center gap-1.5">
                        <span className="text-grayColor1">Total Views:</span>
                        <span className="font-semibold text-headerColor">
                          {(ad.views_count ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-grayColor1">Unique Views:</span>
                        <span className="font-semibold text-headerColor">
                          {(ad.unique_views_count ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-grayColor1">Likes:</span>
                        <span className="font-semibold text-headerColor">
                          {(ad.likes_count ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-3.5">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs md:text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700">
                          <Eye className="h-4 w-4 text-[#04A1B7]" />
                          <span>{(ad.views_count ?? 0).toLocaleString()}</span>
                          <span className="text-slate-500">Views</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleModalLike}
                          disabled={resolvedIsLiking}
                          aria-pressed={resolvedIsLiked}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-medium transition-colors disabled:opacity-60 ${
                            resolvedIsLiked
                              ? "border-[#04A1B7] bg-[#04A1B7]/12 text-[#038598]"
                              : "border-slate-200 bg-white text-slate-700 hover:border-[#04A1B7]/50 hover:text-[#038598]"
                          }`}
                        >
                          <ThumbsUp
                            className={`h-4 w-4 ${
                              resolvedIsLiked
                                ? "fill-[#04A1B7] text-[#04A1B7]"
                                : "text-[#04A1B7]"
                            }`}
                          />
                          <span>{resolvedLikesCount.toLocaleString()}</span>
                          <span>{resolvedIsLiked ? "Liked" : "Like"}</span>
                        </button>
                      </div>

                      {ad.product_url && (
                        <a
                          href={toExternalUrl(ad.product_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-[#04A1B7] px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#038CA0]"
                        >
                          <span>Visit Product</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div
                className={
                  is_owner
                    ? "space-y-2 rounded-xl border border-borderColor bg-bgLightColor p-4 md:p-5"
                    : "space-y-2.5 rounded-2xl border border-slate-200/80 bg-white p-5"
                }
              >
                <h4 className="text-sm md:text-base font-semibold text-headerColor">
                  About this product
                </h4>
                {ad.description ? (
                  <>
                    <div
                      className={`text-xs md:text-sm text-descriptionColor prose prose-sm max-w-none leading-relaxed ${
                        isLongDescription && !isDescriptionExpanded
                          ? "line-clamp-4 overflow-hidden"
                          : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: ad.description }}
                    />
                    {isLongDescription && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedKey((prev) =>
                            prev === modalInstanceKey ? null : modalInstanceKey,
                          )
                        }
                        className="mt-1 cursor-pointer text-xs md:text-sm font-semibold text-primaryColor hover:underline"
                      >
                        {isDescriptionExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-grayColor1 italic">
                    No description provided.
                  </p>
                )}
              </div>

              {/* Product Link */}
              {(is_owner || ad.product_url) && (
                <div
                  className={
                    is_owner
                      ? "space-y-1 rounded-xl border border-borderColor bg-bgLightColor p-4 md:p-5"
                      : "flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between md:px-5"
                  }
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-headerColor">
                      {is_owner ? "Product Link" : "Official Product Website"}
                    </h4>
                    {ad.product_url ? (
                      <a
                        href={toExternalUrl(ad.product_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primaryColor hover:underline text-xs md:text-sm font-medium break-all block mt-0.5"
                      >
                        {ad.product_url}
                      </a>
                    ) : (
                      <p className="text-xs md:text-sm text-grayColor1 mt-1">
                        N/A
                      </p>
                    )}
                  </div>
                  {!is_owner && ad.product_url && (
                    <a
                      href={toExternalUrl(ad.product_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 self-start sm:self-center rounded-lg border border-[#04A1B7]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#038598] transition-colors hover:bg-[#04A1B7]/8"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Product Tags */}
              {ad?.tags?.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-sm md:text-base font-semibold text-headerColor">
                    {is_owner ? "Product Tags" : "Related Tags"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {ad.tags.map((tag: string, index: number) => (
                      <span
                        key={`${tag}-${index}`}
                        className={
                          is_owner
                            ? "inline-block px-3 py-1 rounded-full border border-borderColor bg-white text-xs md:text-sm text-descriptionColor font-medium"
                            : "inline-flex items-center rounded-full border border-[#04A1B7]/20 bg-[#F2FAFC] px-3 py-1 text-xs md:text-sm font-medium text-[#037D8F]"
                        }
                      >
                        {is_owner ? tag : `# ${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Point of Contact */}
              <div className="space-y-2.5 pt-1">
                <h4 className="text-sm md:text-base font-semibold text-headerColor">
                  Point of Contact
                </h4>
                <div className="grid grid-cols-1 gap-3 text-xs md:text-sm md:grid-cols-3 md:gap-4">
                  <div
                    className={`min-w-0 rounded-xl border p-3.5 ${
                      is_owner
                        ? "border-borderColor bg-bgLightColor"
                        : "border-slate-200/80 bg-white"
                    }`}
                  >
                    <p className="flex items-center gap-1.5 text-xs font-medium text-grayColor1">
                      <User className="h-3.5 w-3.5 text-[#04A1B7]" />
                      <span>Contact Person</span>
                    </p>
                    <p className="mt-1 truncate font-semibold text-headerColor">
                      {pocName || "N/A"}
                    </p>
                  </div>

                  <div
                    className={`min-w-0 rounded-xl border p-3.5 ${
                      is_owner
                        ? "border-borderColor bg-bgLightColor"
                        : "border-slate-200/80 bg-white"
                    }`}
                  >
                    <p className="flex items-center gap-1.5 text-xs font-medium text-grayColor1">
                      <Mail className="h-3.5 w-3.5 text-[#04A1B7]" />
                      <span>Email</span>
                    </p>
                    {!is_owner && pocEmail ? (
                      <a
                        href={`mailto:${pocEmail}`}
                        className="mt-1 block truncate font-semibold text-[#038598] hover:underline"
                      >
                        {pocEmail}
                      </a>
                    ) : (
                      <p className="mt-1 truncate font-semibold text-headerColor">
                        {pocEmail || "N/A"}
                      </p>
                    )}
                  </div>

                  <div
                    className={`min-w-0 rounded-xl border p-3.5 ${
                      is_owner
                        ? "border-borderColor bg-bgLightColor"
                        : "border-slate-200/80 bg-white"
                    }`}
                  >
                    <p className="flex items-center gap-1.5 text-xs font-medium text-grayColor1">
                      <Phone className="h-3.5 w-3.5 text-[#04A1B7]" />
                      <span>Phone Number</span>
                    </p>
                    {!is_owner && pocPhone ? (
                      <a
                        href={`tel:${pocPhone}`}
                        className="mt-1 block truncate font-semibold text-[#038598] hover:underline"
                      >
                        {pocPhone}
                      </a>
                    ) : (
                      <p className="mt-1 truncate font-semibold text-headerColor">
                        {pocPhone || "N/A"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-500">
              No details found for this product.
            </div>
          )}
        </div>
      </div>
    </RootDialog>
  );
}
