"use client";

import { useState, useMemo } from "react";
import {
  EquipmentCard as EquipmentCardType,
  FilterCategory,
  equipmentCards,
  filterCategories,
} from "../_mock/biotechnologyData";
import { EquipmentCard } from "./EquipmentCard";
import { FilterTabs } from "./FilterTabs";
import { PaginationDots } from "../../_components";

const ITEMS_PER_PAGE = 4;

export const EquipmentGrid = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [currentPage, setCurrentPage] = useState(0);

  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return equipmentCards;
    return equipmentCards.filter((card) => card.category === activeFilter);
  }, [activeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

  const paginatedCards = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCards.slice(start, end);
  }, [filteredCards, currentPage]);

  // Reset to first page when filter changes
  const handleFilterChange = (filter: FilterCategory) => {
    setActiveFilter(filter);
    setCurrentPage(0);
  };

  // Get active dot index based on current filter
  const getActiveDotIndex = () => {
    const filterIndex = filterCategories.findIndex(
      (cat) => cat.id === activeFilter,
    );
    return filterIndex >= 0 ? filterIndex : 0;
  };

  // Handle dot click - changes filter category
  const handleDotClick = (index: number) => {
    if (index < filterCategories.length) {
      setActiveFilter(filterCategories[index].id);
      setCurrentPage(0);
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {/* Filter Tabs */}
      <div className="flex w-full items-center">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {paginatedCards.map((card) => (
          <EquipmentCard key={card.id} card={card} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="flex w-full justify-center py-12">
          <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
            No equipment found in this category
          </p>
        </div>
      )}

      {/* Pagination Dots - Based on filter categories */}
      <div className="flex w-full justify-center py-6">
        <PaginationDots
          total={filterCategories.length}
          activeIndex={getActiveDotIndex()}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
};
