"use client"

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
}

export default function AcademiHeader({ 
    selectedDegree, 
    setSelectedDegree, 
    filterData,
    title,
    description,
    onSearch,
    searchPlaceHolder = "Search..."
}: PropType) {

    const [searchQuery, setSearchQuery] = useState<string>("")

    return(
        <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-headerColor text-[32px] font-semibold leading-[130%]">{title}</h1>
                    {description && <p className="text-descriptionColor text-base font-normal leading-[150%] tracking-[0.08px]">{description}</p>}
                </div>
                <div className="flex items-center gap-4 justify-between">
                    {filterData && <div className="px-2 py-1 grid grid-cols-[auto_1fr] gap-3 items-center bg-[#F6F8FA] w-fit rounded-lg">
                        <h2 className="text-descriptionColor text-base font-normal leading-[150%] tracking-[0.08px] whitespace-nowrap">Filter Degree</h2>
                        <Select
                            value={selectedDegree}
                            onValueChange={setSelectedDegree}

                        >
                            <SelectTrigger className="bg-white w-[130px] grid grid-cols-[auto_1fr_auto] focus-visible:border-[#e5e5e5] focus-visible:ring-0">
                                <FilterIcon className="w-5 h-5" />
                                <SelectValue placeholder="Select a degree" />
                            </SelectTrigger>
                            <SelectContent>
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
                    </div>}
                    {onSearch && <div className="w-full flex items-center justify-end gap-3">
                        <div className="flex-1 max-w-[300px] flex items-center gap-2 px-3 py-2 border border-[#A5A5AB] rounded-full">
                            <SearchIcon className="w-5 h-5"/>
                            <input
                                type="text"
                                id="search"
                                placeholder={searchPlaceHolder}
                                className="w-full outline-none "
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button type="button" onClick={()=>onSearch(searchQuery)} className="px-9 py-2 bg-primaryColor text-white rounded-full text-base font-semibold leading-[150%] tracking-[0.08px] hover:bg-[#] hover:text-[#ffffff] cursor-pointer">Search</button>
                    </div>}
                </div>
            </div>
    )
}