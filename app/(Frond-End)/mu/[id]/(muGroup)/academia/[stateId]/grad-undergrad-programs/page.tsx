"use client"

import { useState } from "react"
import AcademiHeader from "../_components/AcademiHeader"
import GradProgramsTable from "./_components/GradProgramsTable"

export default function page() {
    const [selectedDegree, setSelectedDegree] = useState<string>("all")
    return (
        <div className="pl-6 space-y-6">
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
                onSearch={(query) => console.log("Search query:", query)}
                searchPlaceHolder="Search Degree/ University..."
            />
            <GradProgramsTable />
        </div>
    )
}