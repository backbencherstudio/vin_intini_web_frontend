"use client"

import { useEffect, useState } from "react"
import AcademiHeader from "../_components/AcademiHeader"
import GradProgramsTable from "./_components/GradProgramsTable"
import Pagination from "@/components/reusable/Pagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Limits } from "@/public/staticData";
import { useGetUndergradGradProgramsQuery } from "@/feature/slice/academia/academiaSlice";
import { useParams } from "next/navigation";
import TableLoading from "./_components/TableLoading";
import { useSearchParams } from "next/navigation";

export default function page() {
    const [selectedDegree, setSelectedDegree] = useState<string>("all");
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [searchItem, setSearchItem] = useState<string>("");
    const params = useParams();
    const { data, isLoading, isFetching, error } = useGetUndergradGradProgramsQuery({id: params.stateId, limit, page, searchItem, degree: selectedDegree === "all" ? "" : selectedDegree});

    // if(isLoading){
    //     return(
    //         <TableLoading />
    //     )
    // }

    const handleSearch = (query: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("search", query);
        setSearchItem(query);
        console.log(searchParams.toString());
    };

    return (
        <div className="xl:pl-6 space-y-6">
            <AcademiHeader
                title="Degree Programs"
                description="See State Map for Doctorate Programs"
                selectedDegree={selectedDegree}
                setSelectedDegree={setSelectedDegree}
                filterData={[
                    { key: "BA", label: "BA" },
                    { key: "BS", label: "BS" },
                    { key: "MA", label: "MA" },
                    { key: "PhD", label: "PhD" },
                    { key: "MS", label: "MS" },
                    { key: "MS (OL)", label: "MS (OL)" },
                ]}
                onSearch={handleSearch}
                searchPlaceHolder="Search Degree/ University..."
            />
            
            {(isFetching || isLoading) ? <TableLoading /> : <GradProgramsTable data={data?.data || []} />}
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
    );
}