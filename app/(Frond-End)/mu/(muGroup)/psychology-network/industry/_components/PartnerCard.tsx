// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/PartnerCard.tsx

"use client";

import { ArrowUpRight } from "lucide-react";
interface PartnerCardType {
  partner_name: string;
  partner_tag: string;
  partner_desc: string;
}

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
      className={`flex w-full flex-col items-start gap-3.25 self-stretch border-b border-[#D2D2D5] p-4 lg:p-1 ${
        isMobile ? "rounded-lg bg-[#F6F8FA]" : ""
      }`}
    >
      <div className="flex w-full items-center justify-between ">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
          {partner.partner_name}
        </h4>
        <span className="text-center font-['Segoe_UI'] text-sm font-semibold leading-[140%] tracking-[0.07px] text-[#4A4C56] px-2 py-1 border bg-[#e2e2e2] rounded-full ">
          {partner.partner_tag}
        </span>
      </div>
      <p className="text-center font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {partner.partner_desc}
      </p>
      <button className="flex items-center gap-1 text-[#04A1B7] hover:underline">
        <span className="text-center font-['Arial'] text-sm font-normal leading-5">
          Learn more
        </span>
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
};
