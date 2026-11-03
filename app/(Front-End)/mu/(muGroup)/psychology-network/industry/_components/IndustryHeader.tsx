// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/IndustryHeader.tsx

"use client";

import { SearchInput } from "../../_components/SearchInput";
import { FilterButton } from "../../_components/FilterButton";

interface IndustryHeaderProps {
  onSearch?: (value: string) => void;
  title: string;
  description?: string;
}

export const IndustryHeader = ({
  onSearch = () => {},
  title,
  description,
}: IndustryHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-start">
      {/* Desktop Layout */}
      <div className="hidden w-full flex-col items-start justify-between md:flex">
        <h1 className="text-xl sm:text-2xl font-bold text-headerColor leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-descriptionColor mt-1 font-normal">
            {description}
          </p>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="flex w-full flex-col gap-1 md:hidden">
        <h1 className="text-xl font-bold text-headerColor leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-descriptionColor font-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
