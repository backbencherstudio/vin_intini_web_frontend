"use client";

import { useState, useMemo, useEffect } from "react";
import {
  LabInfrastructureCard as LabInfrastructureCardType,
  LabInfrastructureFilterCategory,
  labInfrastructureCards,
  labInfrastructureFilterCategories,
} from "../_mock/biotechnologyData";
import { LabInfrastructureCard } from "./LabInfrastructureCard";
import { LabInfrastructureFilterTabs } from "./LabInfrastructureFilterTabs";
import { PaginationDots } from "../../_components";
import { fileIcon } from "@/public/svgIcons/Icons";

export const LabInfrastructureGrid = () => {
  const [activeFilter, setActiveFilter] =
    useState<LabInfrastructureFilterCategory>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(
        window.innerWidth >= 1024 && window.innerWidth < 1280 ? 2 : 4
      );
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return labInfrastructureCards;
    return labInfrastructureCards.filter(
      (card) => card.category === activeFilter,
    );
  }, [activeFilter]);

  const paginatedCards = useMemo(() => {
    const end = (currentPage + 1) * itemsPerPage;
    return filteredCards.slice(0, end);
  }, [filteredCards, currentPage, itemsPerPage]);

  const handleFilterChange = (filter: LabInfrastructureFilterCategory) => {
    setActiveFilter(filter);
    setCurrentPage(0);
  };

  const getActiveDotIndex = () => {
    const filterIndex = labInfrastructureFilterCategories.findIndex(
      (cat) => cat.id === activeFilter,
    );
    return filterIndex >= 0 ? filterIndex : 0;
  };

  const handleDotClick = (index: number) => {
    if (index < labInfrastructureFilterCategories.length) {
      setActiveFilter(labInfrastructureFilterCategories[index].id);
      setCurrentPage(0);
    }
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-4">
      {/* Filter Tabs */}
      <div className="w-full min-w-0">
        <LabInfrastructureFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
        {paginatedCards.map((card) => (
          <LabInfrastructureCard
            key={card.id}
            card={card}
            icon={fileIcon({ className: "h-6 w-6" })}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="flex w-full justify-center py-12">
          <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
            No infrastructure items found in this category
          </p>
        </div>
      )}

      {/* Load More Button */}
      {filteredCards.length > (currentPage + 1) * itemsPerPage && (
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

      {/* Pagination Dots */}
      <div className="flex w-full justify-center py-6">
        <PaginationDots
          total={labInfrastructureFilterCategories.length}
          activeIndex={getActiveDotIndex()}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
};
