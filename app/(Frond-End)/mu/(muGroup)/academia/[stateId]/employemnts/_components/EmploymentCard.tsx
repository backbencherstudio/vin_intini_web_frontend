import { EmpOpportunityType } from "@/lib/type";
import { Employment } from "../page";
import {format, formatDistanceToNow} from "date-fns";
import { formatNumberIntoK } from "@/lib/utils";

type PropType = {
    data: Employment
}

export default function EmploymentCard({ data }: PropType) {
    return (
        <div className="p-4 sm:p-5 bg-white border border-[#D2D2D5] rounded-2xl space-y-3 hover:shadow-md transition-all duration-300">

            {/* Top section */}
            <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-base sm:text-lg font-semibold text-headerColor">{data?.company_name || "Company Name"}</h2>
                    <p className="text-sm text-gray-500">{data?.location || "Location"}</p>
                </div>

                <p className="text-[#777980] text-xs sm:text-sm font-normal leading-[140%] tracking-[0.07px]">
                    {data?.created_at ? formatDistanceToNow(new Date(data.created_at), { addSuffix: true }) : "0 min ago"}
                </p>
            </div>

            {/* Job title */}
            <h2 className="text-lg sm:text-xl font-semibold text-headerColor">{data?.title || "Job title"}</h2>

            {/* Bottom section */}
            <div className="flex flex-row items-center justify-between gap-3">

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <p className="px-2 py-1 rounded-lg bg-sectionColor text-[#777980] text-xs sm:text-sm font-semibold capitalize">
                        {data?.employment_type || "Full-time"}
                    </p>
                    <p className="px-2 py-1 rounded-lg bg-sectionColor text-[#777980] text-xs sm:text-sm font-semibold capitalize">
                        {data?.work_mode || "Hybrid"}
                    </p>
                    <p className="px-2 py-1 rounded-lg bg-sectionColor text-[#777980] text-xs sm:text-sm font-semibold">
                        {data?.salary_min && data?.salary_max ? `$${formatNumberIntoK({ value: data.salary_min })} - $${formatNumberIntoK({ value: data.salary_max })}` : "$0 - $0"}
                    </p>
                </div>

                {/* Button */}
                <button
                    type="button"
                    disabled={true}
                    title="View details coming soon"
                    className="px-4 py-1 bg-white border border-[#A7EADE] rounded-lg text-buttonColor hover:bg-buttonColor hover:text-[#A7EADE] duration-300 text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
                >
                    View
                </button>
            </div>
        </div>
    );
}