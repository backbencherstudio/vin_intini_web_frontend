"use client";

import { useGetBoostPackagesQuery } from "@/feature/slice/admin/boost/boostApi";

const formatMoney = (val?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(Number(val)) ? Number(val) : 0);

export default function AdvertisementStatusCard() {
  const { data, isLoading, isError } = useGetBoostPackagesQuery();
  const overview = data?.overview;

  const cards = [
    {
      label: "Total Packages",
      value: overview?.total_packages != null ? overview.total_packages.toLocaleString() : "—",
      subtitle: `${overview?.active_packages ?? 0} active packages`,
    },
    {
      label: "Active Packages",
      value: overview?.active_packages != null ? overview.active_packages.toLocaleString() : "—",
      subtitle: "Available for advertisers",
    },
    {
      label: "Preset Package Purchases",
      value:
        overview?.preset_packages?.total_purchased_count != null
          ? overview.preset_packages.total_purchased_count.toLocaleString()
          : "—",
      subtitle: `${formatMoney(overview?.preset_packages?.total_revenue)} revenue • ${overview?.preset_packages?.live_campaigns_count ?? 0} live`,
    },
    {
      label: "Custom Boost Purchases",
      value:
        overview?.custom_packages?.total_purchased_count != null
          ? overview.custom_packages.total_purchased_count.toLocaleString()
          : "—",
      subtitle: `${formatMoney(overview?.custom_packages?.total_revenue)} revenue • ${overview?.custom_packages?.live_campaigns_count ?? 0} live`,
    },
  ];

  return (
    <div>
      {isError ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Boost package metrics could not be loaded.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-gray-200/80 bg-white p-4"
          >
            <p className="text-[13px] font-medium text-[#777980]">{card.label}</p>
            <p className="py-2.5 text-[26px] xl:text-[28px] font-semibold leading-[125%] text-headerColor">
              {isLoading ? "—" : card.value}
            </p>
            <p className="text-[12px] text-[#777980] truncate" title={card.subtitle}>
              {isLoading ? "Loading..." : card.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
