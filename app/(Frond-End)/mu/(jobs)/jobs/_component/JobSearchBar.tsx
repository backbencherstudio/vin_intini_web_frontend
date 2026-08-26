"use client";

import React, { useState } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import { FILTER_TYPES } from "./jobdata";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(query.trim());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSubmit} className="relative w-full sm:flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Job.."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-primaryColor transition-colors"
          />
        </form>
        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer sm:w-auto px-7 py-2.5 bg-primaryColor hover:shadow-xl text-white rounded-full text-sm font-medium transition-colors"
        >
          Search
        </button>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <span>Filter</span>
          <FiSliders className="text-sm" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_TYPES.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-5 py-2 cursor-pointer hover:shadow-xl rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primaryColor text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
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
