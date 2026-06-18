"use client";

import { ChevronRight } from "lucide-react";
import { IndustryItemType } from "@/lib/type";

interface PublicationCardProps {
  publication: IndustryItemType;
}

export const PublicationCard = ({ publication }: PublicationCardProps) => {
  return (
    <div className="group flex w-full flex-col items-start gap-3.25 self-stretch border-b border-[#DFE1E7] p-3 hover:bg-[#F6F8FA]">
      {/* Journal and Tag Row */}
      <div className="flex w-full items-center justify-between">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C] group-hover:text-[#04A1B7]">
          {publication.title}
        </h4>
        {publication.tag && (
          <span className="flex items-center gap-4 rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
            {publication.tag}
          </span>
        )}
      </div>

      {/* Title / Description */}
      <p className="self-stretch font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {publication.description}
      </p>

      {/* Date, Meta, and Button Row */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-5">
          {publication.sub_title && (
            <span className="font-['Segoe_UI'] text-sm text-[#777980]">
              {publication.sub_title}
            </span>
          )}
        </div>
        {publication.link ? (
          <a
            href={publication.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#04A1B7] hover:underline"
          >
            <span className="text-center font-['Arial'] text-sm font-normal leading-5">
              Learn more
            </span>
            <ChevronRight className="h-4 w-4" />
          </a>
        ) : (
          <button className="flex items-center gap-1 text-[#04A1B7] hover:underline">
            <span className="text-center font-['Arial'] text-sm font-normal leading-5">
              Learn more
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
