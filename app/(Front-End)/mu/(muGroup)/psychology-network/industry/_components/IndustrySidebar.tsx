
"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { ChevronDown, icons } from "lucide-react";
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

  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      href: `/mu/psychology-network/industry/biotechnology`,
      icon: <BiotechnologyIcon />,
      label: "Biotechnology",
    },
    {
      href: `/mu/psychology-network/industry/psychopharmacology`,
      icon: <PsychopharmacologyIcon />,
      label: "Psychotropics",
    },
    {
      href: `/mu/psychology-network/industry/publications`,
      icon: <PublicationsIcon />,
      label: "Publications",
    },
  ];

  const currentNavItem = navItems.find((item) => pathname === item.href);
  const currentPage = currentNavItem?.label || "Industries";
  const currentIcon = currentNavItem?.icon || null;

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
      {/* Desktop View - Shows from lg (1024px) and above */}
      <div className="hidden h-full min-h-[calc(100vh-170px)] w-full flex-col justify-between lg:flex">
        <div>
          <h3 className="text-lg border-b border-borderColor h-[66px] pb-3 flex items-center font-semibold text-headerColor">
            Industries
          </h3>

          <div className="mt-4 space-y-1">
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
      </div>

      {/* Mobile & Tablet View - Shows below lg (1024px) */}
      <div className="w-full lg:hidden">
        <IndustryHeader
          title={currentPage}
          description={
            pageDescriptions[currentPage] ||
            "Explore the latest advancements in brain health research and treatment."
          }
        />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-borderColor bg-white px-4 py-3"
        >
          <span className="text-base font-semibold text-[#1D1F2C]">
            <div className="flex items-center gap-2">
              {currentIcon} {currentPage}
            </div>
          </span>
          <ChevronDown
            className={`h-5 w-5 text-[#1D1F2C] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isOpen && (
          <div className="mt-2 flex w-full flex-col rounded-lg border border-borderColor bg-white p-2">
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
