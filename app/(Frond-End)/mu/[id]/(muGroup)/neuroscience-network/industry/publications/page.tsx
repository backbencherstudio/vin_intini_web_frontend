"use client";

import { useState } from "react";
import { IndustryHeader } from "../_components";
import { PublicationsList } from "./_components/PublicationsList";
import { publicationsData } from "./_mock/publicationsData";

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-1 flex-col">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          <IndustryHeader
            onSearch={setSearchQuery}
            title="Newly Published"
            description="Explore new publications from the brain health community."
          />
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col items-start gap-10 pt-6">
          <div className="flex w-full flex-col items-start gap-6">
            <PublicationsList publications={publicationsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
