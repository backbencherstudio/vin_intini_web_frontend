"use client";

import { useState } from "react";
import { PsychologyHeader, PsychologyFieldsList } from "../_components";
import { psychologyFields } from "../_mock/psychologyData";

export default function PsychologyFieldsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full flex-col items-start justify-end gap-6 px-4 py-6 sm:max-w-2xl md:max-w-4xl md:gap-10 md:px-0 md:py-20 lg:max-w-6xl xl:max-w-360">
      <PsychologyHeader onSearch={setSearchQuery} />
      <PsychologyFieldsList
        fields={psychologyFields}
        searchQuery={searchQuery}
      />
    </div>
  );
}
