"use client";

import { useMemo, useState } from "react";

import { IndustryCategoryType } from "@/lib/type";
import { EquipmentCard } from "./EquipmentCard";
import { FilterTabs } from "./FilterTabs";

export const EquipmentGrid = ({
  industryData,
}: {
  industryData: IndustryCategoryType[];
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 4;

  const allItems = useMemo(() => {
    const categories =
      activeCategoryId === "all"
        ? industryData
        : industryData.filter((cat) => cat.id === activeCategoryId);
    return categories.flatMap((cat) => cat.industry_item);
  }, [industryData, activeCategoryId]);

  const visibleItems = allItems.slice(0, (currentPage + 1) * ITEMS_PER_PAGE);

  const handleFilterChange = (id: number | "all") => {
    setActiveCategoryId(id);
    setCurrentPage(0);
  };

  return (
    <div className="flex w-full flex-col  gap-4">
      <div className="w-full">
        <FilterTabs
          activeCategoryId={activeCategoryId}
          onFilterChange={handleFilterChange}
          industryData={industryData}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {visibleItems.map((item, index) => (
          <EquipmentCard key={item.id} card={item} priority={index < 2} />
        ))}
      </div>

      {allItems.length === 0 && (
        <div className="flex w-full justify-center py-12">
          <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
            No equipment found in this category
          </p>
        </div>
      )}

      {visibleItems.length < allItems.length && (
        <div className="flex w-full items-center justify-center pt-2">
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="mt-4 px-4 py-2 cursor-pointer disabled:bg-bgColor disabled:text-grayColor1 disabled:cursor-not-allowed  bg-primaryColor text-white rounded"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};
