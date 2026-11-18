"use client";

import { useState } from "react";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { MdTrendingFlat } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";
import { useGetTransactionStatsQuery } from "@/feature/slice/admin/subscription/subscriptionApi";
import {
  TransactionPeriodFilter,
  TransactionStatus,
  TransactionTypeFilter,
} from "@/feature/slice/admin/subscription/subscriptionType";

interface TransactionStatusCardProps {
  activeType?: TransactionTypeFilter;
  onSelectType?: (type: TransactionTypeFilter) => void;
}

const formatCardValue = (value: number, format?: "currency" | "number") => {
  const safeVal = Number.isFinite(Number(value)) ? Number(value) : 0;
  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(safeVal);
  }
  return safeVal.toLocaleString("en-US");
};

export default function TransactionStatusCard({
  activeType = "all",
  onSelectType,
}: TransactionStatusCardProps) {
  const [period, setPeriod] = useState<TransactionPeriodFilter>("all");

  const { data: apiResponse, isLoading, isError, isFetching } =
    useGetTransactionStatsQuery({ type: activeType, period });

  const cardData: TransactionStatus[] = apiResponse?.data ?? [];

  const getClickableType = (key?: string): TransactionTypeFilter | null => {
    if (key === "total_revenue") return "all";
    if (key === "subscription_revenue") return "subscription";
    if (key === "boosting_revenue") return "boosting";
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Period Switcher Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs font-medium text-[#777980]">
          {period === "all"
            ? "Showing all-time financial summary"
            : "Showing current month vs previous month"}
        </p>
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setPeriod("all")}
            className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
              period === "all"
                ? "bg-[#04A1B7] text-white shadow-2xs"
                : "text-[#777980] hover:text-[#0A0A0A]"
            }`}
          >
            All Time
          </button>
          <button
            type="button"
            onClick={() => setPeriod("this_month")}
            className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
              period === "this_month"
                ? "bg-[#04A1B7] text-white shadow-2xs"
                : "text-[#777980] hover:text-[#0A0A0A]"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-lg bg-white p-4 border border-gray-200/80 animate-pulse"
            >
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="h-8 w-32 rounded bg-gray-200 my-3" />
              <div className="h-4 w-36 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load transaction stats.
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 transition-opacity ${
            isFetching ? "opacity-75" : ""
          }`}
        >
          {cardData.map((item, index) => {
            const isDown = item.direction === "down";
            const isFlat =
              item.direction === "flat" || item.change_percent === null;
            const Icon = isDown
              ? IoIosTrendingDown
              : isFlat
                ? MdTrendingFlat
                : IoIosTrendingUp;

            const clickType = getClickableType(item.key);
            const isHighlighted =
              (item.key === "subscription_revenue" && activeType === "subscription") ||
              (item.key === "boosting_revenue" && activeType === "boosting");

            return (
              <div
                key={item.key || index}
                onClick={() => {
                  if (clickType && onSelectType) {
                    onSelectType(clickType);
                  }
                }}
                className={`rounded-lg bg-white p-4 border transition-all ${
                  clickType && onSelectType
                    ? "cursor-pointer hover:border-[#04A1B7]/60 hover:shadow-xs"
                    : ""
                } ${
                  isHighlighted
                    ? "border-[#04A1B7] ring-1 ring-[#04A1B7]/25"
                    : "border-gray-200/80"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[#777980] text-[13px] font-medium leading-[19.6px] tracking-[0.07px] truncate">
                    {item.label}
                  </h3>
                  <IoArrowForward
                    className={`shrink-0 transition-transform ${
                      isHighlighted ? "text-[#04A1B7] translate-x-0.5" : "text-[#777980]"
                    }`}
                  />
                </div>

                <p className="text-headerColor text-[26px] xl:text-[28px] font-semibold leading-[125%] py-2.5 truncate">
                  {formatCardValue(item.value, item.format)}
                </p>

                {period === "all" && item.subtitle ? (
                  <p
                    className="text-[#777980] text-[12px] font-normal leading-[135%] truncate"
                    title={item.subtitle}
                  >
                    {item.subtitle}
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 rounded-full ${
                        isDown
                          ? "bg-[#FEECEE]"
                          : isFlat
                            ? "bg-[#F2F2F2]"
                            : "bg-[#E9FAF7]"
                      } px-1.5 py-0.5`}
                    >
                      <Icon
                        size={16}
                        className={
                          isDown
                            ? "text-[#EB3D4D] rotate-120"
                            : isFlat
                              ? "text-[#777980]"
                              : "text-primaryColor"
                        }
                      />
                      <span
                        className={`text-[11px] font-semibold leading-[132%] ${
                          isDown
                            ? "text-[#EB3D4D]"
                            : isFlat
                              ? "text-[#777980]"
                              : "text-primaryColor"
                        }`}
                      >
                        {item.change_percent !== null
                          ? `${item.change_percent}%`
                          : "0%"}
                      </span>
                    </div>
                    <p className="text-[#777980] text-[11px] font-normal truncate">
                      vs prev month
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
