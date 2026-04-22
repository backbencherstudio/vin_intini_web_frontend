// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/PartnersSidebar.tsx

"use client";

import { useState } from "react";
import { PartnerCard } from "./PartnerCard";
import { PaginationDots } from "./PaginationDots";
import { partnersData } from "../_mock/partnersData";

export const PartnersSidebar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth;
    const newIndex = Math.round(scrollPosition / cardWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="flex h-auto w-full flex-col items-start gap-6 lg:bg-[#F8FAFB] p-5 md:h-253.5 md:w-85.5 rounded-lg border border-[#ECEFF3]">
      {/* Header */}
      <div className="flex w-full flex-col items-start gap-2 self-stretch">
        <h3 className="font-['Segoe_UI'] text-xl font-semibold leading-[130%] tracking-[0.1px] text-[#1D1F2C]">
          Mind Unite Partners
        </h3>
        <p className="font-['Segoe_UI'] text-base font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
          Leading Biotech companies advancing brain health research and
          treatment.
        </p>
      </div>

      {/* Desktop View - Vertical List */}
      <div className="hidden w-full flex-col md:flex">
        {partnersData.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>

      {/* Mobile View - Horizontal Scrollable Cards */}
      <div className="flex w-full flex-col gap-4 md:hidden">
        <div
          className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          {partnersData.map((partner) => (
            <div key={partner.id} className="w-full shrink-0 snap-center">
              <PartnerCard partner={partner} isMobile />
            </div>
          ))}
        </div>

        {/* Pagination Dots for Mobile */}
        <div className="flex w-full justify-center">
          <PaginationDots
            total={partnersData.length}
            activeIndex={currentIndex}
            onDotClick={(index) => {
              setCurrentIndex(index);
              const container = document.querySelector(".snap-x");
              if (container) {
                container.scrollTo({
                  left: index * container.clientWidth,
                  behavior: "smooth",
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
