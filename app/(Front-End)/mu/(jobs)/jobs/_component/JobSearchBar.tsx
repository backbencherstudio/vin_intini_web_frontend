"use client";

import React, { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

import JobFilterModal from "./JobFilterModal";
import { JOB_TYPE_OPTIONS } from "./jobdata";

interface JobSearchBarProps {
  activeFilter: string;
  searchParam: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
}

export const JobSearchBar: React.FC<JobSearchBarProps> = ({
  activeFilter,
  searchParam,
  onFilterChange,
  onSearchChange,
}) => {
  const [query, setQuery] = useState(searchParam);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(query.trim());
  };

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSubmit} className="relative w-full sm:flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grayColor1 text-lg" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Job.."
            className="w-full rounded-full border border-borderColor bg-white py-2.5 pl-10 pr-4 text-sm transition focus:border-primaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor/10"
          />
        </form>
        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer rounded-full bg-primaryColor px-7 py-2.5 text-sm font-medium text-white transition hover:bg-primaryColor/90 sm:w-auto"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-borderColor bg-white px-5 py-2.5 text-sm text-descriptionColor transition hover:border-primaryColor/30 hover:bg-primaryColor/5 sm:w-auto"
        >
          <span>Filter</span>
          <FiSliders className="text-sm" />
        </button>
      </div>

      <JobFilterModal
        open={isFilterModalOpen}
        setOpen={setIsFilterModalOpen}
      />

      {/* Filter Tabs */}
      <div className="mt-5 flex items-center gap-2.5 overflow-x-auto pb-9 scrollbar-hide">
        {JOB_TYPE_OPTIONS.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primaryColor text-white"
                  : "border border-borderColor bg-white text-descriptionColor hover:border-primaryColor/30 hover:bg-primaryColor/5"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
