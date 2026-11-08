"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { RotateCw, ArrowUp, ArrowDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/reusable/dashboard/DateRangePicker";
import type { RevenueReportData } from "@/feature/slice/admin/dashboard/adminDashboardApi";

interface RevenueReportCardProps {
  data?: RevenueReportData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onDateRangeChange?: (date: DateRange | undefined) => void;
}

const defaultData: RevenueReportData = {
  totalRevenue: 60379.0,
  growthRate: 4.3,
  direction: "up",
  dateRange: "Jun 25 - Jul 04, 2026",
  chartData: [
    {
      dateLabel: "June 04, 2026",
      dateStr: "June 08, 2026",
      comparisonDateStr: "July 08, 2026",
      currentPeriod: 8.5,
      lastPeriod: 3.5,
    },
    {
      dateLabel: "",
      dateStr: "June 10, 2026",
      comparisonDateStr: "July 10, 2026",
      currentPeriod: 9.0,
      lastPeriod: 3.2,
    },
    {
      dateLabel: "",
      dateStr: "June 12, 2026",
      comparisonDateStr: "July 12, 2026",
      currentPeriod: 6.5,
      lastPeriod: 4.2,
    },
    {
      dateLabel: "",
      dateStr: "June 14, 2026",
      comparisonDateStr: "July 14, 2026",
      currentPeriod: 9.5,
      lastPeriod: 3.3,
    },
    {
      dateLabel: "",
      dateStr: "June 16, 2026",
      comparisonDateStr: "July 16, 2026",
      currentPeriod: 7.0,
      lastPeriod: 4.6,
    },
    {
      dateLabel: "",
      dateStr: "June 18, 2026",
      comparisonDateStr: "July 18, 2026",
      currentPeriod: 8.2,
      lastPeriod: 4.9,
    },
    {
      dateLabel: "",
      dateStr: "June 20, 2026",
      comparisonDateStr: "July 20, 2026",
      currentPeriod: 8.5,
      lastPeriod: 4.5,
    },
    {
      dateLabel: "",
      dateStr: "June 22, 2026",
      comparisonDateStr: "July 22, 2026",
      currentPeriod: 6.2,
      lastPeriod: 2.5,
    },
    {
      dateLabel: "",
      dateStr: "June 24, 2026",
      comparisonDateStr: "July 24, 2026",
      currentPeriod: 8.0,
      lastPeriod: 4.2,
    },
    {
      dateLabel: "",
      dateStr: "June 26, 2026",
      comparisonDateStr: "July 26, 2026",
      currentPeriod: 9.0,
      lastPeriod: 3.2,
    },
    {
      dateLabel: "Jul 04, 2026",
      dateStr: "July 04, 2026",
      comparisonDateStr: "August 04, 2026",
      currentPeriod: 9.2,
      lastPeriod: 2.8,
    },
  ],
};

export default function RevenueReportCard({
  data = defaultData,
  isLoading = false,
  onRefresh = () => {},
  onDateRangeChange,
}: RevenueReportCardProps) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const report = data && data.chartData ? data : defaultData;
  const isDown = report.direction === "down";

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onDateRangeChange?.(newDate);
  };

  // Find max value to calibrate YAxis
  const maxVal = Math.max(
    ...report.chartData.map((d) => Math.max(d.currentPeriod || 0, d.lastPeriod || 0)),
    10
  );
  const yDomainMax = Math.ceil(maxVal * 1.15);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 w-full h-full flex flex-col justify-between shadow-2xs">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <h3 className="text-[#0D0D12] text-[18px] font-semibold leading-[150%]">
          Revenue Report
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-auto">
            <DateRangePicker
              date={date}
              setDate={handleDateChange}
              placeholder="Select date range"
              className="h-8 text-xs w-full"
            />
          </div>
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh revenue data"
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Metric & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-baseline space-x-3">
          <h4 className="text-[#0D0D12] text-[24px] font-semibold leading-[130%] tracking-[0.12px]">
            ${Number(report.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
          <div
            className={`flex items-center text-[14px] font-semibold leading-[150%] tracking-[0.28px] ${
              isDown ? "text-red-500" : "text-primaryColor"
            }`}
          >
            {isDown ? (
              <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
            )}
            {report.growthRate}%
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span className="text-gray-600">This period</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" />
            <span className="text-gray-600">Last period</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full min-h-[260px]">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primaryColor border-t-transparent" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={report.chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="currentPeriodGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#F3F4F6"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="dateLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                domain={[0, yDomainMax]}
                tickFormatter={(val) => `$${val}K`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 shadow-xl rounded-xl border border-gray-100 text-xs w-48 space-y-1.5">
                        <p className="font-bold text-gray-900 border-b pb-1">
                          Revenue Comparison
                        </p>
                        <div className="flex justify-between items-center text-gray-600">
                          <span>{payload[0]?.payload?.dateStr}</span>
                          <span className="font-bold text-amber-500">
                            ${payload[0]?.value}K
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span>{payload[1]?.payload?.comparisonDateStr}</span>
                          <span className="font-bold text-teal-600">
                            ${payload[1]?.value}K
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="currentPeriod"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#currentPeriodGrad)"
              />
              <Area
                type="monotone"
                dataKey="lastPeriod"
                stroke="#00A8B5"
                strokeWidth={2.5}
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
