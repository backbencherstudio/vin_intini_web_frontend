"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FilterIcon, SearchIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";

type PropType = {
    title: string;
    description?: string;
    selectedDegree?: string;
    setSelectedDegree?: (value: string) => void;
    filterData?: {
        key: string;
        label: string;
    }[];
    onSearch?: (query: string) => void;
    searchPlaceHolder?: string;
};

export default function AcademiHeader({
    selectedDegree,
    setSelectedDegree,
    filterData,
    title,
    description,
    onSearch,
    searchPlaceHolder = "Search...",
}: PropType) {
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Title */}
            <div className="space-y-1 md:space-y-2">
                <h1 className="text-headerColor text-2xl sm:text-3xl md:text-[32px] font-semibold leading-[130%]">
                    {title}
                </h1>
                {description && (
                    <p className="text-descriptionColor text-sm sm:text-base font-normal leading-[150%] tracking-[0.08px]">
                        {description}
                    </p>
                )}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 md:justify-between">
                {/* Filter */}
                {filterData && (
                    <div className="max-w-60.5 px-2 py-1 grid grid-cols-[auto_1fr] gap-2 md:gap-3 items-center bg-[#F6F8FA] w-full md:w-fit rounded-lg">
                        <h2 className="text-descriptionColor text-sm md:text-base font-normal leading-[150%] tracking-[0.08px] whitespace-nowrap">
                            Filter Degree
                        </h2>
                        <Select
                            value={selectedDegree}
                            onValueChange={setSelectedDegree}
                        >
                            <SelectTrigger className="bg-white w-full md:w-32.5 grid grid-cols-[auto_1fr_auto] focus-visible:border-[#e5e5e5] focus-visible:ring-0">
                                <FilterIcon className="w-4 h-4 md:w-5 md:h-5" />
                                <SelectValue placeholder="Select a degree" />
                            </SelectTrigger>
                            <SelectContent className="z-99">
                                <SelectGroup>
                                    <SelectItem value="all">All</SelectItem>
                                    {filterData.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Search */}
                {onSearch && (
                    <div className="w-full flex flex-col sm:flex-row justify-end gap-2 md:gap-3">
                        <div className="flex-1 max-w-80 flex items-center gap-2 px-3 py-2 border border-[#A5A5AB] rounded-full">
                            <SearchIcon className="w-4 h-4 md:w-5 md:h-5" />
                            <input
                                type="text"
                                id="search"
                                placeholder={searchPlaceHolder}
                                className="w-full outline-none text-sm md:text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => onSearch(searchQuery)}
                            className="px-6 sm:px-8 md:px-9 py-2 bg-primaryColor text-white rounded-full text-sm md:text-base font-semibold leading-[150%] tracking-[0.08px] hover:bg-[#] hover:text-[#ffffff] cursor-pointer"
                        >
                            Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}