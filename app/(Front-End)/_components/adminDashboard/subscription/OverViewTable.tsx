"use client";

import DataTable, { type Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import { DateRangePicker } from "@/components/reusable/dashboard/DateRangePicker";
import Pagination from "@/components/reusable/Pagination";
import {
  useCancelSubscriptionMutation,
  useGetMySubscribersQuery,
  useGetPlansQuery,
} from "@/feature/slice/admin/subscription/subscriptionApi";
import type {
  Plan,
  Subscription,
} from "@/feature/slice/admin/subscription/subscriptionType";
import userIcon from "@/public/images/admin/parterner.png";
import { SearchIcon } from "lucide-react";
import { format as formatDate } from "date-fns";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import toast from "react-hot-toast";

type SubscriptionRow = {
  id: number;
  img: string;
  subscriber: string;
  plan: string;
  billingCycle: string | null;
  nextBilling: string | null;
  amount: string;
  daysLeft: number | null;
  status: string;
  joined: string;
  cancelAtPeriodEnd: boolean;
};

const formatTableDate = (value?: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : formatDate(parsed, "dd MMM yyyy");
};

export default function OverViewTable() {
  const [page, setPage] = useState(1);
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [search, setSearch] = useState("");
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionRow | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const queryParams: Record<string, unknown> = { page, per_page: 10 };
  if (planFilter) queryParams.plan_id = planFilter;
  if (statusFilter) queryParams.status = statusFilter;
  if (date?.from) queryParams.date_from = formatDate(date.from, "yyyy-MM-dd");
  if (date?.to) queryParams.date_to = formatDate(date.to, "yyyy-MM-dd");
  if (search.trim()) queryParams.search = search.trim();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMySubscribersQuery({ query: queryParams });
  const { data: plansResponse } = useGetPlansQuery();
  const [cancelSubscription, { isLoading: isCanceling }] =
    useCancelSubscriptionMutation();

  const planOptions = [
    { label: "All Plans", value: "default" },
    ...(plansResponse?.data ?? []).map((plan: Plan) => ({
      label: plan.name,
      value: plan.id,
    })),
  ];

  const rows: SubscriptionRow[] = useMemo(
    () =>
      (response?.data ?? []).map((subscription: Subscription) => ({
        id: subscription.id,
        img: subscription.subscriber?.image || userIcon.src,
        subscriber: subscription.subscriber?.name || "Unknown",
        plan: subscription.plan?.name || "—",
        billingCycle:
          subscription.billing_cycle || subscription.plan?.billing_cycle || null,
        nextBilling: subscription.next_billing_date,
        amount: subscription.plan?.amount || "0",
        daysLeft: subscription.days_left,
        status: subscription.status,
        joined: subscription.joined_at,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      })),
    [response?.data],
  );

  const total = response?.pagination?.total ?? rows.length;
  const pageSize = response?.pagination?.per_page ?? 10;
  const totalPages = response?.pagination?.last_page ?? 0;
  const cancelSelectedSubscription = async () => {
    if (!selectedSubscription) return;
    try {
      const result = await cancelSubscription({ id: selectedSubscription.id }).unwrap();
      toast.success(result.message || "Subscription cancellation requested.");
      setConfirmCancel(false);
      setSelectedSubscription(null);
    } catch (error) {
      const message =
        typeof error === "object" && error && "data" in error
          ? (error.data as { message?: string })?.message
          : undefined;
      toast.error(message || "Failed to cancel this subscription.");
    }
  };

  const columns: Column<SubscriptionRow>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="text-gray-500">
          {((response?.pagination?.current_page ?? page) - 1) * pageSize +
            rows.findIndex((item) => item.id === row.id) +
            1}
        </span>
      ),
    },
    {
      header: "Subscribers",
      accessor: "subscriber",
      cell: (row) => (
        <span className="flex items-center gap-2 whitespace-nowrap font-medium text-[#0A0A0A]">
          <Image
            src={row.img}
            alt={`${row.subscriber} profile`}
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
          {row.subscriber}
        </span>
      ),
    },
    {
      header: "Plan",
      accessor: "plan",
      cell: (row) => (
        <CustomBadge color="gray" className="font-medium">
          {row.plan}
        </CustomBadge>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const label = row.status.replaceAll("_", " ");
        return row.status === "active" ? (
          <CustomBadge color="active">
            {row.cancelAtPeriodEnd ? "Canceling" : "Active"}
          </CustomBadge>
        ) : (
          <CustomBadge color="suspended">{label}</CustomBadge>
        );
      },
    },
    {
      header: "Billing Cycle",
      cell: (row) => row.billingCycle || "—",
    },
    {
      header: "Next Billing",
      cell: (row) => (
        <div className="flex flex-col">
          <span>{formatTableDate(row.nextBilling)}</span>
          {row.daysLeft !== null && row.nextBilling && (
            <span className="text-xs text-grayColor1">
              {row.daysLeft > 0 ? `In ${row.daysLeft} days` : "Due today"}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (row) => (
        <span className="whitespace-nowrap">
          ${row.amount} / {row.billingCycle === "yearly" ? "year" : row.billingCycle === "monthly" ? "month" : "—"}
        </span>
      ),
    },
    { header: "Joined", cell: (row) => formatTableDate(row.joined) },
    {
      header: "Action",
      cell: (row) => (
        <button
          type="button"
          disabled={row.status !== "active" || row.cancelAtPeriodEnd || isCanceling}
          onClick={() => {
            setSelectedSubscription(row);
            setConfirmCancel(true);
          }}
          className="rounded-md bg-red-500/80 px-3 py-1.5 text-white hover:bg-red-500/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {row.cancelAtPeriodEnd ? "Scheduled" : row.status === "active" ? "Cancel" : "—"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <CustomTitleDescription
          title="Overview"
          description={`${total.toLocaleString()} Subscriptions`}
          className="ml-2 shrink-0"
        />
        <div className="flex w-full flex-col items-start gap-4 lg:w-auto lg:flex-row lg:items-center">
          <div className="relative w-full lg:w-[260px] lg:shrink-0">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808897]" />
            <CustomInput
              aria-label="Search subscriptions"
              className="pl-9"
              placeholder="Search by user name or email..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <CustomSelect
            className="h-[38px] text-nowrap lg:w-[150px] lg:shrink-0"
            value={planFilter || "default"}
            onChange={(value) => {
              setPlanFilter(value === "default" ? "" : String(value));
              setPage(1);
            }}
            options={planOptions}
            placeholder="All Plans"
          />
          <CustomSelect
            className="h-[38px] text-nowrap lg:w-[150px] lg:shrink-0"
            value={statusFilter || "default"}
            onChange={(value) => {
              setStatusFilter(value === "default" ? "" : String(value));
              setPage(1);
            }}
            options={[
              { label: "All Status", value: "default" },
              { label: "Active", value: "active" },
              { label: "Canceled", value: "canceled" },
              { label: "Past due", value: "past_due" },
              { label: "Expired", value: "expired" },
              { label: "Trialing", value: "trialing" },
            ]}
          />
          <DateRangePicker
            className="h-[38px] lg:w-[210px] lg:shrink-0"
            date={date}
            setDate={(range) => {
              setDate(range);
              setPage(1);
            }}
            placeholder="Select date range"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-grayColor1">
          Loading subscriptions…
        </p>
      ) : isError ? (
        <div
          role="alert"
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>Failed to load subscriptions.</span>
          <button type="button" onClick={() => refetch()} className="font-semibold underline">
            Retry
          </button>
        </div>
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
          <DataTable columns={columns} data={rows} />
          {total > 0 && (
            <Pagination
              page={response?.pagination?.current_page ?? page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      <CustomModal
        title="Do you want to cancel this subscription?"
        open={confirmCancel}
        onOpenChange={(open) => !open && !isCanceling && setConfirmCancel(false)}
        size="xsm"
      >
        <div className="space-y-5 p-3">
          <p className="text-sm leading-6 text-grayColor1">
            Cancellation timing depends on the subscription’s billing provider.
            The server will apply its supported cancellation behavior.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={isCanceling}
              onClick={() => setConfirmCancel(false)}
              className="h-9 rounded-md border border-borderColor px-4 text-sm text-grayColor1 disabled:opacity-50"
            >
              Keep subscription
            </button>
            <button
              type="button"
              disabled={isCanceling}
              onClick={cancelSelectedSubscription}
              className="h-9 rounded-md bg-red-500 px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              {isCanceling ? "Canceling…" : "Cancel subscription"}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
