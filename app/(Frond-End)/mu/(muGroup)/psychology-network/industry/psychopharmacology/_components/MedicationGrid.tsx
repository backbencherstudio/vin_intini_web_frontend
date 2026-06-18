"use client";

import { useEffect, useMemo, useState } from "react";

import { IndustryCategoryType } from "@/lib/type";
import { PaginationDots } from "../../_components";
import { MedicationCard } from "./MedicationCard";

interface FilterTabsProps {
  activeCategoryId: number | "all";
  onFilterChange: (id: number | "all") => void;
  industryData: IndustryCategoryType[];
}

const FilterTabs = ({
  activeCategoryId,
  onFilterChange,
  industryData,
}: FilterTabsProps) => {
  return (
    <div className="w-full min-w-0 overflow-x-auto border-y border-[#E0E0E1]">
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
        {industryData.map((category) => (
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

export const MedicationGrid = ({
  industryData,
}: {
  industryData: IndustryCategoryType[];
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(
        window.innerWidth >= 1024 && window.innerWidth < 1280 ? 2 : 4,
      );
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const allItems = useMemo(() => {
    const categories =
      activeCategoryId === "all"
        ? industryData
        : industryData.filter((cat) => cat.id === activeCategoryId);
    return categories.flatMap((cat) => cat.industry_item);
  }, [industryData, activeCategoryId]);

  const paginatedItems = useMemo(() => {
    const end = (currentPage + 1) * itemsPerPage;
    return allItems.slice(0, end);
  }, [allItems, currentPage, itemsPerPage]);

  const handleFilterChange = (id: number | "all") => {
    setActiveCategoryId(id);
    setCurrentPage(0);
  };

  const getActiveDotIndex = () => {
    if (activeCategoryId === "all") return 0;
    const index = industryData.findIndex(
      (cat) => cat.id === activeCategoryId,
    );
    return index >= 0 ? index + 1 : 0;
  };

  const handleDotClick = (index: number) => {
    if (index === 0) {
      setActiveCategoryId("all");
    } else {
      const category = industryData[index - 1];
      if (category) {
        setActiveCategoryId(category.id);
      }
    }
    setCurrentPage(0);
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-4">
      <div className="w-full min-w-0">
        <FilterTabs
          activeCategoryId={activeCategoryId}
          onFilterChange={handleFilterChange}
          industryData={industryData}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {paginatedItems.map((item) => (
          <MedicationCard key={item.id} card={item} />
        ))}
      </div>

      {allItems.length === 0 && (
        <div className="flex w-full justify-center py-12">
          <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
            No medications found in this category
          </p>
        </div>
      )}

      {allItems.length > (currentPage + 1) * itemsPerPage && (
        <div className="flex w-full items-center justify-center pt-2">
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="flex items-center justify-center gap-1 rounded-lg border border-[#DFE1E7] px-3 py-1 xl:hidden"
          >
            <span className="font-['Segoe_UI'] text-sm text-[#4A4C56]">
              Load more
            </span>
          </button>
        </div>
      )}

      <div className="flex w-full justify-center py-6">
        <PaginationDots
          total={industryData.length + 1}
          activeIndex={getActiveDotIndex()}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
};
