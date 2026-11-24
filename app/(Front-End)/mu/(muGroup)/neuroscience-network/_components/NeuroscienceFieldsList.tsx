"use client";

import { useMemo } from "react";
import { NeuroscienceField } from "../_mock/neuroscienceData";
import { NeuroscienceFieldItem } from "./NeuroscienceFieldItem";

interface NeuroscienceFieldsListProps {
  fields: NeuroscienceField[];
  searchQuery?: string;
}

export const NeuroscienceFieldsList = ({
  fields,
  searchQuery = "",
}: NeuroscienceFieldsListProps) => {
  // Filter fields based on search query
  const filteredFields = useMemo(() => {
    if (!searchQuery.trim()) return fields;

    return fields.filter((field) =>
      field.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [fields, searchQuery]);

  // If no results after search (only when search is active)
  if (searchQuery.trim() && filteredFields.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-12">
        <p className="text-[#A5A5AB] text-lg">
          No neuroscience fields found matching &quot;{searchQuery}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Fields List */}
      <div className="flex w-full flex-col gap-4 pb-10">
        {filteredFields.length > 0 ? (
          filteredFields.map((field) => (
            <NeuroscienceFieldItem key={field.id} field={field} />
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center border-b border-[#DFE1E7] bg-[#F6F8FA] p-12">
            <p className="text-[#A5A5AB] text-base">
              No fields to display
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
