// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/biotechnology/_components/AssessmentGrid.tsx

"use client";

import { useState, useMemo } from "react";
import { AssessmentCard as AssessmentCardType } from "../_mock/biotechnologyData";
import { AssessmentCard } from "./AssessmentCard";
import {
  AssessmentFilterTabs,
  type FilterCategory,
} from "./AssessmentFilterTabs";
import { PaginationDots } from "../../_components";

interface AssessmentGridProps {
  title?: string;
  items: AssessmentCardType[];
  filterCategories: readonly FilterCategory[];
}

const ITEMS_PER_PAGE = 4;

export const AssessmentGrid = ({
  title,
  items,
  filterCategories,
}: AssessmentGridProps) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);

  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((card) => card.category === activeFilter);
  }, [items, activeFilter]);

  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

  const paginatedCards = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCards.slice(start, end);
  }, [filteredCards, currentPage]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(0);
  };

  const getActiveDotIndex = () => {
    const filterIndex = filterCategories.findIndex(
      (cat) => cat.id === activeFilter,
    );
    return filterIndex >= 0 ? filterIndex : 0;
  };

  const handleDotClick = (index: number) => {
    if (index < filterCategories.length) {
      setActiveFilter(filterCategories[index].id);
      setCurrentPage(0);
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-6">
      {/* Optional Section Title */}
      {title && (
        <h3 className="self-stretch font-['Segoe_UI'] text-base font-semibold leading-[150%] tracking-[0.08px] text-[#1D1F2C]">
          {title}
        </h3>
      )}

      {/* Filter Tabs */}
      <div className="flex w-full items-center">
        <AssessmentFilterTabs
          categories={filterCategories}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {paginatedCards.map((card) => (
          <AssessmentCard key={card.id} card={card} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="flex w-full justify-center py-12">
          <p className="text-[#A5A5AB] font-['Segoe_UI'] text-base">
            No assessments found in this category
          </p>
        </div>
      )}

      {/* Pagination Dots - Only show if you want pagination by filter */}
      <div className="flex w-full justify-center py-6">
        <PaginationDots
          total={filterCategories.length}
          activeIndex={getActiveDotIndex()}
          onDotClick={handleDotClick}
        />
      </div>

      {/* Load More Button (Mobile) */}
      {filteredCards.length > ITEMS_PER_PAGE &&
        currentPage < totalPages - 1 && (
          <div className="flex w-full items-center justify-center">
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex items-center justify-center gap-1 rounded-lg border border-[#DFE1E7] px-3 py-1 md:hidden"
            >
              <span className="font-['Segoe_UI'] text-sm text-[#4A4C56]">
                Load more
              </span>
            </button>
          </div>
        )}
    </div>
  );
};
