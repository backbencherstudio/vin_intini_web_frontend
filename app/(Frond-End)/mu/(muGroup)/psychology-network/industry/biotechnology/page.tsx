// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/page.tsx

import { IndustryHeader } from "../_components";
import { EquipmentGrid } from "./_components";
import { AssessmentGrid } from "./_components/AssessmentGrid";
import { ApparatusGrid } from "./_components/ApparatusGrid";
import { LabInfrastructureGrid } from "./_components/LabInfrastructureGrid";

export default function BiotechnologyPage() {
  return (
    <div className="flex xl:max-w-196.5 lg:max-w-[455px]  flex-col">
      <div className="flex w-full flex-1 flex-col">
        {/* Hide this header on mobile since it's in IndustrySidebar */}
        <div className="hidden md:block">
          <IndustryHeader
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
          </div>

          {/* Section 2: Assessment Instruments */}
          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Psychological Assessment Instruments
            </h3>
            <AssessmentGrid />
          </div>

          {/* Section 3: Experimental Apparatus */}
          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Experimental Apparatus (Behavioral and Cognitive)
            </h3>
            <ApparatusGrid />
          </div>

          {/* Section 4: General Lab and Clinical Infrastructure */}
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
