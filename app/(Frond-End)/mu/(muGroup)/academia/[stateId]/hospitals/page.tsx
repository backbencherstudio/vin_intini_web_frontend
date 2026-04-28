"use client"

import { useState } from "react";
import AcademiHeader from "../_components/AcademiHeader";
import GradprogramsTable from "../grad-undergrad-programs/_components/GradProgramsTable";
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
import StateInstitutionTable from "./_components/StateInstitutionTable";
import HospitalTable from "./_components/HospitalTable";
import ResidencyTable from "./_components/ResidencyTable";

const tabs = [
    { label: "University Hospitals", value: "universityHospitals" },
    { label: "State Institutions", value: "stateInstitutions" },
    { label: "Medical Residency Programs", value: "medicalResidencyPrograms" },
]

export default function page() {

    const [selectedDegree, setSelectedDegree] = useState<string>("all")
    const [limit, setLimit] = useState<number>(10)
    const [ activeTab, setActiveTab] = useState<string>("universityHospitals")



    return (
        <div className="xl:pl-6 space-y-6">
            <AcademiHeader
                title="University Hospitals & State Institutions"
            />
            <div>
                <div className="flex w-fit bg-gray-200 rounded-md overflow-hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            className={`px-4 py-2 cursor-pointer ${
                                activeTab === tab.value
                                    ? "bg-blue-500 text-white rounded-md"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:rounded-md transition-colors duration-300"
                            }`}
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {activeTab === "stateInstitutions" && <StateInstitutionTable />}
                {activeTab === "universityHospitals" && <HospitalTable />}
                {activeTab === "medicalResidencyPrograms" && <ResidencyTable />}
            </div>
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