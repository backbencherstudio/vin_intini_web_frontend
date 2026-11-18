"use client";

import { useState } from "react";
import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import AdminFilterPopover from "@/components/reusable/dashboard/AdminFilterPopover";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DateRangePicker";
import Pagination from "@/components/reusable/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import emptyUserImg from "@/public/empty_user.jpg";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Ban,
  Building2,
  CheckCircle2,
  Eye,
  Layers,
  Loader2,
  Package,
  Pause,
  Play,
  Rocket,
  SearchIcon,
} from "lucide-react";
import {
  AdminAdCampaign,
  AdminAdCampaignStatus,
  BoostPackage,
  useCancelAdCampaignMutation,
  useGetAdCampaignsQuery,
  useGetBoostPackagesQuery,
  usePauseAdCampaignMutation,
  useResumeAdCampaignMutation,
} from "@/feature/slice/admin/boost/boostApi";
import AdCampaignOverviewCards from "./AdCampaignOverviewCards";
import AdCampaignDetailsModal from "./AdCampaignDetailsModal";
import TransactionInvoiceModal from "../subscription/transaction/TransactionInvoiceModal";

const formatCurrency = (amount: string | number | undefined, currency = "USD") => {
  const value = Number(amount ?? 0);
  if (!Number.isFinite(value)) return "$0.00";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
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

const statusBadgeColor = (status: string) => {
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

export default function AdCampaignOverviewTable() {
  const [activeStatus, setActiveStatus] = useState<AdminAdCampaignStatus>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [networkFilter, setNetworkFilter] = useState("");
  const [packageFilter, setPackageFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedCampaign, setSelectedCampaign] = useState<AdminAdCampaign | null>(null);
  const [invoiceTxnId, setInvoiceTxnId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: "pause" | "cancel";
    campaign: AdminAdCampaign;
  } | null>(null);
  const [resumingId, setResumingId] = useState<number | null>(null);

  const queryParams: Record<string, unknown> = { page, per_page: perPage };
  if (activeStatus !== "all") queryParams.status = activeStatus;
  if (networkFilter) queryParams.network_type = networkFilter;
  if (packageFilter) queryParams.boost_package_id = packageFilter;
  if (search.trim()) queryParams.search = search.trim();
  if (date?.from) queryParams.date_from = date.from.toISOString().split("T")[0];
  if (date?.to) queryParams.date_to = date.to.toISOString().split("T")[0];

  const { data, isLoading, isError, isFetching, refetch } =
    useGetAdCampaignsQuery(queryParams);
  const { data: boostPackagesResp } = useGetBoostPackagesQuery();

  const [pauseCampaign, { isLoading: isPausing }] = usePauseAdCampaignMutation();
  const [resumeCampaign] = useResumeAdCampaignMutation();
  const [cancelCampaign, { isLoading: isCancelling }] = useCancelAdCampaignMutation();

  const campaigns = data?.data ?? [];
  const counts = data?.counts;
  const overview = data?.overview;
  const { current_page, last_page, total } = data?.pagination || {};

  const markImageFailed = (url?: string | null) => {
    if (!url) return;
    setFailedImages((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  };

  const handleSelectStatus = (status: AdminAdCampaignStatus) => {
    setActiveStatus(status);
    setPage(1);
  };

  const handleResumeQuick = async (campaign: AdminAdCampaign) => {
    setResumingId(campaign.id);
    try {
      const res = await resumeCampaign(campaign.id).unwrap();
      toast.success(res.message || `Campaign #${campaign.id} resumed`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resume campaign");
    } finally {
      setResumingId(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    const { type, campaign } = pendingAction;
    try {
      if (type === "pause") {
        const res = await pauseCampaign(campaign.id).unwrap();
        toast.success(res.message || `Campaign #${campaign.id} paused`);
      } else {
        const res = await cancelCampaign(campaign.id).unwrap();
        toast.success(res.message || `Campaign #${campaign.id} cancelled`);
      }
      setPendingAction(null);
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          `Failed to ${type === "pause" ? "pause" : "cancel"} campaign`,
      );
    }
  };

  const boostPackageOptions = [
    ...(boostPackagesResp?.data?.map((pkg: BoostPackage) => ({
      label: `${pkg.name} (${pkg.duration_days}d)`,
      value: String(pkg.id),
    })) || []),
    { label: "Custom Boost", value: "custom" },
  ];

  const activeFilterCount =
    Number(Boolean(networkFilter)) +
    Number(Boolean(packageFilter)) +
    Number(Boolean(date?.from));

  const columns: Column<AdminAdCampaign>[] = [
    {
      header: "ID",
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-gray-600">
          #{row.id}
        </span>
      ),
    },
    {
      header: "Boosted Product",
      cell: (row) => (
        <div className="flex items-center gap-2.5 max-w-[240px]">
          {row.item?.image && !failedImages[row.item.image] ? (
            <img
              src={row.item.image}
              alt={row.item.name}
              onError={() => markImageFailed(row.item?.image)}
              className="h-9 w-9 shrink-0 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-100 border border-gray-200 flex items-center justify-center">
              <Package className="h-4 w-4 text-slate-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[13.5px] font-semibold text-[#0A0A0A]"
              title={row.item?.name || "Unknown item"}
            >
              {row.item?.name || "Deleted Product"}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#777980]">
              {row.item?.code && <span className="font-mono">#{row.item.code}</span>}
              {row.item?.code && row.network_type && <span>•</span>}
              {row.network_type && (
                <span className="capitalize">{row.network_type}</span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Advertiser",
      cell: (row) => (
        <div className="flex items-center gap-2.5 max-w-[200px]">
          <img
            src={
              row.user?.image && !failedImages[row.user.image]
                ? row.user.image
                : emptyUserImg.src
            }
            alt={row.user?.name || "User"}
            onError={() => markImageFailed(row.user?.image)}
            className="h-8 w-8 shrink-0 rounded-full object-cover border border-gray-200"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[#0A0A0A]">
              {row.user?.name || "Unknown User"}
            </p>
            {row.industry?.name ? (
              <p
                className="flex items-center gap-1 truncate text-[11.5px] font-medium text-[#04A1B7]"
                title={row.industry.name}
              >
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{row.industry.name}</span>
              </p>
            ) : row.user?.email ? (
              <p className="truncate text-[11px] text-[#777980]">
                {row.user.email}
              </p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      header: "Package",
      cell: (row) => (
        <div className="flex flex-col items-start gap-0.5 whitespace-nowrap">
          <CustomBadge
            color={row.is_custom ? "orange" : "cyan"}
            className="font-semibold py-0.5! px-2!"
          >
            {row.package_name}
          </CustomBadge>
          <span className="text-[11px] text-[#777980]">
            {row.duration_days} {row.duration_days === 1 ? "day" : "days"}
          </span>
        </div>
      ),
    },
    {
      header: "Performance",
      cell: (row) => (
        <div className="flex flex-col gap-0.5 whitespace-nowrap text-xs">
          <span className="font-semibold text-[#0A0A0A]">
            {row.total_impressions.toLocaleString()}{" "}
            <span className="font-normal text-[#777980]">imp</span> •{" "}
            {row.total_clicks.toLocaleString()}{" "}
            <span className="font-normal text-[#777980]">clicks</span>
          </span>
          <span className="text-[11px] font-semibold text-[#04A1B7]">
            CTR {row.ctr.toFixed(2)}%
          </span>
        </div>
      ),
    },
    {
      header: "Schedule",
      cell: (row) => (
        <div className="flex flex-col gap-0.5 whitespace-nowrap text-xs">
          <span className="text-[#0A0A0A] font-medium">
            {formatShortDate(row.starts_at)} — {formatShortDate(row.ends_at)}
          </span>
          <span className="text-[11px] text-[#777980]">
            {row.remaining_text}
          </span>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (row) => (
        <span className="text-[13.5px] font-semibold text-[#0A0A0A] whitespace-nowrap">
          {formatCurrency(row.amount_paid, row.currency)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <CustomBadge color={statusBadgeColor(row.status)}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </CustomBadge>
      ),
    },
    {
      header: "Actions",
      cell: (row) => {
        const st = row.status?.toLowerCase();
        const canPause = st === "active";
        const canResume = st === "paused";
        const canCancel = st === "active" || st === "paused" || st === "pending";

        return (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <button
              type="button"
              title="View Campaign Details"
              aria-label="View Campaign Details"
              onClick={() => setSelectedCampaign(row)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#04A1B7] hover:text-[#04A1B7] hover:bg-cyan-50/40 transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </button>

            {canPause && (
              <button
                type="button"
                title="Pause Campaign"
                aria-label="Pause Campaign"
                onClick={() => setPendingAction({ type: "pause", campaign: row })}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50/70 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Pause className="h-3.5 w-3.5" />
              </button>
            )}

            {canResume && (
              <button
                type="button"
                title="Resume Campaign"
                aria-label="Resume Campaign"
                disabled={resumingId === row.id}
                onClick={() => handleResumeQuick(row)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                {resumingId === row.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                title="Cancel Campaign"
                aria-label="Cancel Campaign"
                onClick={() =>
                  setPendingAction({ type: "cancel", campaign: row })
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50/70 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Ban className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const tabs: {
    key: AdminAdCampaignStatus;
    label: string;
    count?: number;
    icon: React.ReactNode;
  }[] = [
    {
      key: "all",
      label: "All Campaigns",
      count: counts?.all,
      icon: <Layers className="h-3.5 w-3.5" />,
    },
    {
      key: "active",
      label: "Active",
      count: counts?.active,
      icon: <Rocket className="h-3.5 w-3.5" />,
    },
    {
      key: "paused",
      label: "Paused",
      count: counts?.paused,
      icon: <Pause className="h-3.5 w-3.5" />,
    },
    {
      key: "completed",
      label: "Completed",
      count: counts?.completed,
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: counts?.cancelled,
      icon: <Ban className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top 5 KPI Cards */}
      <AdCampaignOverviewCards
        overview={overview}
        isLoading={isLoading}
        activeStatus={activeStatus}
        onSelectStatus={handleSelectStatus}
      />

      {/* Status Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => {
          const isActive = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleSelectStatus(tab.key)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                isActive
                  ? "bg-[#04A1B7] text-white border-[#04A1B7] shadow-xs"
                  : "bg-white text-[#4A4C56] border-gray-200 hover:border-[#04A1B7]/50 hover:text-[#04A1B7]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Header + Search + Filters */}
      <CustomTitleDescription
        title={
          activeStatus === "all"
            ? "Ad Campaigns Overview"
            : `${activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)} Campaigns`
        }
        description={`${(total ?? 0).toLocaleString()} campaigns found`}
        action={
          <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:justify-end lg:w-auto lg:items-center">
            <div className="relative w-full lg:w-[290px] lg:shrink-0">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808897]" />
              <CustomInput
                aria-label="Search campaigns"
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search product, company, user, #ID..."
              />
            </div>

            <AdminFilterPopover
              title="Filter campaigns"
              activeCount={activeFilterCount}
              onReset={() => {
                setNetworkFilter("");
                setPackageFilter("");
                setDate(undefined);
                setPage(1);
              }}
            >
              <CustomSelect
                label="Network"
                value={networkFilter || "default"}
                onChange={(value: string) => {
                  setNetworkFilter(value === "default" ? "" : value);
                  setPage(1);
                }}
                options={[
                  { label: "All Networks", value: "default" },
                  { label: "Psychology", value: "psychology" },
                  { label: "Neuroscience", value: "neuroscience" },
                ]}
              />

              <CustomSelect
                label="Boost Package"
                value={packageFilter || "default"}
                onChange={(value: string) => {
                  setPackageFilter(value === "default" ? "" : value);
                  setPage(1);
                }}
                options={[
                  { label: "All Packages", value: "default" },
                  ...boostPackageOptions,
                ]}
              />

              <DateRangePicker
                label="Created Date Range"
                date={date}
                setDate={(range) => {
                  setDate(range);
                  setPage(1);
                }}
                placeholder="Select Date Range"
              />
            </AdminFilterPopover>
          </div>
        }
      />

      {/* Campaigns Data Table */}
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3 animate-pulse">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-12 rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>Failed to load ad campaigns.</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-semibold underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
          <DataTable columns={columns} data={campaigns} />
        </div>
      )}

      {/* Pagination & Rows Per Page */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#777980]">
          <span>
            {total && total > 0 ? (
              <>
                Showing{" "}
                <strong className="font-semibold text-[#0A0A0A]">
                  {((current_page || 1) - 1) * perPage + 1}
                </strong>
                –
                <strong className="font-semibold text-[#0A0A0A]">
                  {Math.min((current_page || 1) * perPage, total)}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-[#0A0A0A]">
                  {total.toLocaleString()}
                </strong>{" "}
                campaigns
              </>
            ) : (
              "No campaigns found"
            )}
          </span>

          <div className="flex items-center gap-2">
            <label
              htmlFor="campaigns-per-page"
              className="text-xs font-medium text-[#777980] whitespace-nowrap"
            >
              Rows per page:
            </label>
            <select
              id="campaigns-per-page"
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="h-9 rounded-md border border-gray-200 bg-white px-2.5 text-sm font-medium text-[#0A0A0A] shadow-2xs focus:border-[#04A1B7] focus:outline-none cursor-pointer"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="[&>div]:mt-0!">
          <Pagination
            page={current_page || 1}
            pageSize={perPage}
            total={total || 0}
            totalPages={last_page || 1}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Quick Pause / Cancel Confirmation Dialog */}
      <Dialog
        open={Boolean(pendingAction)}
        onOpenChange={(next) => !next && setPendingAction(null)}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  pendingAction?.type === "cancel"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-base font-bold text-gray-900">
                {pendingAction?.type === "cancel"
                  ? `Cancel Campaign #${pendingAction.campaign.id}?`
                  : `Pause Campaign #${pendingAction?.campaign.id}?`}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600 pt-2">
              {pendingAction?.type === "cancel"
                ? `This will permanently cancel the boost for "${pendingAction.campaign.item?.name || "this product"}". Cancelled campaigns cannot be resumed.`
                : `This will temporarily pause the boost for "${pendingAction?.campaign.item?.name || "this product"}". Its remaining duration (${pendingAction?.campaign.remaining_text}) will be frozen until resumed.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              disabled={isPausing || isCancelling}
              onClick={() => setPendingAction(null)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Keep Running
            </button>
            <button
              type="button"
              disabled={isPausing || isCancelling}
              onClick={handleConfirmAction}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white cursor-pointer disabled:opacity-60 ${
                pendingAction?.type === "cancel"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {(isPausing || isCancelling) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {pendingAction?.type === "cancel"
                ? "Yes, Cancel Campaign"
                : "Yes, Pause Campaign"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign Details Modal */}
      <AdCampaignDetailsModal
        open={Boolean(selectedCampaign)}
        campaignId={selectedCampaign?.id ?? null}
        initialData={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onOpenInvoice={(txnId) => setInvoiceTxnId(txnId)}
      />

      {/* Linked Official Invoice Modal */}
      <TransactionInvoiceModal
        open={Boolean(invoiceTxnId)}
        transactionId={invoiceTxnId}
        onClose={() => setInvoiceTxnId(null)}
      />
    </div>
  );
}
