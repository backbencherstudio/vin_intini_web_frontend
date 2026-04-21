"use client";

import { useState } from "react";
import { PsychologyHeader, PsychologyFieldsList } from "./_components";
import { psychologyFields } from "./_mock/psychologyData";

export default function PsychologyNetworkPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full max-w-[270.25px] flex-col items-start gap-6 px-4 py-6 sm:max-w-2xl md:max-w-4xl md:gap-10 md:px-0 md:py-10 lg:max-w-6xl xl:max-w-[1081px]">
      <PsychologyHeader onSearch={setSearchQuery} />
      <PsychologyFieldsList
        fields={psychologyFields}
        searchQuery={searchQuery}
      />
    </div>
  );
}
