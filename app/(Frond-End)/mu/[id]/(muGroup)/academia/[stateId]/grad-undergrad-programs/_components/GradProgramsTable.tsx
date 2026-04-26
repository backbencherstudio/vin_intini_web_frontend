"use client"

import DynamicTable from "@/components/reusable/DynamicTable";
import { gradProgramsData } from "@/public/demoData/DemoData";


export default function GradprogramsTable() {

    const columns = [
        {
            label: "SL",
            accessor: "__",
            width: "30px",
            formatter: (accessor: string, row: any,index: number) => (
                <div className="w-full h-full text-start pl-2 text-[#0B0B0B]">
                    {index + 1}
                </div>
            ),
        },
        {
            label: "Universities",
            accessor: "universityName",
            width: "300px",
            formatter: (accessor: string, row: any) => (
                <div className="w-full h-full text-start pl-2 py-1.5 text-[#0B0B0B]">
                    {accessor}
                </div>
            ),
        },
        {
            label: "Psychology Degrees",
            accessor: "psychologyDegrees",
            width: "170px",
            formatter: (accessor: string[], row: any) => (
                <div className="w-full h-full text-start pl-2 py-1.5 text-[#0B0B0B]">
                    {accessor.join(", ")}
                </div>
            ),
        },
        {
            label: "Neuroscience Degrees",
            accessor: "neuroscienceDegrees",
            width: "190px",
            formatter: (accessor: string[], row: any) => (
                <div className="w-full h-full text-start pl-2 py-1.5 text-[#0B0B0B]">
                    {accessor.join(", ")}
                </div>
            ),
        },
    ]

    return(
        <div>
            <DynamicTable
                columns={columns}
                data={gradProgramsData}
                header={{
                    position: "justify-start",
                    padding: "8px 0px 8px 8px",
                    bg: "#E9E9EA",
                    text: "#0B0B0B",
                    fontWeight: "600",
                    fontSize: "16px",
                    rounded: "8px"
                }}
                rowStyle={{
                    hover: true,
                    hoverbg: "hover:bg-[#A5A5AB]"
                }}
            />
        </div>
    )
}