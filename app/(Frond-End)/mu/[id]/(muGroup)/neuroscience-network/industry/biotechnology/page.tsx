// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/page.tsx

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
          {/* Section 1: Diagnostic Imaging */}
          <AssessmentGrid
            title="Diagnostic Imaging"
            items={diagnosticImagingCards}
            filterCategories={diagnosticImagingCategories}
          />

          {/* Section 2: Assessment Instruments */}
          <AssessmentGrid
            title="Assessment Instruments"
            items={assessmentInstrumentCards}
            filterCategories={assessmentInstrumentCategories}
          />

          {/* Section 3: Experimental Apparatus */}
          <AssessmentGrid
            title="Experimental Apparatus"
            items={experimentalApparatusCards}
            filterCategories={experimentalApparatusCategories}
          />

          {/* Section 4: General Lab and Clinical Infrastructure */}
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
