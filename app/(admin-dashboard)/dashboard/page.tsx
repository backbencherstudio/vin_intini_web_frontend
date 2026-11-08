"use client";

import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import PendingApproval from "@/app/(Front-End)/_components/adminDashboard/dashboard/PendingApproval";
import RecentlyActivity from "@/app/(Front-End)/_components/adminDashboard/dashboard/RecentlyActivity";
import RevenueReportCard from "@/app/(Front-End)/_components/adminDashboard/dashboard/RevenieReportCard";
import StatusCard from "@/app/(Front-End)/_components/adminDashboard/dashboard/StatusCard";
import TotalRevenuePieCard from "@/app/(Front-End)/_components/adminDashboard/dashboard/TotalReveniewCard";
import UserGrowthCard from "@/app/(Front-End)/_components/adminDashboard/dashboard/UserGrothCard";
import { useGetAdminDashboardQuery } from "@/feature/slice/admin/dashboard/adminDashboardApi";

export default function Page() {
  const [revenueDateRange, setRevenueDateRange] = useState<DateRange | undefined>(undefined);

  const queryParams = useMemo(() => {
    if (!revenueDateRange?.from) return undefined;
    const fromStr = revenueDateRange.from.toISOString().slice(0, 10);
    const toStr = revenueDateRange.to
      ? revenueDateRange.to.toISOString().slice(0, 10)
      : fromStr;
    return { date_from: fromStr, date_to: toStr };
  }, [revenueDateRange]);

  const {
    data: dashboardResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminDashboardQuery(queryParams);

  const dashboardData = dashboardResponse?.data;

  return (
    <div className="space-y-6">
      <div>
        <StatusCard
          data={dashboardData?.status_cards}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="w-full">
          <RevenueReportCard
            data={dashboardData?.revenue_report}
            isLoading={isFetching}
            onRefresh={refetch}
            onDateRangeChange={setRevenueDateRange}
          />
        </div>
        <div className="w-full">
          <UserGrowthCard
            data={dashboardData?.user_growth}
            isLoading={isFetching}
            onRefresh={refetch}
          />
        </div>
        <div className="w-full">
          <TotalRevenuePieCard
            data={dashboardData?.total_revenue_breakdown}
            isLoading={isFetching}
            onRefresh={refetch}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <PendingApproval
            data={dashboardData?.pending_approvals}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <RecentlyActivity
            activities={dashboardData?.recent_activities}
            isLoading={isFetching}
            onRefresh={refetch}
          />
        </div>
      </div>
    </div>
  );
}
