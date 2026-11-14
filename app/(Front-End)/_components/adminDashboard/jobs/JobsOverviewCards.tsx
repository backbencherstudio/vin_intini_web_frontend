"use client";

import { Briefcase, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { AdminJobsSummary } from "@/feature/slice/admin/jobs";

interface JobsOverviewCardsProps {
  summary?: AdminJobsSummary;
  isLoading?: boolean;
}

export default function JobsOverviewCards({
  summary,
  isLoading = false,
}: JobsOverviewCardsProps) {
  const cards = [
    {
      id: "total",
      label: "Total Posted Jobs",
      value: summary?.total ?? 0,
      icon: Briefcase,
      color: "text-[#04A1B7]",
      bgColor: "bg-[#04A1B7]/10",
      borderColor: "border-[#04A1B7]/20",
    },
    {
      id: "published",
      label: "Active & Published",
      value: summary?.published ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      id: "expired",
      label: "Expired Listings",
      value: summary?.expired ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      id: "rejected",
      label: "Rejected Listings",
      value: summary?.rejected ?? 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <p className="text-xs font-medium text-gray-500">{card.label}</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <span className="inline-block h-7 w-14 animate-pulse rounded bg-gray-200" />
                ) : (
                  card.value.toLocaleString()
                )}
              </h3>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border ${card.borderColor} ${card.bgColor}`}
            >
              <Icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

