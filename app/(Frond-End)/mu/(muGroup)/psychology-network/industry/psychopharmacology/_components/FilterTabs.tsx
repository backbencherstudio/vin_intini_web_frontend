"use client";

import { IndustryCategoryType } from "@/lib/type";

interface FilterTabsProps {
  activeCategoryId: number | "all";
  onFilterChange: (id: number | "all") => void;
  industryData: IndustryCategoryType[];
}

export const FilterTabs = ({
  activeCategoryId,
  onFilterChange,
  industryData,
}: FilterTabsProps) => {
  return (
    <div className="w-full min-w-0 overflow-x-auto border-y border-[#E0E0E1] scrollbar-primary">
      <div className="flex w-max">
        <button
          onClick={() => onFilterChange("all")}
          className={`flex items-center justify-center gap-2.5 whitespace-nowrap px-5 py-2 font-['Segoe_UI'] text-sm font-medium transition ${
            activeCategoryId === "all"
              ? "bg-[#ECEFF3] text-black"
              : "bg-white text-[#78797E] hover:bg-[#ECEFF3] hover:text-black"
          }`}
        >
          All
        </button>
        {industryData.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center justify-center gap-2.5 whitespace-nowrap px-5 py-2 font-['Segoe_UI'] text-sm font-medium transition ${
              activeCategoryId === category.id
                ? "bg-[#ECEFF3] text-black"
                : "bg-white text-[#78797E] hover:bg-[#ECEFF3] hover:text-black"
            }`}
          >
            {category.category_name}
          </button>
        ))}
      </div>
    </div>
  );
};
