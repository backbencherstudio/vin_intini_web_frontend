"use client";

import { Filter } from "lucide-react";
import type { ReactNode } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AdminFilterPopoverProps = {
  children: ReactNode;
  activeCount?: number;
  onReset?: () => void;
  title?: string;
  description?: string;
};

export default function AdminFilterPopover({
  children,
  activeCount = 0,
  onReset,
  title = "Filters",
  description = "Choose what to show in the list.",
}: AdminFilterPopoverProps) {
  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={activeCount ? `Filters, ${activeCount} active` : "Filters"}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 text-gray-500" />
          Filter
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primaryColor px-1.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(25rem,calc(100vw-2rem))] overflow-visible rounded-xl border-gray-200 bg-white p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primaryColor/10 text-primaryColor">
              <Filter className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              <p className="mt-0.5 text-xs text-gray-500">{description}</p>
            </div>
          </div>
          {onReset && (activeCount > 0) && (
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-primaryColor transition-colors hover:bg-primaryColor/10"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-x-3 gap-y-4 p-4 sm:grid-cols-2">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}
