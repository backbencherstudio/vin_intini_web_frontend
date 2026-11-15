"use client";

import { useState } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AdminDateFieldProps {
  label: string;
  required?: boolean;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  error?: string;
  helperText?: string;
}

export default function AdminDateField({
  label,
  required = false,
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  error,
  helperText,
}: AdminDateFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-xs font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-xl border bg-white px-3 text-xs transition-colors hover:bg-gray-50 focus:outline-none focus:border-[#04A1B7] cursor-pointer",
              error
                ? "border-red-500 ring-1 ring-red-500/20"
                : "border-gray-200",
              value ? "text-gray-900 font-medium" : "text-gray-400 font-normal"
            )}
          >
            <span className="truncate">
              {value ? format(value, "MMM dd, yyyy") : placeholder}
            </span>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(undefined);
                  }}
                  title="Clear date"
                  className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 bg-white z-[100000] rounded-xl shadow-xl border border-gray-200"
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            disabled={
              minDate
                ? (date) => isBefore(startOfDay(date), startOfDay(minDate))
                : undefined
            }
            onSelect={(selectedDate) => {
              onChange(selectedDate);
              setOpen(false);
            }}
          />
          {value && (
            <div className="flex items-center justify-end border-t border-gray-100 px-3 py-2">
              <button
                type="button"
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
                className="text-xs font-medium text-gray-500 hover:text-red-600 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-[11px] text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
