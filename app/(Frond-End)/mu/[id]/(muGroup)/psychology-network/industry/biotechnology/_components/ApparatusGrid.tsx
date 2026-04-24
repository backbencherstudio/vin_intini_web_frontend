
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ApparatusCard as ApparatusCardType,
  ApparatusFilterCategory,
  apparatusCards,
  apparatusFilterCategories,
} from "../_mock/biotechnologyData";
import { ApparatusCard } from "./ApparatusCard";
import { ApparatusFilterTabs } from "./ApparatusFilterTabs";
import { PaginationDots } from "../../_components";

export const ApparatusGrid = () => {
  const [activeFilter, setActiveFilter] =
    useState<ApparatusFilterCategory>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    setIsMounted(true);
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return apparatusCards;
    return apparatusCards.filter((card) => card.category === activeFilter);
  }, [activeFilter]);

  const paginatedCards = useMemo(() => {
    if (!isMounted) {
      return filteredCards.slice(0, 4);
    }
    const end = (currentPage + 1) * itemsPerPage;
    return filteredCards.slice(0, end);
  }, [filteredCards, currentPage, itemsPerPage, isMounted]);

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
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
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

      {/* Load More Button */}
      {isMounted && filteredCards.length > itemsPerPage &&
        (currentPage + 1) * itemsPerPage < filteredCards.length && (
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
          total={apparatusFilterCategories.length}
          activeIndex={getActiveDotIndex()}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
};
