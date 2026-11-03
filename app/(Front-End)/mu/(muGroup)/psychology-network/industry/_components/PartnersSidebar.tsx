// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/PartnersSidebar.tsx

"use client";

import {
  useGetBiotechnologyPartnersQuery,
  useGetPsychologyOnePartnersQuery,
  useGetPublicationsOnePartnersQuery,
} from "@/feature/slice/biotechnologySlice";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PaginationDots } from "./PaginationDots";
import { PartnerCard } from "./PartnerCard";

export const PartnersSidebar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pathname = usePathname();

  const isBiotechnology = pathname.includes("/psychology-network/industry/biotechnology");
  const isPsychopharmacology = pathname.includes("/psychology-network/industry/psychopharmacology");
  const isPublications = pathname.includes("/psychology-network/industry/publications");
  const biotechnologyQuery = useGetBiotechnologyPartnersQuery("biotechnology", {
    skip: !isBiotechnology,
  });
  const psychopharmacologyQuery = useGetPsychologyOnePartnersQuery(
    "psychopharmacology",
    { skip: !isPsychopharmacology },
  );
  const publicationsQuery = useGetPublicationsOnePartnersQuery(
    "publications",
    { skip: !isPublications },
  );
  const data = isPsychopharmacology
    ? psychopharmacologyQuery.data
    : isPublications
      ? publicationsQuery.data
      : biotechnologyQuery.data;

  const navItems = [
    {
      href: `/psychology-network/industry/biotechnology`,
      label: "Biotechnology",
    },
    {
      href: `/psychology-network/industry/psychopharmacology`,
      label: "Psychopharmacology",
    },
    {
      href: `/psychology-network/industry/publications`,
      label: "Publications",
    },
  ];

  const currentPage = navItems.find((item) => pathname === item.href);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth;
    const newIndex = Math.round(scrollPosition / cardWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="flex h-auto w-full flex-col items-start gap-6 lg:bg-bgLightColor p-4  rounded-lg border border-[#ECEFF3]">
      {/* Header */}
      <div className="flex w-full flex-col items-start gap-2 ">
        <h3 className="text-xl font-semibold leading-[130%] tracking-[0.1px] text-[#1D1F2C]">
          Mind Unite Partners
        </h3>
        <p className="text-base font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
          Leading {currentPage?.label} companies advancing brain health research
          and treatment.
        </p>
      </div>

      {/* Desktop View - Vertical List */}
      <div className="hidden w-full flex-col lg:flex">
        {data?.partners?.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>

      {/* Mobile View - Horizontal Scrollable Cards */}
      <div className="w-full  flex flex-col gap-4 lg:hidden">
        <div
          className="flex w-full   gap-4 overflow-x-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          {data?.partners?.map((partner) => (
            <div key={partner.id} className="w-full  snap-center">
              <PartnerCard partner={partner} isMobile />
            </div>
          ))}
        </div>

        {/* Pagination Dots for Mobile */}
        <div className="flex w-full justify-center">
          <PaginationDots
            total={data?.partners?.length || 0}
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
