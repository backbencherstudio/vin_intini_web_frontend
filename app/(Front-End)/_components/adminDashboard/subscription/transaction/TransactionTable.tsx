"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import AdminFilterPopover from "@/components/reusable/dashboard/AdminFilterPopover";
import Image from "next/image";
import emptyUserImg from "@/public/empty_user.jpg";
import visaIcon from "@/public/images/admin/visa.png";
import mastercardIcon from "@/public/images/admin/paypal.png";
import americanExpressIcon from "@/public/images/admin/american.png";
import { useMemo, useState } from "react";
import {
  Building2,
  Copy,
  Crown,
  Download,
  FileText,
  Layers,
  Loader2,
  Rocket,
  SearchIcon,
} from "lucide-react";
import { getToken } from "@/lib/token";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { DateRangePicker } from "@/components/reusable/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import Pagination from "@/components/reusable/Pagination";
import toast from "react-hot-toast";
import {
  useGetPlansQuery,
  useGetTransactionListQuery,
} from "@/feature/slice/admin/subscription/subscriptionApi";
import {
  Transaction as ApiTransaction,
  Plan,
  TransactionType,
  TransactionTypeFilter,
} from "@/feature/slice/admin/subscription/subscriptionType";
import {
  BoostPackage,
  useGetBoostPackagesQuery,
} from "@/feature/slice/admin/boost/boostApi";
import TransactionInvoiceModal from "./TransactionInvoiceModal";

interface TransactionTableProps {
  activeType?: TransactionTypeFilter;
  onTypeChange?: (type: TransactionTypeFilter) => void;
}

type TableTransaction = {
  id: number;
  invoiceNumber: string;
  transactionId: string;
  type: TransactionType;
  img: string;
  subscriber: string;
  email: string;
  industryName: string | null;
  planOrPackage: string;
  planSubtext: string | null;
  isCustomBoost: boolean;
  amount: string;
  amountSubtext: string | null;
  status: "Completed" | "Failed" | "Refunded" | "Pending";
  paymentMethod: string;
  cardNumber: string;
  date: string;
  time: string;
  raw: ApiTransaction;
};

const mapCardBrand = (brand?: string | null) => {
  const normalized = brand?.toLowerCase();
  if (normalized === "visa") return "VISA";
  if (
    normalized === "mastercard" ||
    normalized === "master_card" ||
    normalized === "mc"
  )
    return "Mastercard";
  if (
    normalized === "amex" ||
    normalized === "american express" ||
    normalized === "american_express"
  )
    return "American Express";
  if (normalized === "paypal") return "PayPal";
  return brand || "-";
};

const mapStatus = (status: string): TableTransaction["status"] => {
  switch (status) {
    case "succeeded":
      return "Completed";
    case "failed":
      return "Failed";
    case "refunded":
    case "partially_refunded":
      return "Refunded";
    case "pending":
    default:
      return "Pending";
  }
};

export default function TransactionTable({
  activeType: controlledType,
  onTypeChange,
}: TransactionTableProps) {
  const [internalType, setInternalType] = useState<TransactionTypeFilter>("all");
  const activeType = controlledType ?? internalType;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [boostPackageFilter, setBoostPackageFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ApiTransaction | null>(null);

  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://vini.pixelstack.cloud/api"
      ).replace(/\/$/, "");
      const params = new URLSearchParams();
      if (activeType && activeType !== "all") params.set("type", activeType);
      if (planFilter) params.set("plan_id", planFilter);
      if (boostPackageFilter)
        params.set("boost_package_id", boostPackageFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      if (date?.from)
        params.set("date_from", date.from.toISOString().split("T")[0]);
      if (date?.to) params.set("date_to", date.to.toISOString().split("T")[0]);

      const token = await getToken();
      const qs = params.toString();
      const response = await fetch(
        `${baseUrl}/admin/transactions/export${qs ? `?${qs}` : ""}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            Accept: "text/csv, application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Export failed (${response.status})`);
      }

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") || "";
      const fileNameMatch = disposition.match(/filename="?([^"]+)"?/i);
      const today = new Date().toISOString().split("T")[0];
      const fileName =
        fileNameMatch?.[1] ||
        `mindunite-transactions-${activeType}-${today}.csv`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("CSV exported successfully");
    } catch {
      toast.error("Failed to export transactions CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSetType = (nextType: TransactionTypeFilter) => {
    if (onTypeChange) {
      onTypeChange(nextType);
    } else {
      setInternalType(nextType);
    }
    if (nextType === "boosting") {
      setPlanFilter("");
    } else if (nextType === "subscription") {
      setBoostPackageFilter("");
    }
    setPage(1);
  };

  const queryParams: Record<string, unknown> = { page, per_page: perPage };
  if (activeType && activeType !== "all") queryParams.type = activeType;
  if (planFilter) queryParams.plan_id = planFilter;
  if (boostPackageFilter) queryParams.boost_package_id = boostPackageFilter;
  if (statusFilter) queryParams.status = statusFilter;
  if (search.trim()) queryParams.search = search.trim();
  if (date?.from) queryParams.date_from = date.from.toISOString().split("T")[0];
  if (date?.to) queryParams.date_to = date.to.toISOString().split("T")[0];

  const {
    data: apiResponse,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetTransactionListQuery({ query: queryParams });

  const { data: planData } = useGetPlansQuery();
  const { data: boostPackageData } = useGetBoostPackagesQuery();

  const planOptions =
    planData?.data?.map((plan: Plan) => ({
      label: plan.name,
      value: String(plan.id),
    })) || [];

  const boostPackageOptions = [
    ...(boostPackageData?.data?.map((pkg: BoostPackage) => ({
      label: `${pkg.name} (${pkg.duration_days}d)`,
      value: String(pkg.id),
    })) || []),
    { label: "Custom Boost", value: "custom" },
  ];

  const formatAmount = (amount: string, currency: string) => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return `${currency} ${amount}`;
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(value);
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  const apiTransactions: TableTransaction[] = useMemo(() => {
    return (apiResponse?.data ?? []).map((t: ApiTransaction) => {
      const isBoosting = t.type === "boosting" || Boolean(t.boosting);
      const billingCycle = t.plan?.billing_cycle ?? null;
      const boostingDuration = t.boosting?.duration_days ?? 0;

      const planOrPackage = isBoosting
        ? t.boosting?.package_name || "Custom Boost"
        : t.plan?.name || "-";

      const planSubtext = isBoosting
        ? [
            boostingDuration > 0 ? `${boostingDuration}d` : null,
            t.boosting?.item?.name || null,
          ]
            .filter(Boolean)
            .join(" • ") || null
        : billingCycle
          ? `${billingCycle === "yearly" ? "Yearly" : "Monthly"} plan`
          : null;

      const amountSubtext = isBoosting
        ? boostingDuration > 0
          ? `${boostingDuration}d boost`
          : "One-time"
        : billingCycle
          ? `/ ${billingCycle === "yearly" ? "year" : "month"}`
          : null;

      return {
        id: t.id,
        invoiceNumber: t.invoice_number || `INV-${t.id}`,
        transactionId: t.transaction_id || "-",
        type: isBoosting ? "boosting" : "subscription",
        img: t.subscriber?.image || emptyUserImg.src,
        subscriber: t.subscriber?.name || "Unknown",
        email: t.subscriber?.email || "",
        industryName: t.boosting?.industry?.name || null,
        planOrPackage,
        planSubtext,
        isCustomBoost: Boolean(t.boosting?.is_custom),
        amount: formatAmount(t.amount, t.currency || "USD"),
        amountSubtext,
        status: mapStatus(t.status),
        paymentMethod: mapCardBrand(t.card_brand),
        cardNumber: t.card_last4 ? `****${t.card_last4}` : "-",
        date: t.purchased_at
          ? new Date(t.purchased_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
        time: t.purchased_at
          ? new Date(t.purchased_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "",
        raw: t,
      };
    });
  }, [apiResponse]);

  const transactions = apiTransactions;
  const counts = apiResponse?.counts;
  const { current_page, last_page, total } = apiResponse?.pagination || {};

  const activeFilterCount =
    Number(activeType !== "all") +
    Number(Boolean(planFilter)) +
    Number(Boolean(boostPackageFilter)) +
    Number(Boolean(statusFilter)) +
    Number(Boolean(date?.from));

  const columns: Column<TableTransaction>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="text-gray-500 text-xs font-medium">
          {((current_page || 1) - 1) * perPage +
            transactions.findIndex((item) => item.id === row.id) +
            1}
        </span>
      ),
    },
    {
      header: "Transaction ID",
      cell: (row) => (
        <div className="flex flex-col gap-0.5 max-w-[210px]">
          <div className="flex items-center gap-1.5">
            <span
              className="truncate text-[#0A0A0A] font-semibold text-[13px] leading-[140%] font-mono"
              title={row.transactionId}
            >
              {row.transactionId}
            </span>
            {row.transactionId && row.transactionId !== "-" && (
              <button
                type="button"
                aria-label="Copy transaction ID"
                onClick={() => {
                  navigator.clipboard.writeText(row.transactionId);
                  toast.success("Transaction ID copied");
                }}
                className="text-gray-400 hover:text-[#04A1B7] shrink-0 cursor-pointer transition-colors"
              >
                <Copy size={13} />
              </button>
            )}
          </div>
          <span className="text-[11px] font-medium text-[#777980]">
            {row.invoiceNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      cell: (row) => (
        <div className="flex items-center gap-2.5 max-w-[210px]">
          <img
            src={row.img}
            alt={row.subscriber}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = emptyUserImg.src;
            }}
            className="h-8 w-8 shrink-0 rounded-full object-cover border border-gray-200/80"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[#0A0A0A] font-semibold text-[13.5px] leading-[135%]">
              {row.subscriber}
            </p>
            {row.industryName ? (
              <p
                className="flex items-center gap-1 truncate text-[11.5px] text-[#04A1B7] font-medium"
                title={row.industryName}
              >
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{row.industryName}</span>
              </p>
            ) : row.email ? (
              <p
                className="truncate text-[11.5px] text-[#777980]"
                title={row.email}
              >
                {row.email}
              </p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      cell: (row) =>
        row.type === "boosting" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap">
            <Rocket className="h-3.5 w-3.5 text-cyan-600" />
            Boosting
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap">
            <Crown className="h-3.5 w-3.5 text-purple-600" />
            Subscription
          </span>
        ),
    },
    {
      header: "Plan / Package",
      cell: (row) => (
        <CustomBadge
          color={
            row.type === "boosting"
              ? row.isCustomBoost
                ? "orange"
                : "cyan"
              : row.planOrPackage === "Premium"
                ? "orange"
                : row.planOrPackage === "Pro Industry" || row.planOrPackage === "Industry Pro"
                  ? "blue"
                  : row.planOrPackage === "Basic"
                    ? "purple"
                    : "gray"
          }
          className="font-semibold py-0.5! px-2! whitespace-nowrap"
        >
          {row.planOrPackage}
        </CustomBadge>
      ),
    },
    {
      header: "Amount",
      cell: (row) => (
        <div className="flex flex-col whitespace-nowrap">
          <span className="text-[#0A0A0A] font-semibold text-[14px] leading-[135%]">
            {row.amount}
          </span>
          {row.amountSubtext && (
            <span className="text-[11.5px] text-[#777980]">
              {row.amountSubtext}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Payment Status",
      cell: (row) => {
        const badgeColor =
          row.status === "Completed"
            ? "active"
            : row.status === "Failed"
              ? "suspended"
              : row.status === "Refunded"
                ? "orange"
                : "yellow";

        const campaignStatus = row.raw.boosting?.campaign_status?.toLowerCase();
        const subStatus = row.raw.subscription?.status?.toLowerCase();
        const secondaryNote =
          row.type === "boosting" &&
          (campaignStatus === "cancelled" || campaignStatus === "canceled")
            ? "Campaign: Cancelled"
            : row.type === "subscription" &&
                (subStatus === "canceled" || subStatus === "cancelled")
              ? "Sub: Canceled"
              : null;

        return (
          <div className="flex flex-col items-start gap-1 whitespace-nowrap">
            <CustomBadge color={badgeColor}>{row.status}</CustomBadge>
            {secondaryNote && (
              <span className="text-[10.5px] font-medium text-rose-600 pl-0.5">
                {secondaryNote}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Payment Method",
      cell: (row) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          {row.paymentMethod === "VISA" && (
            <Image
              src={visaIcon.src}
              alt="visa"
              width={26}
              height={26}
              className="h-6 w-6 rounded-full object-contain shrink-0"
            />
          )}
          {row.paymentMethod === "Mastercard" && (
            <Image
              src={mastercardIcon.src}
              alt="mastercard"
              width={26}
              height={26}
              className="h-6 w-6 rounded-full object-contain shrink-0"
            />
          )}
          {row.paymentMethod === "American Express" && (
            <Image
              src={americanExpressIcon.src}
              alt="americanExpress"
              width={26}
              height={26}
              className="h-6 w-6 rounded-full object-contain shrink-0"
            />
          )}
          <span className="text-[#0A0A0A] font-medium text-[13px]">
            {row.cardNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Date & Time",
      cell: (row) => (
        <div className="text-[#0A0A0A] text-[13px] leading-[135%] flex flex-col gap-0.5 whitespace-nowrap">
          <div>{row.date}</div>
          <div className="text-[#A5A5AB] text-[11.5px]">{row.time}</div>
        </div>
      ),
    },
    {
      header: "Invoice",
      cell: (row) => (
        <button
          type="button"
          onClick={() => setSelectedTransaction(row.raw)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#04A1B7] hover:text-[#04A1B7] hover:bg-cyan-50/40 transition-colors cursor-pointer whitespace-nowrap"
        >
          <FileText className="h-3.5 w-3.5" />
          Details
        </button>
      ),
    },
  ];

  const tabs: {
    key: TransactionTypeFilter;
    label: string;
    count?: number;
    icon: React.ReactNode;
  }[] = [
    {
      key: "all",
      label: "All Transactions",
      count: counts?.all,
      icon: <Layers className="h-3.5 w-3.5" />,
    },
    {
      key: "subscription",
      label: "Subscription",
      count: counts?.subscription,
      icon: <Crown className="h-3.5 w-3.5" />,
    },
    {
      key: "boosting",
      label: "Boosting",
      count: counts?.boosting,
      icon: <Rocket className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="mt-7">
      {/* Category Switcher Tabs */}
      <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => {
          const isActive = activeType === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleSetType(tab.key)}
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
      <div className="mb-5">
        <CustomTitleDescription
          title={
            activeType === "subscription"
              ? "Subscription Transactions"
              : activeType === "boosting"
                ? "Boosting Transactions"
                : "All Transactions"
          }
          description={`${(total ?? 0).toLocaleString()} transactions found`}
          action={
            <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:justify-end lg:w-auto lg:items-center">
              {/* Search */}
              <div className="relative w-full lg:w-[290px] lg:shrink-0">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808897]" />

                <CustomInput
                  aria-label="Search transactions"
                  className="pl-9"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search user, email, ID, product..."
                />
              </div>

              <AdminFilterPopover
                title="Filter transactions"
                activeCount={activeFilterCount}
                onReset={() => {
                  handleSetType("all");
                  setPlanFilter("");
                  setBoostPackageFilter("");
                  setStatusFilter("");
                  setDate(undefined);
                  setPage(1);
                }}
              >
                <CustomSelect
                  label="Transaction Type"
                  value={activeType}
                  onChange={(value: string) => {
                    handleSetType(
                      (value as TransactionTypeFilter) || "all",
                    );
                  }}
                  options={[
                    { label: "All Types", value: "all" },
                    { label: "Subscription", value: "subscription" },
                    { label: "Boosting", value: "boosting" },
                  ]}
                />

                {activeType !== "boosting" && (
                  <CustomSelect
                    label="Subscription Plan"
                    value={planFilter || "default"}
                    onChange={(value: string) => {
                      setPlanFilter(value === "default" ? "" : value);
                      setPage(1);
                    }}
                    options={[
                      { label: "All Plans", value: "default" },
                      ...planOptions,
                    ]}
                  />
                )}

                {activeType !== "subscription" && (
                  <CustomSelect
                    label="Boost Package"
                    value={boostPackageFilter || "default"}
                    onChange={(value: string) => {
                      setBoostPackageFilter(value === "default" ? "" : value);
                      setPage(1);
                    }}
                    options={[
                      { label: "All Packages", value: "default" },
                      ...boostPackageOptions,
                    ]}
                  />
                )}

                <CustomSelect
                  label="Status"
                  value={statusFilter || "default"}
                  onChange={(value: string) => {
                    setStatusFilter(value === "default" ? "" : value);
                    setPage(1);
                  }}
                  options={[
                    { label: "All Status", value: "default" },
                    { label: "Pending", value: "pending" },
                    { label: "Completed", value: "succeeded" },
                    { label: "Failed", value: "failed" },
                    { label: "Refunded", value: "refunded" },
                  ]}
                />

                <DateRangePicker
                  label="Date range"
                  date={date}
                  setDate={(range) => {
                    setDate(range);
                    setPage(1);
                  }}
                  placeholder="Select Date Range"
                />
              </AdminFilterPopover>

              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isExporting || (total ?? 0) === 0}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-semibold text-[#0A0A0A] shadow-2xs hover:border-[#04A1B7] hover:text-[#04A1B7] hover:bg-cyan-50/40 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#04A1B7]" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
              </button>
            </div>
          }
        />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3 animate-pulse">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-11 rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>Failed to load transactions.</span>
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
          <DataTable columns={columns} data={transactions} />
        </div>
      )}

      {/* Pagination & Rows Per Page */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                transactions
              </>
            ) : (
              "No transactions found"
            )}
          </span>

          <div className="flex items-center gap-2">
            <label
              htmlFor="transactions-per-page"
              className="text-xs font-medium text-[#777980] whitespace-nowrap"
            >
              Rows per page:
            </label>
            <select
              id="transactions-per-page"
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

      {/* Transaction Details & Invoice Modal */}
      <TransactionInvoiceModal
        open={Boolean(selectedTransaction)}
        transactionId={selectedTransaction?.id ?? null}
        initialData={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
