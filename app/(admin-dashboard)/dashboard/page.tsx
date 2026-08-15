import { RevenueReportCard } from "@/app/(Frond-End)/_components/adminDashboard/dashboard/RevenieReportCard";
import StatusCard from "@/app/(Frond-End)/_components/adminDashboard/dashboard/StatusCard";
import { TotalRevenuePieCard } from "@/app/(Frond-End)/_components/adminDashboard/dashboard/TotalReveniewCard";
import { UserGrowthCard } from "@/app/(Frond-End)/_components/adminDashboard/dashboard/UserGrothCard";

export default function page() {
    return (
        <div>
            <div>
                <StatusCard />
            </div>
            <div className="flex">
                <div>
                    <RevenueReportCard />
                </div>
                <div>
                    <UserGrowthCard />
                </div>
                <div>
                    <TotalRevenuePieCard />
                </div>
            </div>

        </div>
    )
}
