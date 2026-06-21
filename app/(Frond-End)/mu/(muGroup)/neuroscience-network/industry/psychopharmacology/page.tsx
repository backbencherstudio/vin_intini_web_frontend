"use client";
import { useGetNeuroscienceOneQuery } from "@/feature/slice/neuroscienceSlice";
import { IndustryHeader } from "../_components";

import IndustrySkleton from "@/components/reusable/All Skleton/IndustrySkleton";
import { IndustryDataType } from "@/lib/type";
import { MedicationGrid } from "../../../psychology-network/industry/psychopharmacology/_components";

export default function PsychopharmacologyPage() {
  const { data, isLoading } = useGetNeuroscienceOneQuery("psychopharmacology");
  return (
    <div className=" w-full ">
      <div className="">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          <IndustryHeader
            title="Psychopharmacology & Psychotropics"
            description="Explore the latest psychopharmacology and psychotropic releases advancing brain health research and treatment."
          />
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col items-start gap-10 pt-6">
          {isLoading ? (
            <IndustrySkleton />
          ) : (
            data?.data?.sections?.map((section: IndustryDataType) => (
              <div
                className="flex w-full flex-col  gap-6"
                key={section?.id}
              >
                <h3 className=" font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
                  {section?.name || "Section Title"}
                </h3>
                <MedicationGrid industryData={section.industry_category} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
