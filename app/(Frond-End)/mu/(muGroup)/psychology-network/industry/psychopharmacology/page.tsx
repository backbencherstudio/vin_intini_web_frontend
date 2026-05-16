// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/psychopharmacology/page.tsx

import { IndustryHeader } from "../_components";
import { MedicationGrid } from "./_components";

export default function PsychopharmacologyPage() {
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
          <div className="flex w-full flex-col items-start gap-6">
            <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
              Psychotropic Medications
            </h3>
            <MedicationGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
