// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/publications/_components/PublicationCard.tsx

"use client";

import { ChevronRight } from "lucide-react";
import { PublicationCard as PublicationCardType } from "../_mock/publicationsData";

interface PublicationCardProps {
  publication: PublicationCardType;
}

export const PublicationCard = ({ publication }: PublicationCardProps) => {
  return (
    <div className="group flex w-full flex-col items-start gap-3.25 self-stretch border-b border-[#DFE1E7] p-2 hover:bg-[#F6F8FA]">
      {/* Journal and Tag Row */}
      <div className="flex w-full items-center justify-between">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C] group-hover:text-[#04A1B7]">
          {publication.journal}
        </h4>
        <span className="flex items-center gap-4 rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
          {publication.tag}
        </span>
      </div>

      {/* Title */}
      <p className="self-stretch font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {publication.title}
      </p>

      {/* Date, Meta, and Button Row */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-['Segoe_UI'] text-sm text-[#777980]">
            {publication.date}
          </span>
          <span className="font-['Segoe_UI'] text-sm text-[#777980]">•</span>
          <span className="font-['Segoe_UI'] text-sm text-[#777980]">
            {publication.meta}
          </span>
        </div>
        <button className="flex items-center gap-1 text-[#04A1B7] hover:underline whitespace-nowrap">
          <span className="text-center font-['Arial'] text-sm font-normal leading-[20px]">
            Learn more
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
