"use client";

import { useGetPsychologyOneQuery } from "@/feature/slice/biotechnologySlice";
import { IndustryHeader } from "../_components";
import { MedicationGrid } from "./_components";
import { IndustryDataType } from "@/lib/type";

export default function PsychopharmacologyPage() {
  const { data ,isLoading } = useGetPsychologyOneQuery("psychopharmacology");
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-1 flex-col">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          <IndustryHeader
            title="Psychopharmacology"
            description="Explore the latest psychopharmacology and psychotropic releases advancing brain health research and treatment."
          />
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col items-start gap-10 pt-6">
         {data?.data?.sections?.map((section: IndustryDataType) => (
            <div
              className="flex w-full flex-col items-stretch gap-6"
              key={section?.id}
            >
              <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
                {section?.name || "Section Title"}
              </h3>
              <MedicationGrid industryData={section.industry_category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
