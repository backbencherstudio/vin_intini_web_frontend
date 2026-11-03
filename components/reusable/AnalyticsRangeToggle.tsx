"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AnalyticsRangeToggleProps {
  value: "weekly" | "monthly";
  onChange: (value: "weekly" | "monthly") => void;
  className?: string;
}

export default function AnalyticsRangeToggle({
  value,
  onChange,
  className,
}: AnalyticsRangeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center bg-[#f1f5f9] p-1 rounded-lg border border-borderColor/60 self-start sm:self-auto",
        className,
      )}
    >
      {(["weekly", "monthly"] as const).map((rangeKey) => {
        const isSelected = value === rangeKey;
        return (
          <button
            key={rangeKey}
            type="button"
            onClick={() => onChange(rangeKey)}
            className={cn(
              "px-3.5 py-1 text-xs font-semibold rounded-md transition-all capitalize cursor-pointer select-none",
              isSelected
                ? "bg-white text-headerColor shadow-xs font-bold"
                : "text-gray-500 hover:text-headerColor",
            )}
          >
            {rangeKey}
          </button>
        );
      })}
    </div>
  );
}

