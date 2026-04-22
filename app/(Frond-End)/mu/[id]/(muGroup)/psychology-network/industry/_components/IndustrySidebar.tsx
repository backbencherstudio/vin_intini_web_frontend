// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/IndustrySidebar.tsx

"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { IndustryNavItem } from "./IndustryNavItem";
import {
  BiotechnologyIcon,
  PsychopharmacologyIcon,
  PublicationsIcon,
} from "@/public/svgIcons/Icons";
import { IndustryHeader } from "./IndustryHeader";

export const IndustrySidebar = () => {
  const params = useParams();
  const pathname = usePathname();
  const muId = params.id as string;
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      href: `/mu/${muId}/psychology-network/industry/biotechnology`,
      icon: <BiotechnologyIcon />,
      label: "Biotechnology",
    },
    {
      href: `/mu/${muId}/psychology-network/industry/psychopharmacology`,
      icon: <PsychopharmacologyIcon />,
      label: "Psychopharmacology",
    },
    {
      href: `/mu/${muId}/psychology-network/industry/publications`,
      icon: <PublicationsIcon />,
      label: "Publications",
    },
  ];

  const currentPage =
    navItems.find((item) => pathname === item.href)?.label || "Industries";

  const pageDescriptions: Record<string, string> = {
    Biotechnology:
      "Explore the latest biotech equipment releases advancing brain health research and treatment.",
    Psychopharmacology:
      "Discover cutting-edge psychopharmacological research and developments.",
    Publications:
      "Access the latest publications and research papers in the field.",
  };

  return (
    <>
      {/* Desktop View - UNCHANGED */}
      <div className="hidden w-full max-w-66 flex-col items-center gap-5 self-stretch border-r border-[#DFE1E7] bg-white md:flex md:w-66">
        <div className="flex w-full items-center gap-2.5 self-stretch border-b border-[#DFE1E7] px-5 py-5">
          <h2 className="font-['Segoe_UI'] text-xl font-semibold text-[#1D1F2C]">
            Industries
          </h2>
        </div>
        <div className="flex w-full max-w-56 flex-col items-start gap-1">
          {navItems.map((item) => (
            <IndustryNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </div>

      {/* Mobile View - Header + Dropdown */}
      <div className="w-full md:hidden">
        <IndustryHeader
          title={currentPage}
          description={
            pageDescriptions[currentPage] ||
            "Explore the latest advancements in brain health research and treatment."
          }
        />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-[#DFE1E7] bg-white px-4 py-3"
        >
          <span className="font-['Segoe_UI'] text-base font-semibold text-[#1D1F2C]">
            {currentPage}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-[#1D1F2C] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-2 flex w-full flex-col rounded-lg border border-[#DFE1E7] bg-white p-2">
            {navItems.map((item) => (
              <IndustryNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
