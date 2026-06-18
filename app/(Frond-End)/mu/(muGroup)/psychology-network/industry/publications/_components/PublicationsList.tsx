"use client";

import { useEffect, useMemo, useState } from "react";

import { IndustryCategoryType } from "@/lib/type";
import { PaginationDots } from "../../_components";
import { FilterTabs } from "./FilterTabs";
import { PublicationCard } from "./PublicationCard";

export const PublicationsList = ({
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

      <div className="flex w-full flex-col">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center border-b border-[#DFE1E7] bg-[#F6F8FA] p-12">
            <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
              No publications found in this category
            </p>
          </div>
        )}
      </div>

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
