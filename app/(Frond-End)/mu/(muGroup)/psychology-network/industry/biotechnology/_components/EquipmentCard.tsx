// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/_components/EquipmentCard.tsx

"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { EquipmentCard as EquipmentCardType } from "../_mock/biotechnologyData";

interface EquipmentCardProps {
  card: EquipmentCardType;
}

export const EquipmentCard = ({ card }: EquipmentCardProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white pb-2 pr-px ">
      {/* Image */}
      <div className="relative h-45 w-full overflow-hidden rounded-[10px]">
        <Image
          src={card.image}
          alt={card.title}
          width={400}
          height={300}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>

      {/* Title */}
      <h4 className="flex-1 px-3 font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
        {card.title}
      </h4>

      {/* Manufacturer */}
      <p className="self-stretch px-3 font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-[#777980]">
        {card.manufacturer}
      </p>

      {/* Description */}
      <p className="self-stretch px-3 font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {card.description}
      </p>

      {/* Learn More Button */}
      <button className="flex items-center gap-1 px-3 text-black hover:underline">
        <span className="font-['Segoe_UI'] text-sm font-medium">
          Learn more
        </span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
