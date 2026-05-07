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
    const [page, setPage] = useState<number>(1);
    const [searchItem, setSearchItem] = useState<string>("");
    const { stateId } = useParams();
    const { data, isLoading, isFetching, error } = useGetResidenciesQuery({id: stateId, limit, page, searchItem});

    const handleSearch = (query: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("search", query);
        setSearchItem(query);
        console.log(searchParams.toString());
    };

    return(
        <div className="xl:pl-6 space-y-6">
            <AcademiHeader 
                title="Residency Programs"
                onSearch={handleSearch}
                searchPlaceHolder="Search Degree/ University..."
            />
            {(isFetching || isLoading) ? <TableLoading /> : <MedResidencyTable data={data?.data || []} />}
            <div className="flex items-center gap-4 justify-end">
                <Pagination
                    page={page}
                    pageSize={limit}
                    total={data?.total || 10}
                    totalPages={data?.total_page || 1}
                    onPageChange={(page) => setPage(page)}
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