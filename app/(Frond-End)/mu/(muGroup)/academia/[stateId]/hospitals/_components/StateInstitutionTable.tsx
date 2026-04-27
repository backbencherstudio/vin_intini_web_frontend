"use client"

import DynamicTable from "@/components/reusable/DynamicTable";
import { stateInstitutions } from "@/public/demoData/DemoData";


export default function StateInstitutionTable() {

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
            label: "State Institutions",
            accessor: "stateInstitutionName",
            width: "300px",
            formatter: (accessor: string, row: any) => (
                <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
                    {accessor}
                </div>
            ),
        },
        {
            label: "Location",
            accessor: "location",
            width: "170px",
            formatter: (accessor: string, row: any) => (
                <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
                    {accessor}
                </div>
            ),
        },
    ]

    return(
        <div>
            <DynamicTable
                columns={columns}
                data={stateInstitutions}
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
                    hoverbg: "hover:bg-[#ECEFF3]"
                }}
            />
        </div>
    )
}