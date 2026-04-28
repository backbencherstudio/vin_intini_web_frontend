// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/_components/LabInfrastructureCard.tsx

"use client";

import { ChevronRight } from "lucide-react";
import { LabInfrastructureCard as LabInfrastructureCardType } from "../_mock/biotechnologyData";

interface LabInfrastructureCardProps {
  card: LabInfrastructureCardType;
  icon?: React.ReactNode;
}

export const LabInfrastructureCard = ({
  card,
  icon,
}: LabInfrastructureCardProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white p-4">
      {/* Icon and Title Row */}
      <div className="flex w-full items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8FAFB]">
          {icon}
        </div>
        <div className="flex flex-1 items-center justify-between">
          <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
            {card.title}
          </h4>
          <span className="rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
            {card.tag}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="self-stretch font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {card.description}
      </p>

      {/* Explore Options Button */}
      <button className="flex items-center gap-1 text-black hover:underline">
        <span className="font-['Segoe_UI'] text-sm font-medium">
          Explore options
        </span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
