"use client"

import DynamicTable from "@/components/reusable/DynamicTable";
import { privateInstitutions } from "@/public/demoData/DemoData";
import { HospitalType } from "@/lib/type";

type PropType = {
    data: HospitalType[]
}

export default function ResidencyTable({ data }: PropType) {

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
            label: "Residency",
            accessor: "name",
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
                data={data}
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