"use client";

import { ArrowUpRight, ChevronRight } from "lucide-react";
import { AssessmentCard as AssessmentCardType } from "../_mock/biotechnologyData";

interface AssessmentCardProps {
  card: AssessmentCardType;
}

export const AssessmentCard = ({ card }: AssessmentCardProps) => {
  return (
    <div className="flex w-full max-w-91.75 flex-col items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white p-4">
      {/* Title and Tag Row */}
      <div className="flex w-full items-center justify-between">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
          {card.title}
        </h4>
        <span className="rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
          {card.tag}
        </span>
      </div>

      {/* Subtitle */}
      <p className="self-stretch font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-[#777980]">
        {card.subtitle}
      </p>

      {/* Description */}
      <p className="self-stretch font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {card.description}
      </p>

      {/* Learn More Button */}
      <button className="flex items-center gap-1 text-[#04A1B7] hover:underline">
        <span className="text-center font-['Arial'] text-sm font-normal leading-5">
          Learn more
        </span>
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
};
