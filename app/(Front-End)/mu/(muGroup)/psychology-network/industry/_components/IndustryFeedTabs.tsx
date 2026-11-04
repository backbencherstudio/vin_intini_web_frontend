"use client";

import Search from "@/components/reusable/Search";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export interface IndustryFeedTabItem {
  id?: string | number;
  label: string;
  href: string;
  icon?: React.ReactNode;
  count?: number | string;
}

export interface IndustryFeedTabsProps {
  tabs?: IndustryFeedTabItem[];
  initialPath?: string; // fallback if tabs not passed directly
  productsCount?: number | string;
  sectionsCount?: number | string;
  searchPlaceholder?: string;
}

export const IndustryFeedTabs = ({
  tabs,
  initialPath,
  searchPlaceholder = "search by product name or id",
}: IndustryFeedTabsProps) => {
  const pathName = usePathname();

 const isActive = (href: string): boolean => {
    if (href === initialPath) {
      return pathName === initialPath;
    }
    return pathName.startsWith(href);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 mb-6 sm:mb-7">
      {/* Left Tabs */}
      <div className="inline-flex items-center p-1 rounded-xl bg-sectionColor border border-borderColor self-start sm:self-auto flex-wrap gap-1">
        {tabs?.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href || String(tab.id)}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                active
                  ? "bg-primaryColor text-white shadow-xs"
                  : "text-descriptionColor hover:text-headerColor bg-transparent"
              }`}
            >
              {tab.icon && (
                <span
                  className={`flex items-center justify-center ${
                    active ? "text-white" : "text-descriptionColor"
                  }`}
                >
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-black/5 text-descriptionColor"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Search Input */}
      <div className="w-full sm:w-72 md:w-80">
        <Search placeHolder={searchPlaceholder} />
      </div>
    </div>
  );
};
