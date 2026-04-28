// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/_components/LabInfrastructureFilterTabs.tsx

"use client";

import {
  LabInfrastructureFilterCategory,
  labInfrastructureFilterCategories,
} from "../_mock/biotechnologyData";

interface LabInfrastructureFilterTabsProps {
  activeFilter: LabInfrastructureFilterCategory;
  onFilterChange: (filter: LabInfrastructureFilterCategory) => void;
}

export const LabInfrastructureFilterTabs = ({
  activeFilter,
  onFilterChange,
}: LabInfrastructureFilterTabsProps) => {
  return (
    <div className="w-full overflow-x-auto border-y border-[#E0E0E1]">
      <div className="flex w-max">
        {labInfrastructureFilterCategories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center justify-center gap-2.5 whitespace-nowrap px-5 py-2 font-['Segoe_UI'] text-sm font-medium transition ${
              index !== 0 ? " border-[#E0E0E1]" : ""
            } ${
              activeFilter === category.id
                ? "bg-[#ECEFF3] text-black"
                : "bg-white text-[#78797E] hover:bg-[#ECEFF3] hover:text-black"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};
