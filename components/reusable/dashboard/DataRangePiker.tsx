// components/reusable/DateRangePicker.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    placeholder?: string;
    className?: string;
}

export function DateRangePicker({
    date,
    setDate,
    placeholder = "Select date range",
    className,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const formatDateRange = () => {
        if (!date?.from) return placeholder;
        if (date.to) {
            return `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`;
        }
        return `${format(date.from, "MMM d, yyyy")} - Select end`;
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
                id="date"
                className={cn(
                    "flex h-8 w-full items-center justify-start gap-2 rounded-lg border border-[#E5E7EB] bg-background px-2.5 text-left text-sm font-normal transition-all outline-none hover:bg-gray-50 sm:max-w-56",
                    !date ? "text-[#9CA3AF]" : "text-[#151513]",
                    className
                )}
            >
                <CalendarIcon className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
                <span className="truncate">{formatDateRange()}</span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" sideOffset={4}>
                <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className="rounded-md border"
                />
                <div className="flex items-center justify-end gap-2 border-t p-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDate(undefined)}
                        className="text-xs text-[#6B7280] hover:text-[#151513]"
                    >
                        Clear
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="bg-[#151513] text-white hover:bg-[#2a2a29]"
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}