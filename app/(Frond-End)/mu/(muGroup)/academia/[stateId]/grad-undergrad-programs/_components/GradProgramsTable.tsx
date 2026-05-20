"use client"

import DynamicTable from "@/components/reusable/DynamicTable";

type PropType = {
    data: any[];
}

export default function GradprogramsTable({ data }: PropType) {

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
            accessor: "name",
            width: "300px",
            formatter: (accessor: string, row: any) => (
                <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
                    {accessor}
                </div>
            ),
        },
        {
            label: "Psychology Degrees",
            accessor: "psychology_degrees",
            width: "170px",
            formatter: (accessor: string[], row: any) => (
                <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
                    {accessor?.join(", ") || "--"}
                </div>
            ),
        },
        {
            label: "Counseling Degrees",
            accessor: "counseling_degrees",
            width: "190px",
            formatter: (accessor: string[], row: any) => (
                <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
                    {accessor?.join(", ") || "--"}
                </div>
            ),
        },
        {
            label: "Neuroscience Degrees",
            accessor: "neuroscience_degrees",
            width: "190px",
            formatter: (accessor: string[], row: any) => (
                <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
                    {accessor?.join(", ") || "--"}
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