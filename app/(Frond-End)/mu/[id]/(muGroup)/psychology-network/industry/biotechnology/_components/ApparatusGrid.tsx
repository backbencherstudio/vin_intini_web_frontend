
"use client";

import { useState, useMemo } from "react";
import {
  ApparatusCard as ApparatusCardType,
  ApparatusFilterCategory,
  apparatusCards,
  apparatusFilterCategories,
} from "../_mock/biotechnologyData";
import { ApparatusCard } from "./ApparatusCard";
import { ApparatusFilterTabs } from "./ApparatusFilterTabs";
import { PaginationDots } from "../../_components";

const ITEMS_PER_PAGE = 4;

export const ApparatusGrid = () => {
  const [activeFilter, setActiveFilter] =
    useState<ApparatusFilterCategory>("all");
  const [currentPage, setCurrentPage] = useState(0);

  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return apparatusCards;
    return apparatusCards.filter((card) => card.category === activeFilter);
  }, [activeFilter]);

  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

  const paginatedCards = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCards.slice(start, end);
  }, [filteredCards, currentPage]);

  const handleFilterChange = (filter: ApparatusFilterCategory) => {
    setActiveFilter(filter);
    setCurrentPage(0);
  };

  const getActiveDotIndex = () => {
    const filterIndex = apparatusFilterCategories.findIndex(
      (cat) => cat.id === activeFilter,
    );
    return filterIndex >= 0 ? filterIndex : 0;
  };

  const handleDotClick = (index: number) => {
    if (index < apparatusFilterCategories.length) {
      setActiveFilter(apparatusFilterCategories[index].id);
      setCurrentPage(0);
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {/* Filter Tabs */}
      <div className="flex w-full items-center">
        <ApparatusFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {paginatedCards.map((card) => (
          <ApparatusCard key={card.id} card={card} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="flex w-full justify-center py-12">
          <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
            No apparatus found in this category
          </p>
        </div>
      )}

      {/* Pagination Dots */}
      <div className="flex w-full justify-center py-6">
        <PaginationDots
          total={apparatusFilterCategories.length}
          activeIndex={getActiveDotIndex()}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
};
