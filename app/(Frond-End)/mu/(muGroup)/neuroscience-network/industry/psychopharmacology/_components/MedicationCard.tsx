// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/psychopharmacology/_components/MedicationCard.tsx

"use client";

import { ArrowUpRight } from "lucide-react";
import { MedicationCard as MedicationCardType } from "../_mock/psychopharmacologyData";

interface MedicationCardProps {
  card: MedicationCardType;
}

export const MedicationCard = ({ card }: MedicationCardProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white p-4">
      {/* Title and Tag Row */}
      <div className="flex w-full items-center justify-between">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
          {card.title}
        </h4>
        <span className="rounded-full bg-[#D3F4EF] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#04A1B7] ">
          {card.tag}
        </span>
      </div>

      {/* Subtitle */}
      <p className="self-stretch font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-[#777980]">
        {card.subtitle}
      </p>

      {/* Indication */}
      <p className="self-stretch font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {card.indication}
      </p>

      {/* MOA */}
      <p className="self-stretch font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {card.moa}
      </p>

      {/* Learn More Button */}
      <button className="flex items-center gap-1 text-[#04A1B7] hover:underline">
        <span className="font-['Segoe_UI'] text-sm font-medium">
          Learn more
        </span>
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
};
