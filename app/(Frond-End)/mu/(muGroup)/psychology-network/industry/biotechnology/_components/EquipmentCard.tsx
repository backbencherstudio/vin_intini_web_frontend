"use client";

import { IndustryItemType } from "@/lib/type";
import image1 from "@/public/xray.jpg";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
interface EquipmentCardProps {
  card: IndustryItemType;
  priority?: boolean;
}

export const EquipmentCard = ({
  card,
  priority = false,
}: EquipmentCardProps) => {
  return (
    <div
      className={`flex w-full flex-col items-start gap-3 rounded-[10px] border border-[#ECEFF3] bg-white ${card.image ? "pt-0" : "pt-2"} pb-2 pr-px`}
    >
      {card.image && (
        <div className="relative h-45 w-full overflow-hidden rounded-[10px]">
          <Image
            src={card.image_url || image1}
            alt={card.title}
            width={400}
            height={300}
            className="h-full w-full object-cover"
            unoptimized
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>
      )}

      <div className="flex w-full items-center justify-between px-3">
        <h4 className="font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
          {card.title}
        </h4>
        {card.tag && (
          <span className="rounded-full bg-[#E9E9EA] px-2.5 py-1 font-['Segoe_UI'] text-xs font-normal text-[#4A4C56]">
            {card.tag}
          </span>
        )}
      </div>

      {card.sub_title && (
        <p className="self-stretch px-3 font-['Segoe_UI'] text-xs font-normal leading-[132%] tracking-[0.06px] text-[#777980]">
          {card.sub_title}
        </p>
      )}

      <p className="self-stretch px-3 font-['Segoe_UI'] text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        {card.description}
      </p>

      {card.link ? (
        <a
          href={card.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 text-black hover:underline"
        >
          <span className="font-['Segoe_UI'] text-sm font-medium">
            Learn more
          </span>
          <ChevronRight className="h-4 w-4" />
        </a>
      ) : (
        <button className="flex items-center gap-1 px-3 text-black hover:underline">
          <span className="font-['Segoe_UI'] text-sm font-medium">
            Learn more
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
