// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/PartnerCard.tsx

"use client";

import { ArrowUpRight } from "lucide-react";
import { PartnerCard as PartnerCardType } from "../_mock/partnersData";

interface PartnerCardProps {
  partner: PartnerCardType;
  isMobile?: boolean;
}

export const PartnerCard = ({
  partner,
  isMobile = false,
}: PartnerCardProps) => {
  return (
    <div
      className={`flex w-full flex-col items-start gap-[13px] self-stretch border-b border-[#D2D2D5] p-4 lg:p-1 ${
        isMobile ? "rounded-lg bg-[#F6F8FA]" : ""
      }`}
    >
      <div className="flex w-full items-center justify-between ">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
          {partner.company}
        </h4>
        <span className="text-center font-['Segoe_UI'] text-sm font-semibold leading-[140%] tracking-[0.07px] text-[#4A4C56] px-2 py-1 border bg-[#e2e2e2] rounded-full ">
          {partner.tag}
        </span>
      </div>
      <p className="text-center font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {partner.description}
      </p>
      <button className="flex items-center gap-1 text-[#04A1B7] hover:underline">
        <span className="text-center font-['Arial'] text-sm font-normal leading-[20px]">
          Learn more
        </span>
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
};
