"use client";

import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import { useGetBoostPackagesQuery } from "@/feature/slice/admin/boost/boostApi";

export default function AdvertisementStatusCard() {
  const { data, isLoading, isError } = useGetBoostPackagesQuery();
  const overview = data?.overview;
  const cards = [
    { label: "Boost packages", value: overview?.total_packages },
    { label: "Active packages", value: overview?.active_packages },
    { label: "Live campaigns", value: overview?.live_campaigns_count },
    { label: "Boost revenue", value: overview?.total_ad_revenue, money: true },
    { label: "Impressions", value: overview?.total_impressions_delivered },
    { label: "Clicks", value: overview?.total_clicks_recorded },
  ];

  return <div>
    <CustomTitleDescription title="Boost management" description="Manage boost packages and monitor campaign delivery." />
    {isError ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Boost metrics could not be loaded.</p> : null}
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">{card.label}</p>
        <p className="mt-2 text-2xl font-semibold text-headerColor">{isLoading ? "—" : card.value == null ? "—" : card.money ? `$${Number(card.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : Number(card.value).toLocaleString()}</p>
      </div>)}
    </div>
  </div>;
}
