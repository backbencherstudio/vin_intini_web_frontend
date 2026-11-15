"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import React from "react";

export type StatusOption = {
  value: string;
  label: string;
  variant?: "active" | "warning" | "danger" | "neutral";
};

export function getStatusStyle(status: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  const s = status?.toLowerCase().trim();
  switch (s) {
    case "scheduled":
    case "upcoming":
      return {
        bg: "bg-[#EEF2FF]",
        text: "text-[#4F46E5]",
        border: "border-[#C7D2FE]",
        dot: "bg-[#4F46E5]",
      };
    case "active":
    case "published":
      return {
        bg: "bg-[#E6F8F6]",
        text: "text-[#009dae]",
        border: "border-[#b2e7e2]",
        dot: "bg-[#009dae]",
      };
    case "paused":
      return {
        bg: "bg-[#FEF3C7]",
        text: "text-[#D97706]",
        border: "border-[#FDE68A]",
        dot: "bg-[#D97706]",
      };
    case "closed":
      return {
        bg: "bg-[#F1F5F9]",
        text: "text-[#475569]",
        border: "border-[#CBD5E1]",
        dot: "bg-[#64748B]",
      };
    case "draft":
    case "reviewing":
    case "interviewed":
    case "pending":
    case "shortlisted":
      return {
        bg: "bg-[#FEF6E6]",
        text: "text-[#d97706]",
        border: "border-[#fde68a]",
        dot: "bg-[#d97706]",
      };
    case "expired":
    case "inactive":
    case "rejected":
      return {
        bg: "bg-[#FEECEC]",
        text: "text-[#eb3d4d]",
        border: "border-[#fecaca]",
        dot: "bg-[#eb3d4d]",
      };
    case "archive":
    case "archived":
    case "completed":
    default:
      return {
        bg: "bg-[#F1F5F9]",
        text: "text-[#475569]",
        border: "border-[#cbd5e1]",
        dot: "bg-[#64748b]",
      };
  }
}

interface CommonStatusDropdownProps {
  value: string;
  options?: StatusOption[];
  onChange?: (newValue: string) => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
}

export default function CommonStatusDropdown({
  value,
  options = [],
  onChange,
  isLoading = false,
  disabled = false,
  readOnly = false,
  className,
  align = "center",
}: CommonStatusDropdownProps) {
  const normalizedValue = value?.toLowerCase().trim();
  const currentOption = options.find(
    (opt) => opt.value.toLowerCase() === normalizedValue,
  );
  const fallbackLabel =
    normalizedValue === "archive" || normalizedValue === "archived"
      ? "Archived"
      : normalizedValue === "published"
        ? "Active"
        : value;
  const displayLabel = currentOption?.label || fallbackLabel;
  const style = getStatusStyle(normalizedValue);

  if (readOnly || !options.length || !onChange) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-none select-none",
          style.bg,
          style.text,
          style.border,
          className,
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)} />
        <span className="capitalize">{displayLabel}</span>
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled || isLoading}
          className={cn(
            "inline-flex items-center justify-between gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all shadow-none outline-none select-none cursor-pointer hover:shadow-xs active:scale-98 min-w-[90px]",
            style.bg,
            style.text,
            style.border,
            (disabled || isLoading) && "opacity-60 cursor-not-allowed",
            className,
          )}
        >
          <span className="flex items-center gap-1.5">
            {isLoading ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin shrink-0" />
            ) : (
              <span
                className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)}
              />
            )}
            <span className="capitalize">{displayLabel}</span>
          </span>
          <ChevronDown className="w-3 h-3 opacity-60 shrink-0 ml-0.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className="w-36 p-1.5 bg-white rounded-xl shadow-xl border border-borderColor z-[100000]"
      >
        {options.map((option) => {
          const isSelected =
            option.value.toLowerCase() === normalizedValue;
          const optStyle = getStatusStyle(option.value);

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => {
                if (!isSelected && onChange) {
                  onChange(option.value);
                }
              }}
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
                isSelected
                  ? "bg-slate-100 font-semibold text-headerColor"
                  : "text-gray-700 hover:bg-slate-50",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn("w-1.5 h-1.5 rounded-full shrink-0", optStyle.dot)}
                />
                <span>{option.label}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-primaryColor" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

