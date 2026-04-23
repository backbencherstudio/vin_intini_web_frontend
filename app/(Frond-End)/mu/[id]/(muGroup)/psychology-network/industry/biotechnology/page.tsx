// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/page.tsx

"use client";

import { useState } from "react";
import { IndustryHeader } from "../_components";
import { EquipmentGrid } from "./_components";
import { AssessmentGrid } from "./_components/AssessmentGrid";
import { ApparatusGrid } from "./_components/ApparatusGrid";
import { LabInfrastructureGrid } from "./_components/LabInfrastructureGrid";
import { Filter } from "lucide-react";

export default function BiotechnologyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex lg:max-w-196.5 flex-col">
      <div className="flex w-full flex-1 flex-col">
        {/* Hide this header on mobile since it's in IndustrySidebar */}
        <div className="hidden md:block">
          <IndustryHeader
            onSearch={setSearchQuery}
            title="Biotechnology Industry"
            description="Explore the latest biotech equipment releases advancing brain health research and treatment."
          />
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col items-start gap-10 pt-6">
          {/* Section 1: Equipment */}
          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Neuroscientific and Psychophysiological Equipment
            </h3>
            <EquipmentGrid />
            <div className="flex w-full items-center justify-center">
              <button className="flex  items-center justify-center gap-1 rounded-lg border border-[#DFE1E7] px-3 py-1 md:hidden">
                <span className="font-['Segoe_UI'] text-sm text-[#4A4C56]">
                  Load more
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: Assessment Instruments */}
          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Psychological Assessment Instruments
            </h3>
            <AssessmentGrid />
            <div className="flex w-full items-center justify-center">
              <button className="flex  items-center justify-center gap-1 rounded-lg border border-[#DFE1E7] px-3 py-1 md:hidden">
                <span className="font-['Segoe_UI'] text-sm text-[#4A4C56]">
                  Load more
                </span>
              </button>
            </div>
          </div>

          {/* Section 3: Experimental Apparatus */}
          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Experimental Apparatus (Behavioral and Cognitive)
            </h3>
            <ApparatusGrid />
            <div className="flex w-full items-center justify-center">
              <button className="flex  items-center justify-center gap-1 rounded-lg border border-[#DFE1E7] px-3 py-1 md:hidden">
                <span className="font-['Segoe_UI'] text-sm text-[#4A4C56]">
                  Load more
                </span>
              </button>
            </div>
          </div>

          {/* Section 4: General Lab and Clinical Infrastructure */}
          <div className="flex w-full flex-col items-start gap-6 pb-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              General Lab and Clinical Infrastructure
            </h3>
            <LabInfrastructureGrid />
            <div className="flex w-full items-center justify-center">
              <button className="flex  items-center justify-center gap-1 rounded-lg border border-[#DFE1E7] px-3 py-1 md:hidden">
                <span className="font-['Segoe_UI'] text-sm text-[#4A4C56]">
                  Load more
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
