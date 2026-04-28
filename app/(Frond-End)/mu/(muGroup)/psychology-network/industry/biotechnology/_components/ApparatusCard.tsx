"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ApparatusCard as ApparatusCardType } from "../_mock/biotechnologyData";

interface ApparatusCardProps {
  card: ApparatusCardType;
}

export const ApparatusCard = ({ card }: ApparatusCardProps) => {
  return (
    <div className="flex w-full  flex-col items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white pb-2 pr-px">
      {/* Image */}
      <div className="relative h-45 w-full overflow-hidden rounded-[10px]">
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title and Tag Row */}
      <div className="flex w-full items-center justify-between px-3">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
          {card.title}
        </h4>
        <span className="rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
          {card.tag}
        </span>
      </div>

      {/* Manufacturer */}
      <p className="self-stretch px-3 font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-[#777980]">
        {card.manufacturer}
      </p>

      {/* Description */}
      <p className="self-stretch px-3 font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {card.description}
      </p>

      {/* View Product Button */}
      <button className="flex items-center gap-1 px-3 text-black hover:underline">
        <span className="font-['Segoe_UI'] text-sm font-medium">
          View product
        </span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
