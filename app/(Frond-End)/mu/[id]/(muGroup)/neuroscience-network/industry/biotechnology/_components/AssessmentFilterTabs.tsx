
"use client";

export interface FilterCategory {
  id: string;
  label: string;
}

interface AssessmentFilterTabsProps {
  categories: readonly FilterCategory[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const AssessmentFilterTabs = ({
  categories,
  activeFilter,
  onFilterChange,
}: AssessmentFilterTabsProps) => {
  return (
    <div className="w-full overflow-x-auto border-y border-[#E0E0E1] scrollbar-hide">
      <div className="flex w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center justify-center gap-2.5 whitespace-nowrap px-5 py-2 font-['Segoe_UI'] text-sm font-medium transition ${
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
