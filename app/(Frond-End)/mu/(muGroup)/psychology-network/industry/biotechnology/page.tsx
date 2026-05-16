// app/(Frond-End)/mu/(muGroup)/psychology-network/industry/biotechnology/page.tsx

"use client";

import { useState } from "react";
import { IndustryHeader } from "../_components";
import {
  EquipmentGrid,
  AssessmentGrid,
  ApparatusGrid,
  LabInfrastructureGrid,
} from "./_components";

export default function BiotechnologyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex xl:max-w-196.5 lg:max-w-[455px] flex-col">
      <div className="flex w-full flex-1 flex-col">
        <div className="hidden md:block">
          <IndustryHeader
            onSearch={setSearchQuery}
            title="Biotechnology Industry"
            description="Explore the latest biotech equipment releases advancing brain health research and treatment."
          />
        </div>

        <div className="flex w-full flex-col items-start gap-10 pt-6">
          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Neuroscientific and Psychophysiological Equipment
            </h3>
            <EquipmentGrid />
          </div>

          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Psychological Assessment Instruments
            </h3>
            <AssessmentGrid />
          </div>

          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Experimental Apparatus (Behavioral and Cognitive)
            </h3>
            <ApparatusGrid />
          </div>

          <div className="flex w-full flex-col items-start gap-6 pb-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              General Lab and Clinical Infrastructure
            </h3>
            <LabInfrastructureGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
