"use client";

import { useEffect, useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";
import EmploymentCard from "./_components/EmploymentCard";
import { opportunities, moreOpportunities } from "@/public/demoData/DemoData";
import Pagination from "@/components/reusable/Pagination";
import EmploymentLoading from "./_components/EmploymentLoading";
import { useGetEmploymentsQuery } from "@/feature/slice/academia/academiaSlice";
import { useParams } from "next/navigation";
import { StateNames, usaStateKeyToNameMap } from "@/public/staticData";

export type Employment = {
  category: "state_institution" | "private_practice";
  company_name: string;
  created_at: string;
  employment_type: string;
  id: number;
  latitude: string;
  location: string;
  longitude: string;
  salary_max: string;
  salary_min: string;
  state_id: number;
  title: string;
  updated_at: string;
  work_mode: string;
};

export default function page() {
  const { stateId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = useGetEmploymentsQuery({
    id: stateId,
    perPage: 10,
    page: currentPage,
    sort: "asc",
  });

  useEffect(() => {
    console.log("Employments data:", data);
  }, [data]);

  if (isLoading) {
    return <EmploymentLoading />;
  }

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr]">
      <div className="lg:pl-6">
        <AcademiHeader
          title={`Employment Opportunities in ${StateNames[stateId as string]}`}
        />
      </div>
      <div className="space-y-6 grid grid-rows-[1fr_auto] gap-6">
        <div className="w-full flex flex-col lg:flex-row h-full min-h-50">
          <div className="flex-1 grid grid-rows-[auto_1fr] space-y-4 xl:space-y-6 px-0 py-6 lg:py-0 lg:px-6 lg:border-r border-[#A5A5AB] h-full">
            <div className="flex items-center gap-1 p-2 bg-bgColor rounded">
              <h2 className="text-blackColor text-base font-semibold leading-[150%] tracking-[0.08px]">
                State and Institution Offerings
              </h2>
              <p className="text-[#777980] text-base font-normal leading-[150%] tracking-[0.08px]">{`(${data?.data?.state_institution?.total_offerings || 0} Offerings)`}</p>
            </div>
            {data?.data?.state_institution?.items?.length > 0 ? (
              <div className="space-y-4">
                {data?.data?.state_institution?.items?.map(
                  (opportunity: Employment, index: number) => (
                    <EmploymentCard key={opportunity.id} data={opportunity} />
                  ),
                )}
              </div>
            ) : (
              <div>
                <p className="text-center text-gray-500 w-full h-full flex items-center justify-center">
                  No state institution offerings available.
                </p>
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-rows-[auto_1fr] space-y-4 xl:space-y-6 px-0 py-6 lg:py-0 lg:px-6">
            <div className="flex items-center gap-1 p-2 bg-bgColor rounded">
              <h2 className="text-blackColor text-base font-semibold leading-[150%] tracking-[0.08px]">
                Private Practice Offerings
              </h2>
              <p className="text-[#777980] text-base font-normal leading-[150%] tracking-[0.08px]">{`(${data?.data?.private_practice?.total_offerings || 0} Offerings)`}</p>
            </div>
            {data?.data?.private_practice?.items?.length > 0 ? (
              <div className="space-y-4">
                {data?.data?.private_practice?.items?.map(
                  (opportunity: Employment, index: number) => (
                    <EmploymentCard key={opportunity.id} data={opportunity} />
                  ),
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-center text-gray-500">
                  No private practice offerings available.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:px-6">
          <Pagination
            total={data?.total || 1}
            page={currentPage}
            totalPages={data?.total_page || 1}
            pageSize={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
