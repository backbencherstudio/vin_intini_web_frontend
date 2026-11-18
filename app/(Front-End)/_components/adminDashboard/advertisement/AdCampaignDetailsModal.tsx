"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import {
  AdminAdCampaign,
  useCancelAdCampaignMutation,
  useGetAdCampaignDetailQuery,
  usePauseAdCampaignMutation,
  useResumeAdCampaignMutation,
} from "@/feature/slice/admin/boost/boostApi";
import emptyUserImg from "@/public/empty_user.jpg";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Ban,
  Building2,
  Calendar,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Layers,
  Loader2,
  MapPin,
  MousePointerClick,
  Package,
  Pause,
  Play,
  Rocket,
  TrendingUp,
  User,
} from "lucide-react";

interface AdCampaignDetailsModalProps {
  open: boolean;
  campaignId: number | null;
  initialData?: AdminAdCampaign | null;
  onClose: () => void;
  onOpenInvoice?: (transactionId: number) => void;
}

const formatCurrency = (amount: string | number | undefined, currency = "USD") => {
  const num = Number(amount ?? 0);
  if (!Number.isFinite(num)) return `$0.00`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(num);
  } catch {
    return `$${num.toFixed(2)}`;
  }
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatShortDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusBadgeColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "active" as const;
    case "paused":
      return "yellow" as const;
    case "completed":
      return "blue" as const;
    case "cancelled":
    case "canceled":
      return "suspended" as const;
    default:
      return "gray" as const;
  }
};

export default function AdCampaignDetailsModal({
  open,
  campaignId,
  initialData,
  onClose,
  onOpenInvoice,
}: AdCampaignDetailsModalProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"pause" | "cancel" | null>(
    null,
  );

  const {
    currentData: detailResp,
    isLoading,
    isFetching,
  } = useGetAdCampaignDetailQuery(campaignId ?? 0, {
    skip: !open || !campaignId,
  });

  const [pauseCampaign, { isLoading: isPausing }] = usePauseAdCampaignMutation();
  const [resumeCampaign, { isLoading: isResuming }] = useResumeAdCampaignMutation();
  const [cancelCampaign, { isLoading: isCancelling }] = useCancelAdCampaignMutation();

  const matchedDetail =
    detailResp?.data && detailResp.data.id === campaignId ? detailResp.data : null;
  const matchedInitial =
    initialData && initialData.id === campaignId ? initialData : null;
  const campaign: AdminAdCampaign | null = matchedDetail ?? matchedInitial ?? null;

  const isActionBusy = isPausing || isResuming || isCancelling;

  const markImageFailed = (url?: string | null) => {
    if (!url) return;
    setFailedImages((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  };

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const handlePause = async () => {
    if (!campaign) return;
    try {
      const res = await pauseCampaign(campaign.id).unwrap();
      toast.success(res.message || "Campaign paused");
      setConfirmAction(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to pause campaign");
    }
  };

  const handleResume = async () => {
    if (!campaign) return;
    try {
      const res = await resumeCampaign(campaign.id).unwrap();
      toast.success(res.message || "Campaign resumed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resume campaign");
    }
  };

  const handleCancel = async () => {
    if (!campaign) return;
    try {
      const res = await cancelCampaign(campaign.id).unwrap();
      toast.success(res.message || "Campaign cancelled");
      setConfirmAction(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel campaign");
    }
  };

  const statusVal = campaign?.status?.toLowerCase() || "";
  const canPause = statusVal === "active";
  const canResume = statusVal === "paused";
  const canCancel =
    statusVal === "active" || statusVal === "paused" || statusVal === "pending";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setConfirmAction(null);
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0 bg-white">
        <div className="h-1.5 w-full bg-linear-to-r from-[#04A1B7] via-[#13B8B2] to-[#22CAAD] shrink-0" />

        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-slate-50/70 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pr-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span>Campaign #{campaign?.id ?? campaignId}</span>
                    {isFetching && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#04A1B7]" />
                    )}
                  </DialogTitle>
                  {campaign && (
                    <CustomBadge color={statusBadgeColor(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </CustomBadge>
                  )}
                </div>
                <DialogDescription className="text-xs text-gray-500 mt-0.5">
                  {campaign
                    ? `${campaign.package_name} • ${campaign.duration_days} days • ${formatCurrency(campaign.amount_paid, campaign.currency)}`
                    : "Loading campaign details..."}
                </DialogDescription>
              </div>
            </div>

            {campaign?.transaction_id && onOpenInvoice && (
              <button
                type="button"
                onClick={() => onOpenInvoice(campaign.transaction_id!)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#04A1B7] hover:text-[#04A1B7] transition-colors cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                {campaign.invoice_number || "View Invoice"}
              </button>
            )}
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          {isLoading && !campaign ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#04A1B7]" />
              <span className="text-sm">Loading campaign details...</span>
            </div>
          ) : !campaign ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Unable to load campaign details.
            </div>
          ) : (
            <>
              {/* Boosted Product */}
              {campaign.item && (
                <div className="flex items-center gap-3.5 rounded-xl border border-gray-200/80 bg-slate-50/50 p-3.5">
                  {campaign.item.image && !failedImages[campaign.item.image] ? (
                    <img
                      key={`camp-item-${campaign.id}-${campaign.item.image}`}
                      src={campaign.item.image}
                      alt={campaign.item.name}
                      onError={() => markImageFailed(campaign.item?.image)}
                      className="h-14 w-14 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Boosted {campaign.ad_type}
                      {campaign.item.code ? ` • #${campaign.item.code}` : ""}
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate mt-0.5">
                      {campaign.item.name}
                    </p>
                  </div>
                  {campaign.network_type && (
                    <span className="shrink-0 rounded-md bg-white border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 capitalize">
                      {campaign.network_type}
                    </span>
                  )}
                </div>
              )}

              {/* Performance KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-gray-200/80 p-3 bg-white">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                    <Eye className="h-3.5 w-3.5" /> Impressions
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {campaign.total_impressions.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200/80 p-3 bg-white">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                    <MousePointerClick className="h-3.5 w-3.5" /> Clicks
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {campaign.total_clicks.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200/80 p-3 bg-white">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                    <TrendingUp className="h-3.5 w-3.5" /> CTR
                  </span>
                  <p className="text-lg font-bold text-[#04A1B7] mt-1">
                    {campaign.ctr.toFixed(2)}%
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200/80 p-3 bg-white">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                    <Clock className="h-3.5 w-3.5" /> Remaining
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-1.5 truncate" title={campaign.remaining_text}>
                    {campaign.remaining_text}
                  </p>
                </div>
              </div>

              {/* Advertiser & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200/80 p-4">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    <User className="h-3.5 w-3.5" /> Advertiser
                  </div>
                  <div className="flex items-start gap-3">
                    <img
                      key={`camp-user-${campaign.id}-${campaign.user?.image || "default"}`}
                      src={
                        campaign.user?.image && !failedImages[campaign.user.image]
                          ? campaign.user.image
                          : emptyUserImg.src
                      }
                      alt={campaign.user?.name || "User"}
                      onError={() => markImageFailed(campaign.user?.image)}
                      className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {campaign.user?.name || "Unknown User"}
                      </p>
                      {campaign.user?.email && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {campaign.user.email}
                        </p>
                      )}
                      {campaign.user?.username && (
                        <a
                          href={`/mu/profile/${campaign.user.username}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#04A1B7] hover:underline mt-1"
                        >
                          @{campaign.user.username}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200/80 p-4">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    <Building2 className="h-3.5 w-3.5" /> Industry / Company
                  </div>
                  {campaign.industry ? (
                    <div className="flex items-start gap-3">
                      {campaign.industry.logo &&
                      !failedImages[campaign.industry.logo] ? (
                        <img
                          key={`camp-ind-${campaign.id}-${campaign.industry.logo}`}
                          src={campaign.industry.logo}
                          alt={campaign.industry.name}
                          onError={() => markImageFailed(campaign.industry?.logo)}
                          className="h-10 w-10 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0">
                          <Building2 className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {campaign.industry.name}
                        </p>
                        {campaign.industry.address && (
                          <p className="flex items-center gap-1 text-xs text-gray-500 truncate mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {campaign.industry.address}
                          </p>
                        )}
                        {campaign.industry.website && (
                          <a
                            href={
                              campaign.industry.website.startsWith("http")
                                ? campaign.industry.website
                                : `https://${campaign.industry.website}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#04A1B7] hover:underline mt-1 truncate max-w-full"
                          >
                            <Globe className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {campaign.industry.website}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No industry linked</p>
                  )}
                </div>
              </div>

              {/* Schedule & Placements */}
              <div className="rounded-xl border border-gray-200/80 p-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3 w-3" /> Started At
                    </span>
                    <span className="font-semibold text-gray-900 block mt-0.5">
                      {formatDateTime(campaign.starts_at)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3 w-3" /> Ends At
                    </span>
                    <span className="font-semibold text-gray-900 block mt-0.5">
                      {formatDateTime(campaign.ends_at)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">
                      {campaign.paused_at ? "Paused At" : "Amount Paid"}
                    </span>
                    <span className="font-semibold text-gray-900 block mt-0.5">
                      {campaign.paused_at
                        ? formatShortDate(campaign.paused_at)
                        : `${formatCurrency(campaign.amount_paid, campaign.currency)} (${campaign.payment_platform})`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Layers className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-500 font-medium">Placements:</span>
                    {campaign.placements.length > 0 ? (
                      campaign.placements.map((p) => (
                        <span
                          key={p}
                          className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-700"
                        >
                          {p.replace(/_/g, " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>

                  {campaign.payment_reference && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(campaign.payment_reference!, "pay-ref")
                      }
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-500 hover:text-[#04A1B7] cursor-pointer"
                    >
                      <span className="truncate max-w-[160px]">
                        {campaign.payment_reference}
                      </span>
                      {copiedKey === "pay-ref" ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Confirmation Banner when Pause / Cancel clicked */}
              {confirmAction && (
                <div
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    confirmAction === "cancel"
                      ? "border-red-200 bg-red-50/70"
                      : "border-amber-200 bg-amber-50/70"
                  }`}
                >
                  <div className="flex items-start gap-2.5 text-xs">
                    <AlertTriangle
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        confirmAction === "cancel"
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    />
                    <div>
                      <p className="font-bold text-gray-900">
                        {confirmAction === "cancel"
                          ? "Cancel this boost campaign permanently?"
                          : "Pause this boost campaign?"}
                      </p>
                      <p className="text-gray-600 mt-0.5">
                        {confirmAction === "cancel"
                          ? "The product will immediately lose its boosted status. Cancelled campaigns cannot be resumed."
                          : "Remaining boost time will be frozen and automatically restored when resumed."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isActionBusy}
                      onClick={() => setConfirmAction(null)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Keep
                    </button>
                    <button
                      type="button"
                      disabled={isActionBusy}
                      onClick={
                        confirmAction === "cancel" ? handleCancel : handlePause
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white cursor-pointer disabled:opacity-60 ${
                        confirmAction === "cancel"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-amber-600 hover:bg-amber-700"
                      }`}
                    >
                      {isActionBusy && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                      {confirmAction === "cancel"
                        ? "Yes, Cancel"
                        : "Yes, Pause"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Admin Controls */}
        {campaign && (canPause || canResume || canCancel) && (
          <div className="px-6 py-3.5 border-t border-gray-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span className="text-xs text-gray-500">Admin campaign controls</span>
            <div className="flex items-center gap-2">
              {canPause && (
                <button
                  type="button"
                  disabled={isActionBusy}
                  onClick={() => setConfirmAction("pause")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </button>
              )}
              {canResume && (
                <button
                  type="button"
                  disabled={isActionBusy}
                  onClick={handleResume}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#04A1B7] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#038a9d] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isResuming ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                  Resume
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  disabled={isActionBusy}
                  onClick={() => setConfirmAction("cancel")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Cancel Campaign
                </button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
