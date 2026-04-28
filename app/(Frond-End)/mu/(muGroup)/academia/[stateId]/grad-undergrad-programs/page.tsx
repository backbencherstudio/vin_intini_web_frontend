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

export default function page() {
    const [selectedDegree, setSelectedDegree] = useState<string>("all");
    const [limit, setLimit] = useState<number>(10);
    const params = useParams();
    const { data, isLoading, error } = useGetUndergradGradProgramsQuery(params.stateId);

    if(isLoading){
        return(
            <TableLoading />
        )
    }

    return (
        <div className="xl:pl-6 space-y-6">
            <AcademiHeader
                title="Graduate and Undergraduate Programs"
                description="See State Map for Doctorate Programs"
                selectedDegree={selectedDegree}
                setSelectedDegree={setSelectedDegree}
                filterData={[
                    { key: "ba-bs", label: "BA/BS" },
                    { key: "ma", label: "MA" },
                    { key: "phd", label: "PhD" },
                    { key: "ma-phd", label: "MA-PhD" },
                ]}
                onSearch={() => {}}
                searchPlaceHolder="Search Degree/ University..."
            />
            
            <GradProgramsTable data={data?.data || []} />
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
    );
}