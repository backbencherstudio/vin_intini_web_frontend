"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import AdminFilterPopover from "@/components/reusable/dashboard/AdminFilterPopover";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";
import visaIcon from "@/public/images/admin/visa.png";
import mastercardIcon from "@/public/images/admin/paypal.png";
import americanExpressIcon from "@/public/images/admin/american.png";
import { useMemo, useState } from "react";
import { Copy, SearchIcon } from "lucide-react";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { DateRangePicker } from "@/components/reusable/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import Pagination from "@/components/reusable/Pagination";
import {
  useGetPlansQuery,
  useGetTransactionListQuery,
} from "@/feature/slice/admin/subscription/subscriptionApi";
import {
  Transaction as ApiTransaction,
  Plan,
} from "@/feature/slice/admin/subscription/subscriptionType";

type Transaction = {
  id: number;
  transactionId: string;
  img: string;
  subscriber: string;
  plan: string;
  amount: string;
  status: "Completed" | "Failed" | "Refunded" | "Pending";
  billingCycle: string | null;
  paymentMethod: string;
  cardNumber: string;
  date: string;
  time: string;
};

const mapCardBrand = (brand: string) => {
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

const mapStatus = (status: string): Transaction["status"] => {
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

export default function TransactionTable() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const queryParams: Record<string, unknown> = { page, per_page: perPage };
  if (planFilter) queryParams.plan_id = planFilter;
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

  const {
    data: planData,
  } = useGetPlansQuery();

  const planOptions =
    planData?.data?.map((plan: Plan) => ({
      label: plan.name,
      value: plan.id,
    })) || [];

  const formatAmount = (amount: string, currency: string) => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return `${currency} ${amount}`;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(value);
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  const apiTransactions: Transaction[] = useMemo(() => {
    return (apiResponse?.data ?? []).map((t: ApiTransaction) => ({
      id: t.id,
      transactionId: t.transaction_id,
      img: t.subscriber?.image || userIcon.src,
      subscriber: t.subscriber?.name || "Unknown",
      plan: t.plan?.name || "-",
      amount: formatAmount(t.amount, t.currency || "USD"),
      status: mapStatus(t.status),
      paymentMethod: mapCardBrand(t.card_brand),
      cardNumber: t.card_last4 ? `****${t.card_last4}` : "-",
      billingCycle: t.plan?.billing_cycle ?? null,
      date: t.purchased_at ? new Date(t.purchased_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) : "—",
      time: t.purchased_at ? new Date(t.purchased_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) : "",
    }));
  }, [apiResponse]);
  const transactions = apiTransactions;

  const { current_page, last_page, total } = apiResponse?.pagination || {};

  const columns: Column<Transaction>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="text-gray-500">
          {((current_page || 1) - 1) * perPage + transactions.findIndex((item) => item.id === row.id) + 1}
        </span>
      ),
    },
    {
      header: "Transaction ID",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px]">
            {row.transactionId}
          </span>
            <button type="button" aria-label="Copy transaction ID" onClick={() => navigator.clipboard.writeText(row.transactionId)} className="text-gray-400 hover:text-gray-600">
            <Copy className="text-primary" size={14} />
          </button>
        </div>
      ),
    },
    {
      header: "Subscribers",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.img && (
            <Image
              src={row.img}
              alt={row.subscriber}
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
          )}
          <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px]">
            {row.subscriber}
          </span>
        </div>
      ),
    },
    {
      header: "Plan",
      cell: (row) => (
        <CustomBadge
          color={
            row.plan === "Premium"
              ? "orange"
              : row.plan === "Basic"
                ? "purple"
                : "gray"
          }
          className="font-medium"
        >
          {row.plan}
        </CustomBadge>
      ),
    },
    {
      header: "Amount",
      cell: (row) => (
        <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px]">
          {row.amount}
          <span className="text-[14px] text-[#777980]">{row.billingCycle ? ` / ${row.billingCycle === "yearly" ? "year" : "month"}` : ""}</span>
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        if (row.status === "Completed") {
          return <CustomBadge color="active">{row.status}</CustomBadge>;
        }
        if (row.status === "Failed") {
          return <CustomBadge color="suspended">{row.status}</CustomBadge>;
        }
        if (row.status === "Refunded") {
          return <CustomBadge color="orange">{row.status}</CustomBadge>;
        }
        return <CustomBadge color="yellow">{row.status}</CustomBadge>; // Pending
      },
    },
    {
      header: "Payment Method",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.paymentMethod === "VISA" && (
            <span>
              <Image
                src={visaIcon.src}
                alt="visa"
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-contain"
              />
            </span>
          )}
          {row.paymentMethod === "Mastercard" && (
            <div className="flex -space-x-1">
              <span>
                <Image
                  src={mastercardIcon.src}
                  alt="mastercard"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-contain"
                />
              </span>
            </div>
          )}
          {row.paymentMethod === "American Express" && (
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
              <span>
                <Image
                  src={americanExpressIcon.src}
                  alt="americanExpress"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-contain"
                />
              </span>
            </span>
          )}
          <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px]">
            {row.cardNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Date & Time",
      cell: (row) => (
        <div className="overflow-hidden text-ellipsis text-[#0A0A0A]  text-[14px] leading-[140%] tracking-[0.07px] flex flex-col gap-0.5">
          <div>{row.date}</div>
          <div className="text-[#A5A5AB]">{row.time}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-8">
      {/* Filters */}
      <div className="mb-6">
        <CustomTitleDescription
          title="All Transactions"
          description={`${(total ?? 0).toLocaleString()} transactions`}
          action={<div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:justify-end lg:w-auto lg:items-center">
          {/* Search */}
          <div className="relative w-full lg:w-[260px] lg:shrink-0">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808897]" />

            <CustomInput
              aria-label="Search transactions"
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by user name or email..."
            />
          </div>

          <AdminFilterPopover
            title="Filter transactions"
            activeCount={Number(Boolean(planFilter)) + Number(Boolean(statusFilter)) + Number(Boolean(date?.from))}
            onReset={() => { setPlanFilter(""); setStatusFilter(""); setDate(undefined); setPage(1); }}
          >
            <CustomSelect
              label="Plan"
              value={planFilter || "default"}
              onChange={(value: string) => { setPlanFilter(value === "default" ? "" : value); setPage(1); }}
              options={[{ label: "All Plans", value: "default" }, ...planOptions]}
            />
            <CustomSelect
              label="Status"
              value={statusFilter || "default"}
              onChange={(value: string) => { setStatusFilter(value === "default" ? "" : value); setPage(1); }}
              options={[
                { label: "All Status", value: "default" },
                { label: "Pending", value: "pending" },
                { label: "Completed", value: "succeeded" },
                { label: "Failed", value: "failed" },
                { label: "Refunded", value: "refunded" },
              ]}
            />
            <DateRangePicker label="Date range" date={date} setDate={(range) => { setDate(range); setPage(1); }} placeholder="Select Date Range" />
          </AdminFilterPopover>
          </div>}
        />
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-gray-400">
          Loading transactions...
        </p>
      ) : isError ? (
        <div role="alert" className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>Failed to load transactions.</span>
          <button type="button" onClick={() => refetch()} className="font-semibold underline">Retry</button>
        </div>
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
          <DataTable columns={columns} data={transactions} />
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={current_page || 1}
        pageSize={perPage}
        total={total || 0}
        totalPages={last_page || 1}
        onPageChange={setPage}
      />

    </div>
  );
}
