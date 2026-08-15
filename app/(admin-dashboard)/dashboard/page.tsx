"use client"

import PendingApproval from "@/app/(Frond-End)/_components/adminDashboard/dashboard/PendingApproval";
import RecentlyActivity from "@/app/(Frond-End)/_components/adminDashboard/dashboard/RecentlyActivity";
import RevenueReportCard from "@/app/(Frond-End)/_components/adminDashboard/dashboard/RevenieReportCard";
import StatusCard from "@/app/(Frond-End)/_components/adminDashboard/dashboard/StatusCard";
import TotalRevenuePieCard from "@/app/(Frond-End)/_components/adminDashboard/dashboard/TotalReveniewCard";
import UserGrowthCard from "@/app/(Frond-End)/_components/adminDashboard/dashboard/UserGrothCard";

export default function page() {
    return (
        <div>
            <div>
                <StatusCard />
            </div>
            <div className="flex flex-col md:flex-row w-full gap-6 h-full py-6">
                <div className="w-full">
                    <RevenueReportCard />
                </div>
                <div className="w-full">
                    <UserGrowthCard />
                </div>
                <div className="w-full">
                    <TotalRevenuePieCard onRefresh={() => { }} />
                </div>
            </div>
            <div className="flex h-full w-full flex-col gap-6 py-6 md:flex-row">
                <div className="w-full md:max-w-[600px] h-full">
                    <PendingApproval />
                </div>

                <div className="w-full  ">
                    <RecentlyActivity />
                </div>
            </div>

        </div>
    )
}
