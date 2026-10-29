"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import Pagination from "@/components/reusable/Pagination";
import { useGetAllBilingHistoryQuery } from "@/feature/slice/settingSlice";
import dayjs from "dayjs";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

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
  plan?: {
    name?: string;
    billing_cycle?: string;
  };
  product?: ProductInfo;
}

// Brand icon component
const CardBrandIcon = ({ brand }: { brand?: string }) => {
  const normalized = (brand || "visa").toLowerCase();
  if (normalized.includes("visa")) {
    return (
      <span className="font-black italic text-[#1A1F71] text-xs tracking-tight select-none">
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

  return <CreditCard className="w-4 h-4 text-gray-500 shrink-0" />;
};

export default function BillingHistoryPage() {
  const [activeTab, setActiveTab] = useState<"subscription" | "boosting">(
    "boosting",
  );
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

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

  const columns = [
    {
      label: "Invoice No.",
      accessor: "invoice_no",
      position: "justify-start",
      width: "120px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="py-4 px-4 text-left font-medium text-sm text-headerColor whitespace-nowrap">
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
        const normalized = (
          row.status ||
          row.payment_status ||
          ""
        ).toLowerCase();
        const isPaid =
          normalized.includes("paid") || normalized.includes("succeeded");

        return (
          <div className="flex items-center justify-center py-4 px-2">
            {isPaid ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border border-[#A6F4C5] bg-[#ECFDF3] text-lightGreenColor2">
                <CheckCircle2 className="w-3.5 h-3.5 text-lightGreenColor2" />
                Paid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border border-amber-200 bg-amber-50 text-amber-700 capitalize">
                {row.status || "Pending"}
              </span>
            )}
          </div>
        );
      },
    },
    {
      label: activeTab === "boosting" ? "Product ID" : "Plan ID",
      accessor: "product_id",
      position: "justify-start",
      width: "150px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="py-3 px-3 text-left">
          <div className="inline-block px-2.5 py-0.5 text-xs font-bold text-white bg-black rounded-md uppercase tracking-wider">
            {row.product?.product_id ||
              (activeTab === "subscription" ? "PLAN" : `#${row.id}`)}
          </div>
          <p
            className="text-xs text-gray-500 font-medium truncate max-w-35 mt-1"
            title={
              row.product?.product_name ||
              row.product?.name ||
              row.package?.name
            }
          >
            {row.product?.product_name ||
              row.product?.name ||
              (activeTab === "subscription"
                ? row.package?.name || row.plan?.name || "Subscription"
                : "Product")}
          </p>
        </div>
      ),
    },
    {
      label: "Package",
      accessor: "package",
      position: "justify-center",
      width: "120px",
      formatter: (_: any, row: BillingHistoryItem) => (
        <div className="flex items-center justify-center py-4 px-2">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-[#EAECF0] text-[#344054] whitespace-nowrap">
            {row.package?.name || row.plan?.name || "Standard Boost"}
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
            <p className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
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
        <div className="flex items-center gap-2 py-4 px-3 text-sm text-descriptionColor whitespace-nowrap">
          <CreditCard className="w-4 h-4 text-descriptionColor shrink-0" />
          <CardBrandIcon brand={row.card_brand} />
          <span className="text-xs text-descriptionColor font-medium tracking-wider">
            •••• {row.card_last4 || "4242"}
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
          <div className="py-4 px-3 text-sm text-left whitespace-nowrap font-medium text-headerColor">
            {displayVal}
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ----------------- Top Header Section ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[32px] font-bold text-headerColor tracking-tight">
            Billing History
          </h1>
        </div>
      </div>

      {/* ----------------- Transactions Section ----------------- */}
      <div className="bg-white border border-borderColor rounded-2xl p-5 sm:p-6 space-y-5">
        {/* Card Header: Title + Pill Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-100">
          <h2 className="text-xl font-bold text-headerColor tracking-tight">
            Transactions
          </h2>

          {/* Pill Tabs: Subscription & Boosting */}
          <div className="inline-flex items-center p-1 rounded-xl bg-gray-50 border border-gray-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleTabChange("subscription")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "subscription"
                  ? "bg-primaryColor text-white shadow-xs"
                  : "text-grayColor1 hover:text-headerColor bg-transparent"
              }`}
            >
              Subscription
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("boosting")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "boosting"
                  ? "bg-primaryColor text-white shadow-xs"
                  : "text-grayColor1 hover:text-headerColor bg-transparent"
              }`}
            >
              Boosting
            </button>
          </div>
        </div>

        {/* Dynamic Table Container */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-LiteBlueColor" />
              <p className="text-sm font-medium">Loading billing history...</p>
            </div>
          ) : isError ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm text-red-500 font-medium">
                Failed to load billing history.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-1.5 rounded-lg bg-LiteBlueColor text-white text-xs font-semibold hover:opacity-90 transition-opacity"
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
                bg: "#F9FAFB",
                padding: "12px 16px",
                text: "#475467",
                fontWeight: "600",
                fontSize: "13px",
              }}
              rowStyle={{
                hover: true,
                hoverbg: "hover:bg-gray-50/70",
                border: "border-b border-[#F2F4F7]",
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
