"use client";

import { useState, useMemo } from "react";
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

const ITEMS_PER_PAGE = 4;

export const LabInfrastructureGrid = () => {
  const [activeFilter, setActiveFilter] =
    useState<LabInfrastructureFilterCategory>("all");
  const [currentPage, setCurrentPage] = useState(0);

  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return labInfrastructureCards;
    return labInfrastructureCards.filter(
      (card) => card.category === activeFilter,
    );
  }, [activeFilter]);

  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

  const paginatedCards = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCards.slice(start, end);
  }, [filteredCards, currentPage]);

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
    <div className="flex w-full flex-col items-start gap-4">
      {/* Filter Tabs */}
      <div className="flex w-full items-center">
        <LabInfrastructureFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
