"use client"

import { useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MedResidencyTable from "./_components/MedResidencyTable";
import Pagination from "@/components/reusable/Pagination";
import { Limits } from "@/public/staticData";
import { useGetResidenciesQuery } from "@/feature/slice/academia/academiaSlice";
import { useParams } from "next/navigation";
import TableLoading from "../grad-undergrad-programs/_components/TableLoading";

export default function page(){
    const [limit, setLimit] = useState<number>(10);
    const { stateId } = useParams();
    const { data, isLoading, error } = useGetResidenciesQuery(stateId);

    if(isLoading){
        return(
            <TableLoading />
        )
    }

    return(
        <div className="xl:pl-6 space-y-6">
            <AcademiHeader 
                title="Residency Programs"
                onSearch={(query) => console.log("Search query:", query)}
                searchPlaceHolder="Search Degree/ University..."
            />
            <MedResidencyTable data={data?.data || []} />
            <div className="flex items-center gap-4 justify-end">
                <Pagination
                    page={1}
                    pageSize={limit}
                    total={10}
                    totalPages={1}
                    onPageChange={(page) => console.log("Page changed to:", page)}
                />
                <Select
                    value={limit.toString()}
                    onValueChange={(value) => setLimit(Number(value))}
                >
                    <SelectTrigger className="bg-white min-w-20 focus-visible:border-[#A5A5AB] focus-visible:ring-0">
                        <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Limits.map((item) => (
                                <SelectItem key={item} value={item.toString()}>
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}