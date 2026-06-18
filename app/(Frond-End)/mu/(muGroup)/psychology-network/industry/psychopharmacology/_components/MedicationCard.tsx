"use client";

import { IndustryItemType } from "@/lib/type";
import { ArrowUpRight } from "lucide-react";

interface MedicationCardProps {
  card: IndustryItemType;
  priority?: boolean;
}

export const MedicationCard = ({ card, priority = false }: MedicationCardProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white p-4">
      <div className="flex w-full items-center justify-between">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
          {card.title}
        </h4>
        {card.tag && (
          <span className="rounded-full bg-[#D3F4EF] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#04A1B7]">
            {card.tag}
          </span>
        )}
      </div>

      {card.sub_title && (
        <p className="self-stretch font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-[#777980]">
          {card.sub_title}
        </p>
      )}

      <p className="self-stretch font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {card.description}
      </p>

      {card.link ? (
        <a
          href={card.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#04A1B7] hover:underline"
        >
          <span className="font-['Segoe_UI'] text-sm font-medium">
            Learn more
          </span>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : (
        <button className="flex items-center gap-1 text-[#04A1B7] hover:underline">
          <span className="font-['Segoe_UI'] text-sm font-medium">
            Learn more
          </span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
