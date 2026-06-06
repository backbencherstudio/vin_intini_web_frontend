"use client";

import { useState, useMemo, useEffect } from "react";
import {
  EquipmentCard as EquipmentCardType,
  FilterCategory,
  equipmentCards,
  filterCategories,
} from "../_mock/biotechnologyData";
import { EquipmentCard } from "./EquipmentCard";
import { FilterTabs } from "./FilterTabs";
import { PaginationDots } from "../../_components";

export const EquipmentGrid = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
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
    if (activeFilter === "all") return equipmentCards;
    return equipmentCards.filter((card) => card.category === activeFilter);
  }, [activeFilter]);

  const paginatedCards = useMemo(() => {
    const end = (currentPage + 1) * itemsPerPage;
    return filteredCards.slice(0, end);
  }, [filteredCards, currentPage, itemsPerPage]);

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
    <div className="flex w-full flex-col items-stretch gap-4">
      {/* Filter Tabs */}
      <div className="w-full min-w-0">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
        {paginatedCards.map((card, index) => (
          <EquipmentCard key={card.id} card={card} priority={index < 2} />
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
