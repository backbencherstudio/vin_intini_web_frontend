"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import Pagination from "@/components/reusable/Pagination";
import { useGetAllBilingHistoryQuery } from "@/feature/slice/settingSlice";
import {
  useGetSubscriptionStatusQuery,
  useCancelSubscriptionMutation,
} from "@/feature/slice/subscriptionSlice";
import dayjs from "dayjs";
import { CheckCircle2, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export interface PlanInfo {
  id?: number;
  name?: string;
  plan_type?: string;
  billing_cycle?: string;
  billing_rate?: number;
  badge_color?: string;
}

export interface PackageInfo {
  id?: number;
  name?: string;
  duration_days?: number;
  is_custom?: boolean;
}

export interface ProductInfo {
  id?: number;
  product_id?: string;
  name?: string;
  product_name?: string;
  slug?: string;
  image?: string;
}

export interface BillingHistoryItem {
  id: number;
  type?: string;
  invoice_no?: string;
  transaction_id?: string;
  status?: string;
  payment_status?: string;
  plan?: PlanInfo;
  issue_date?: string;
  due_date?: string;
  payment_date?: string;
  payment_date_formatted?: string;
  payment_method?: string;
  card_brand?: string;
  card_last4?: string;
  amount?: number;
  currency?: string;
  duration_days?: number;
  amount_formatted?: string;
  duration_formatted?: string;
  amount_duration_formatted?: string;
  package?: PackageInfo;
  product?: ProductInfo;
  receipt_url?: string | null;
  boost_period?: {
    starts_at?: string;
    ends_at?: string;
    campaign_status?: string;
  };
}

// Brand icon component
const CardBrandIcon = ({
  brand,
  rawMethod,
}: {
  brand?: string;
  rawMethod?: string;
}) => {
  const normalized = `${brand || ""} ${rawMethod || ""}`.toLowerCase();

  if (normalized.includes("visa")) {
    return (
      <span className="font-black italic text-blueColor text-xs tracking-tight select-none font-sans">
        VISA
      </span>
    );
  }

  if (normalized.includes("master") || normalized.includes("mc")) {
    return (
      <span className="inline-flex items-center shrink-0">
        <svg
          className="w-5 h-3.5"
          viewBox="0 0 24 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="7" cy="8" r="7" fill="#EB001B" />
          <circle cx="17" cy="8" r="7" fill="#F79E1B" fillOpacity="0.95" />
        </svg>
      </span>
    );
  }

  if (
    normalized.includes("amex") ||
    normalized.includes("american") ||
    normalized.includes("express")
  ) {
    return (
      <span className="bg-blueColor text-whiteColor text-[7px] font-extrabold px-1 py-0.5 rounded leading-tight text-center uppercase tracking-tighter inline-block shrink-0 select-none">
        <span className="block leading-none">AMERICAN</span>
        <span className="block leading-none">EXPRESS</span>
      </span>
    );
  }

  return <CreditCard className="w-4 h-4 text-grayColor1 shrink-0" />;
};

export default function BillingHistoryPage() {
  const [activeTab, setActiveTab] = useState<"subscription" | "boosting">("subscription");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: statusResponse, refetch: refetchStatus } =
    useGetSubscriptionStatusQuery(undefined);
  const [cancelSubscription, { isLoading: isCancelingSub }] =
    useCancelSubscriptionMutation();

  const activeSubscription = statusResponse?.data?.isActive
    ? statusResponse.data
    : null;

  const handleCancelSubscription = async () => {
    const subId =
      activeSubscription?.id ?? activeSubscription?.subscription_id;
    if (!subId) return;
    try {
      const res = await cancelSubscription(subId).unwrap();
      toast.success(res?.message || "Subscription canceled successfully.");
      setShowCancelModal(false);
      refetchStatus();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel subscription.");
    }
  };

  const { data, isLoading, isError, refetch } = useGetAllBilingHistoryQuery({
    type: activeTab,
    page,
    limit: pageSize,
  });

  const billingList: BillingHistoryItem[] = useMemo(() => {
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const pagination = data?.pagination || {
    current_page: page,
    last_page: 1,
    per_page: pageSize,
    total: billingList.length,
  };

  const handleTabChange = (newTab: "subscription" | "boosting") => {
    setActiveTab(newTab);
    setPage(1);
  };

  const getMaskedCardNumber = (row: BillingHistoryItem) => {
    if (row.card_last4) {
      return `•••• ${row.card_last4}`;
    }
    if (row.payment_method) {
      const lastFour = row.payment_method.match(/(\d{4})\s*$/)?.[1];
      if (lastFour) return `•••• ${lastFour}`;
      return row.payment_method.replace(/\*{2,}/g, "••••").trim();
    }
    return "-";
  };

  // -------------------------------------------------------------
  // 1. Subscription Columns (Original Design & Format)
  // -------------------------------------------------------------
  const subscriptionColumns = [
    {
      label: "Invoice No.",
      accessor: "invoice_no",
      position: "justify-start",
      width: "110px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="py-3 px-3 text-left text-sm font-medium text-headerColor whitespace-nowrap">
          {row.invoice_no || `#MU${String(row.id).padStart(6, "0")}`}
        </div>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      position: "justify-center",
      width: "85px",
      formatter: (_: any, row: BillingHistoryItem) => {
        const normalized = (row.status || row.payment_status || "").toLowerCase();
        const isPaid =
          normalized === "paid" ||
          normalized === "succeeded" ||
          normalized === "completed";
        const isExpired =
          normalized === "expired" ||
          normalized === "failed" ||
          normalized === "unpaid";

        if (isPaid) {
          return (
            <div className="flex items-center justify-center py-3 px-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-lightGreenColor bg-lightGreenColor/40 px-2.5 py-0.5 text-xs font-semibold text-lightGreenColor2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Paid
              </span>
            </div>
          );
        }

        if (isExpired) {
          return (
            <div className="flex items-center justify-center py-3 px-3">
              <span className="inline-flex items-center justify-center rounded-full border border-redColor/30 bg-redColor/10 px-2.5 py-0.5 text-xs font-semibold text-redColor">
                {row.status || "Expired"}
              </span>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center py-3 px-3">
            <span className="inline-flex items-center justify-center rounded-full border border-orengeColor/30 bg-orengeColor/10 px-2.5 py-0.5 text-xs font-semibold text-orengeColor capitalize">
              {row.status || "Pending"}
            </span>
          </div>
        );
      },
    },
    {
      label: "Plan",
      accessor: "plan",
      position: "justify-center",
      width: "105px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="flex items-center justify-center py-3 px-3">
          <span className="inline-flex items-center justify-center rounded-full border border-borderColor bg-sectionColor px-3 py-1 text-xs font-medium text-descriptionColor whitespace-nowrap">
            {row.plan?.name || row.package?.name || "Premium"}
          </span>
        </div>
      ),
    },
    {
      label: "Issue Date",
      accessor: "issue_date",
      position: "justify-start",
      width: "110px",
      formatter: (val: string, row: BillingHistoryItem) => {
        const dateVal = val || row.payment_date;
        return (
          <div className="py-3 px-3 text-left">
            <p className="text-sm font-medium text-headerColor whitespace-nowrap">
              {dateVal ? dayjs(dateVal).format("DD MMM YYYY") : "-"}
            </p>
            <p className="text-xs text-descriptionColor whitespace-nowrap mt-0.5">
              {dateVal ? dayjs(dateVal).format("hh:mm A") : ""}
            </p>
          </div>
        );
      },
    },
    {
      label: "Due Date",
      accessor: "due_date",
      position: "justify-start",
      width: "110px",
      formatter: (val: string, row: BillingHistoryItem) => {
        const dateVal = val || row.boost_period?.ends_at;
        return (
          <div className="py-3 px-3 text-left">
            <p className="text-sm font-medium text-headerColor whitespace-nowrap">
              {dateVal ? dayjs(dateVal).format("DD MMM YYYY") : "-"}
            </p>
            <p className="text-xs text-descriptionColor whitespace-nowrap mt-0.5">
              {dateVal ? dayjs(dateVal).format("hh:mm A") : ""}
            </p>
          </div>
        );
      },
    },
    {
      label: "Payment Method",
      accessor: "payment_method",
      position: "justify-start",
      width: "160px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="flex items-center gap-2.5 py-3 px-3 text-sm text-descriptionColor whitespace-nowrap">
          <CardBrandIcon brand={row.card_brand} rawMethod={row.payment_method} />
          <span className="font-normal text-descriptionColor tracking-wider text-xs sm:text-sm">
            {getMaskedCardNumber(row)}
          </span>
        </div>
      ),
    },
    {
      label: "Amount",
      accessor: "amount",
      position: "justify-start",
      width: "120px",
      formatter: (_: any, row: BillingHistoryItem) => {
        if (row.amount_formatted) {
          const parts = row.amount_formatted.split("/");
          return (
            <div className="py-3 px-3 text-sm whitespace-nowrap text-left">
              <span className="font-semibold text-headerColor">
                {parts[0]?.trim()}
              </span>
              {parts[1] && (
                <span className="text-grayColor1 font-normal">
                  {" "}
                  / {parts[1]?.trim()}
                </span>
              )}
            </div>
          );
        }
        const currencySymbol =
          row.currency?.toLowerCase() === "usd" || !row.currency
            ? "$"
            : row.currency;
        const price = `${currencySymbol}${Number(row.amount || 0).toFixed(2)}`;
        const period = row.plan?.billing_cycle
          ? ` / ${row.plan.billing_cycle}`
          : " / month";
        return (
          <div className="py-3 px-3 text-sm whitespace-nowrap text-left">
            <span className="font-semibold text-headerColor">{price}</span>
            <span className="text-grayColor1 font-normal">{period}</span>
          </div>
        );
      },
    },
  ];

  // -------------------------------------------------------------
  // 2. Boosting Columns (New Design from Image)
  // -------------------------------------------------------------
  const boostingColumns = [
    {
      label: "Invoice No.",
      accessor: "invoice_no",
      position: "justify-start",
      width: "120px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="py-3 px-3 text-left text-sm font-medium text-headerColor whitespace-nowrap">
          {row.invoice_no || `#MU${String(row.id).padStart(6, "0")}`}
        </div>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      position: "justify-center",
      width: "95px",
      formatter: (_: any, row: BillingHistoryItem) => {
        const normalized = (row.status || row.payment_status || "").toLowerCase();
        const isPaid =
          normalized === "paid" ||
          normalized === "succeeded" ||
          normalized === "completed";
        const isFailed =
          normalized === "failed" ||
          normalized === "expired" ||
          normalized === "unpaid";

        return (
          <div className="flex items-center justify-center py-3 px-3">
            {isPaid ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-lightGreenColor bg-lightGreenColor/40 px-2.5 py-0.5 text-xs font-semibold text-lightGreenColor2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Paid
              </span>
            ) : isFailed ? (
              <span className="inline-flex items-center justify-center rounded-full border border-redColor/30 bg-redColor/10 px-2.5 py-0.5 text-xs font-semibold text-redColor capitalize">
                {row.status || row.payment_status || "Failed"}
              </span>
            ) : (
              <span className="inline-flex items-center justify-center rounded-full border border-orengeColor/30 bg-orengeColor/10 px-2.5 py-0.5 text-xs font-semibold text-orengeColor capitalize">
                {row.status || "Pending"}
              </span>
            )}
          </div>
        );
      },
    },
    {
      label: "Product ID",
      accessor: "product_id",
      position: "justify-start",
      width: "120px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="py-3 px-3 text-left w-30">
          <div className="inline-block rounded-md border border-primaryColor/20 bg-primaryColor/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primaryColor">
            {row.product?.product_id || `#${row.id}`}
          </div>
          <p
            className="text-xs text-descriptionColor font-medium truncate  mt-1"
            title={row.product?.product_name || row.product?.name}
          >
            {row.product?.product_name || row.product?.name || "Product"}
          </p>
        </div>
      ),
    },
    {
      label: "Package",
      accessor: "package",
      position: "justify-center",
      width: "140px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="flex items-center justify-center py-3 px-3">
          <span className="inline-flex items-center rounded-full border border-borderColor bg-sectionColor px-3 py-1 text-xs font-medium text-descriptionColor whitespace-nowrap">
            {row.package?.name || "Standard Boost"}
          </span>
        </div>
      ),
    },
    {
      label: "Payment Date",
      accessor: "payment_date",
      position: "justify-start",
      width: "120px",
      formatter: (_: any, row: BillingHistoryItem) => {
        const dateVal = row.payment_date;
        return (
          <div className="py-3 px-3 text-left">
            <p className="text-sm font-medium text-headerColor whitespace-nowrap">
              {dateVal ? dayjs(dateVal).format("DD MMM YYYY") : "-"}
            </p>
            <p className="text-xs text-descriptionColor whitespace-nowrap mt-0.5">
              {dateVal ? dayjs(dateVal).format("hh:mm A") : ""}
            </p>
          </div>
        );
      },
    },
    {
      label: "Payment Method",
      accessor: "payment_method",
      position: "justify-start",
      width: "160px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="flex items-center gap-2.5 py-3 px-3 text-sm text-descriptionColor whitespace-nowrap">
          <CardBrandIcon brand={row.card_brand} rawMethod={row.payment_method} />
          <span className="font-normal text-descriptionColor tracking-wider text-xs sm:text-sm">
            {getMaskedCardNumber(row)}
          </span>
        </div>
      ),
    },
    {
      label: "Amount/Duration",
      accessor: "amount",
      position: "justify-start",
      width: "150px",
      formatter: (_: any, row: BillingHistoryItem) => {
        const displayVal =
          row.amount_duration_formatted ||
          (row.duration_days
            ? `${row.amount_formatted || `$${Number(row.amount || 0).toFixed(2)}`} / ${row.duration_formatted || `${row.duration_days} days`}`
            : `${row.amount_formatted || `$${Number(row.amount || 0).toFixed(2)}`}`);

        return (
          <div className="py-3 px-3 text-sm text-left whitespace-nowrap font-medium text-headerColor">
            {displayVal}
          </div>
        );
      },
    },
  ];

  const columns = activeTab === "subscription" ? subscriptionColumns : boostingColumns;

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ----------------- Top Header Section ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderColor min-h-[66px] pb-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor leading-tight">
            Billing History
          </h1>
          <p className="text-sm text-descriptionColor mt-1 font-normal">
            Review your billing history and manage your invoices.
          </p>
        </div>
      </div>

      {/* ----------------- Active Subscription Banner (if active) ----------------- */}
      {activeSubscription && (
        <div className="rounded-2xl border border-borderColor bg-gradient-to-r from-cyan-50/70 via-sky-50/40 to-white p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primaryColor/10 px-3 py-1 text-xs font-semibold text-primaryColor">
                  <span className="h-2 w-2 rounded-full bg-primaryColor animate-pulse" />
                  Active Subscription
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-headerColor">
                  {activeSubscription.plan?.name || "Premium Plan"}
                </h3>
              </div>
              <p className="text-sm text-descriptionColor">
                ${activeSubscription.plan?.billing_rate ?? "0.00"} /{" "}
                {activeSubscription.plan?.billing_cycle ?? "month"}
                {activeSubscription.expiresAt && (
                  <>
                    {" "}
                    •{" "}
                    {activeSubscription.willRenew
                      ? `Renews on ${dayjs(activeSubscription.expiresAt).format("MMM DD, YYYY")}`
                      : `Expires on ${dayjs(activeSubscription.expiresAt).format("MMM DD, YYYY")}`}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeSubscription.willRenew ? (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="rounded-full border border-redColor/40 px-4 py-2 text-xs sm:text-sm font-semibold text-redColor hover:bg-redColor/10 transition-colors cursor-pointer"
                >
                  Cancel Subscription
                </button>
              ) : (
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700">
                  Scheduled for cancellation
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-borderColor space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-redColor">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-headerColor">
                Cancel Subscription?
              </h3>
            </div>
            <p className="text-sm text-descriptionColor leading-relaxed">
              Are you sure you want to cancel your {activeSubscription?.plan?.name || "Premium"} subscription?
              You will continue to have access to your plan benefits until the end of your current billing period on{" "}
              <span className="font-semibold text-headerColor">
                {activeSubscription?.expiresAt ? dayjs(activeSubscription.expiresAt).format("MMM DD, YYYY") : "the end of the cycle"}
              </span>.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-full border border-borderColor px-4 py-2 text-sm font-semibold text-headerColor hover:bg-bgColor transition-colors cursor-pointer"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                disabled={isCancelingSub}
                onClick={handleCancelSubscription}
                className="rounded-full bg-redColor px-5 py-2 text-sm font-semibold text-white hover:bg-redColor/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isCancelingSub ? "Canceling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Transactions Section ----------------- */}
      <div className="space-y-5">
        {/* Pill Tabs: Subscription & Boosting */}
        <div className="flex justify-end">
          <div className="inline-flex items-center p-1 rounded-xl bg-sectionColor border border-borderColor">
            <button
              type="button"
              onClick={() => handleTabChange("subscription")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "subscription"
                  ? "bg-primaryColor text-whiteColor shadow-xs"
                  : "text-descriptionColor hover:text-headerColor bg-transparent"
              }`}
            >
              Subscription
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("boosting")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "boosting"
                  ? "bg-primaryColor text-whiteColor shadow-xs"
                  : "text-descriptionColor hover:text-headerColor bg-transparent"
              }`}
            >
              Boosting
            </button>
          </div>
        </div>

        {/* Dynamic Table Container */}
        <div className="overflow-x-auto border rounded-lg">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-grayColor1">
              <Loader2 className="w-8 h-8 animate-spin text-primaryColor" />
              <p className="text-sm font-medium text-descriptionColor">
                Loading billing history...
              </p>
            </div>
          ) : isError ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm text-redColor font-medium">
                Failed to load billing history.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-1.5 rounded-lg bg-primaryColor text-whiteColor text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Retry
              </button>
            </div>
          ) : (
            <DynamicTable
              columns={columns}
              data={billingList}
              tableMinWidth="100%"
              header={{
                bg: "var(--color-bgLightColor, #F8FAFB)",
                padding: "12px 16px",
                text: "var(--color-headerColor, #475467)",
                fontWeight: "600",
                fontSize: "13px",
              }}
              rowStyle={{
                hover: true,
                hoverbg: "hover:bg-sectionColor",
                border: "border-b border-x-0 last:border-0 border-borderColor",
              }}
              noDataMessage="No billing transactions found."
            />
          )}
        </div>

        {/* ----------------- Reusable Pagination ----------------- */}
        {pagination.total > 0 && (
          <div className="pt-2">
            <Pagination
              page={pagination.current_page || page}
              pageSize={pagination.per_page || pageSize}
              total={pagination.total}
              totalPages={pagination.last_page || 1}
              onPageChange={(newPage) => setPage(newPage)}
              showPageSize={true}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              pageSizeOptions={[10, 20, 30, 50]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
