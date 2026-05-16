// app/(Frond-End)/mu/(muGroup)/neuroscience-network/industry/biotechnology/page.tsx

"use client";

import { useState } from "react";
import { IndustryHeader } from "../_components";
import { AssessmentGrid } from "./_components/";
import {
  diagnosticImagingCards,
  diagnosticImagingCategories,
  assessmentInstrumentCards,
  assessmentInstrumentCategories,
  experimentalApparatusCards,
  experimentalApparatusCategories,
  labInfrastructureCards,
  labInfrastructureCategories,
} from "./_mock/biotechnologyData";

export default function BiotechnologyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex xl:max-w-196.5 lg:max-w-[455px] flex-col py-8 lg:py-10">
      <div className="flex w-full flex-1 flex-col">
        <div className="hidden md:block">
          <IndustryHeader
            onSearch={setSearchQuery}
            title="Biotechnology Industry"
            description="Explore the latest biotech equipment releases advancing brain health research and treatment."
          />
        </div>

        <div className="flex w-full flex-col items-start gap-10 pt-6">
          <AssessmentGrid
            title="Diagnostic Imaging"
            items={diagnosticImagingCards}
            filterCategories={diagnosticImagingCategories}
          />

          <AssessmentGrid
            title="Assessment Instruments"
            items={assessmentInstrumentCards}
            filterCategories={assessmentInstrumentCategories}
          />

          <AssessmentGrid
            title="Experimental Apparatus"
            items={experimentalApparatusCards}
            filterCategories={experimentalApparatusCategories}
          />

          <AssessmentGrid
            title="General Lab and Clinical Infrastructure"
            items={labInfrastructureCards}
            filterCategories={labInfrastructureCategories}
          />
        </div>
      </div>
    </div>
  );
}
