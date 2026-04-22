"use client";

import { useState } from "react";
import { IndustryHeader } from "../_components/IndustryHeader";

export default function PsychopharmacologyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-4 py-6 md:gap-10 md:px-0 md:py-10">
      <IndustryHeader onSearch={setSearchQuery} title="Psychopharmacology" />
      <p className="text-[#A5A5AB]">
        Psychopharmacology content coming soon...
      </p>
    </div>
  );
}
