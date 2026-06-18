"use client";

import { useGetPublicationsOneQuery } from "@/feature/slice/biotechnologySlice";
import { useGetNeurosciencePublicationsOneQuery } from "@/feature/slice/neuroscienceSlice";
import { IndustryDataType } from "@/lib/type";
import { usePathname } from "next/navigation";
import { PublicationsList } from "./PublicationsList";

export default function PublicationSectionPart() {
  const pathName = usePathname();
  const { data } =
    pathName === "/mu/neuroscience-network/industry/publications"
      ? useGetNeurosciencePublicationsOneQuery("publications")
      : useGetPublicationsOneQuery("publications");

  return (
    <div className="flex w-full flex-col min-w-0">
      <div className="flex w-full flex-col items-stretch gap-10 pt-2 lg:w-138.5">
        {data?.data?.sections?.map((section: IndustryDataType) => (
          <div
            className="flex w-full flex-col items-stretch gap-6"
            key={section?.id}
          >
            {/* <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              {section?.name || "Section Title"}
            </h3> */}
            <PublicationsList industryData={section.industry_category} />
          </div>
        ))}
      </div>
    </div>
  );
}
