
"use client";

import { useState } from "react";
import { IndustryHeader } from "../_components/IndustryHeader";

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-4 py-6 md:gap-10 md:px-0 md:py-10">
      <IndustryHeader onSearch={setSearchQuery} title="Publications" />
      <p className="text-[#A5A5AB]">Publications content coming soon...</p>
    </div>
  );
}
