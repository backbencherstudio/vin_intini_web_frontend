"use client";

import { SearchInput } from "./SearchInput";
import { FilterButton } from "./FilterButton";

interface PsychologyHeaderProps {
  onSearch: (value: string) => void;
}

export const PsychologyHeader = ({ onSearch }: PsychologyHeaderProps) => {
  return (
    <div className="flex w-full max-w-270.25 flex-col items-start gap-4 md:gap-10">
      {/* Desktop Layout */}
      <div className="hidden w-full items-center justify-between md:flex">
        <h1 className="flex-1 text-[#1D1F2C] font-['Segoe_UI'] text-[32px] font-semibold leading-[130%]">
          Fields of Psychology
        </h1>
        <div className="flex items-center gap-3">
          <SearchInput onSearch={onSearch} />
          <FilterButton onClick={() => onSearch("")} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex w-full flex-col gap-4 md:hidden">
        <h1 className="text-[#1D1F2C] font-['Segoe_UI'] text-2xl font-semibold leading-[130%]">
          Fields of Psychology
        </h1>
        <div className="flex w-full flex-col gap-3">
          <SearchInput onSearch={onSearch} />
          <FilterButton onClick={() => onSearch("")} />
        </div>
      </div>
    </div>
  );
};
