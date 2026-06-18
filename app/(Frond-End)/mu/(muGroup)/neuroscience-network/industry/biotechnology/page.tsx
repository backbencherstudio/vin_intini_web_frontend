// app/(Frond-End)/mu/(muGroup)/neuroscience-network/industry/biotechnology/page.tsx

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
  return (
    <div className="flex w-full flex-col min-w-0">
      <div className="flex w-full flex-1 flex-col min-w-0">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          <IndustryHeader
            title="Biotechnology Industry"
            description="Explore the latest biotech equipment releases advancing brain health research and treatment."
          />
        </div>

        {/* Added min-w-0 to keep the Assessments inside the available width */}
        <div className="flex lg:w-[555px] flex-col items-stretch gap-10 pt-6 min-w-0">
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