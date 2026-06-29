"use client";

import IndustrySkleton from "@/components/reusable/All Skleton/IndustrySkleton";
import { useGetNeuroscienceBiotechnologyQuery } from "@/feature/slice/neuroscienceSlice";
import { IndustryDataType } from "@/lib/type";
import { EquipmentGrid } from "../../../psychology-network/industry/biotechnology/_components";
import { IndustryHeader } from "../_components";

export default function BiotechnologyPage() {
  const { data, isLoading } =
    useGetNeuroscienceBiotechnologyQuery("biotechnology");
  return (
    <div className="">
      <div className="">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          <IndustryHeader
            title="Biotechnology"
            description="Explore the latest biotech equipment releases advancing brain health research and treatment."
          />
        </div>

        {/* Added min-w-0 to keep the Assessments inside the available width */}
        <div className="flex w-full flex-col  gap-10 py-6 ">
          {isLoading ? (
            <IndustrySkleton />
          ) : (
            data?.data?.sections?.map((section: IndustryDataType) => (
              <div
                className="flex w-full flex-col  gap-6"
                key={section?.id}
              >
                <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
                  {section?.name || "Section Title"}
                </h3>
                <EquipmentGrid industryData={section.industry_category} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
