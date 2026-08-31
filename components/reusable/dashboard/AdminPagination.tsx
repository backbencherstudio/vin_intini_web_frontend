"use client";

import { LeftAngleIcon } from "@/public/svgIcons/Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaginationProps = {
  pagination: {
    current_page: number;
    total: number;
    total_page: number;
    limit: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function AdminPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const page = pagination?.current_page || 1;
  const pageSize = pagination?.limit || 10;
  const total = pagination?.total || 0;
  const totalPages = pagination?.total_page || 1;

  const getPages = () => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages,
    ];
  };

  if (!total) return null;

  return (
    <div className="mt-5 flex items-center justify-end gap-3">

      {/* Previous */}
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`flex items-center justify-center rounded-md border border-[#A5A5AB] bg-white py-1 pr-2 shadow-sm transition
          ${
            page === 1
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:bg-gray-50"
          }`}
      >
        <LeftAngleIcon className="h-5 w-5" />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      <ul className="flex items-center gap-3">
        {getPages().map((p, index) =>
          p === "..." ? (
            <li
              key={index}
              className="select-none text-gray-400"
            >
              ...
            </li>
          ) : (
            <li key={index}>
              <button
                type="button"
                disabled={page === p}
                onClick={() => onPageChange(Number(p))}
                className={`flex items-center justify-center rounded-md px-3 py-1 font-medium transition
                  ${
                    page === p
                      ? "cursor-default bg-[#E9E9EA] text-[#4A4C56]"
                      : "cursor-pointer text-[#4A4C56] hover:bg-gray-100"
                  }`}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ul>

      {/* Next */}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`flex items-center justify-center rounded-md border border-[#A5A5AB] bg-white py-1 pl-2 shadow-sm transition
          ${
            page === totalPages
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:bg-gray-50"
          }`}
      >
        <span>Next</span>
        <LeftAngleIcon className="h-5 w-5 rotate-180" />
      </button>

      {/* Result */}
      <Select
        value={String(pageSize)}
        onValueChange={(value) =>
          onPageSizeChange(Number(value))
        }
      >
        <SelectTrigger className="h-9 w-[110px] border-[#A5A5AB]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {[5, 10, 20, 50, 100].map((size) => (
            <SelectItem
              key={size}
              value={String(size)}
            >
              {size} Result
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}