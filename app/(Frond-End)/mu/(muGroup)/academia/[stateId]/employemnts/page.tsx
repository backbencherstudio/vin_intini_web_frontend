"use client"

import { useEffect, useState } from "react"
import AcademiHeader from "../_components/AcademiHeader";
import EmploymentCard from "./_components/EmploymentCard";
import { opportunities, moreOpportunities } from "@/public/demoData/DemoData";
import Pagination from "@/components/reusable/Pagination";
import EmploymentLoading from "./_components/EmploymentLoading";


export default function page() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }
            , 2000);
        return () => clearTimeout(timer);
    }, [])

    if (isLoading) {
        return (
            <EmploymentLoading />
        )
    }


    return (
        <div className="">
            <div className="lg:pl-6">
                <AcademiHeader
                    title="Employment Opportunities in Arizona"
                />
            </div>
            <div className="space-y-6">
                <div className="w-full flex flex-col lg:flex-row">
                    <div className="flex-1 space-y-4 xl:space-y-6 px-0 py-6 lg:py-0 lg:px-6 lg:border-r border-[#A5A5AB]">
                        <div className="flex items-center gap-1 p-2 bg-bgColor rounded">
                            <h2 className="text-blackColor text-base font-semibold leading-[150%] tracking-[0.08px]">State and Institution Offerings</h2>
                            <p className="text-[#777980] text-base font-normal leading-[150%] tracking-[0.08px]">{`(${100} Offerings)`}</p>
                        </div>
                        <div className="space-y-4">
                            {opportunities.map((opportunity, index) => (
                                <EmploymentCard key={opportunity.id} data={opportunity} />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 xl:space-y-6 px-0 py-6 lg:py-0 lg:px-6">
                        <div className="flex items-center gap-1 p-2 bg-bgColor rounded">
                            <h2 className="text-blackColor text-base font-semibold leading-[150%] tracking-[0.08px]">Private Practice Offerings</h2>
                            <p className="text-[#777980] text-base font-normal leading-[150%] tracking-[0.08px]">{`(${100} Offerings)`}</p>
                        </div>
                        <div className="space-y-4">
                            {moreOpportunities.map((opportunity, index) => (
                                <EmploymentCard key={opportunity.id} data={opportunity} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:px-6">
                    <Pagination
                        total={10}
                        page={1}
                        totalPages={1}
                        pageSize={10}
                        onPageChange={() => console.log("Page changed.")}
                    />
                </div>
            </div>
        </div>
    )
}