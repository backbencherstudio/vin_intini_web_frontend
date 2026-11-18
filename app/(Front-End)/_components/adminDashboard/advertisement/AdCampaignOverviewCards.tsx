"use client";

import { IoArrowForward } from "react-icons/io5";
import {
  AdminAdCampaignOverview,
  AdminAdCampaignStatus,
} from "@/feature/slice/admin/boost/boostApi";

interface AdCampaignOverviewCardsProps {
  overview?: AdminAdCampaignOverview;
  isLoading?: boolean;
  activeStatus?: AdminAdCampaignStatus;
  onSelectStatus?: (status: AdminAdCampaignStatus) => void;
}

const formatMoney = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(val) ? val : 0);

export default function AdCampaignOverviewCards({
  overview,
  isLoading,
  activeStatus = "all",
  onSelectStatus,
}: AdCampaignOverviewCardsProps) {
  if (isLoading && !overview) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-white p-4 border border-gray-200/80 animate-pulse"
          >
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-8 w-28 rounded bg-gray-200 my-3" />
            <div className="h-4 w-36 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  const cards: {
    key: string;
    label: string;
    value: string;
    subtitle: string;
    clickStatus?: AdminAdCampaignStatus;
  }[] = [
    {
      key: "live_campaigns",
      label: "Live Campaigns",
      value: (overview?.live_campaigns ?? 0).toLocaleString(),
      subtitle: `${overview?.paused_campaigns ?? 0} paused • ${overview?.total_campaigns ?? 0} total`,
      clickStatus: "active",
    },
    {
      key: "boost_revenue",
      label: "Boost Revenue",
      value: formatMoney(overview?.total_revenue ?? 0),
      subtitle: `Preset: ${formatMoney(overview?.preset_revenue ?? 0)} • Custom: ${formatMoney(overview?.custom_revenue ?? 0)}`,
      clickStatus: "all",
    },
    {
      key: "impressions",
      label: "Total Impressions",
      value: (overview?.total_impressions ?? 0).toLocaleString(),
      subtitle: `Across ${(overview?.total_campaigns ?? 0).toLocaleString()} campaigns`,
    },
    {
      key: "clicks",
      label: "Total Clicks",
      value: (overview?.total_clicks ?? 0).toLocaleString(),
      subtitle: `${overview?.completed_campaigns ?? 0} completed • ${overview?.cancelled_campaigns ?? 0} cancelled`,
    },
    {
      key: "avg_ctr",
      label: "Average CTR",
      value: `${(overview?.avg_ctr ?? 0).toFixed(2)}%`,
      subtitle: `${overview?.preset_count ?? 0} preset • ${overview?.custom_count ?? 0} custom`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const isHighlighted =
          card.clickStatus === "active" && activeStatus === "active";

        return (
          <div
            key={card.key}
            onClick={() => {
              if (card.clickStatus && onSelectStatus) {
                onSelectStatus(card.clickStatus);
              }
            }}
            className={`rounded-lg bg-white p-4 border transition-all ${
              card.clickStatus && onSelectStatus
                ? "cursor-pointer hover:border-[#04A1B7]/60 hover:shadow-xs"
                : ""
            } ${
              isHighlighted
                ? "border-[#04A1B7] ring-1 ring-[#04A1B7]/25"
                : "border-gray-200/80"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[#777980] text-[13px] font-medium leading-[19.6px] truncate">
                {card.label}
              </h3>
              <IoArrowForward
                className={`shrink-0 ${
                  isHighlighted ? "text-[#04A1B7]" : "text-[#777980]"
                }`}
              />
            </div>

            <p className="text-headerColor text-[26px] xl:text-[28px] font-semibold leading-[125%] py-2.5 truncate">
              {card.value}
            </p>

            <p
              className="text-[#777980] text-[12px] font-normal leading-[135%] truncate"
              title={card.subtitle}
            >
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
