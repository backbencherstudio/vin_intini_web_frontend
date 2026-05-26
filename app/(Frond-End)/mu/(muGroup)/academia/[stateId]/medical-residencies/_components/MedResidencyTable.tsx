"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { MedicalResidencyPrograms } from "@/public/demoData/DemoData";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function MedResidencyTable({ data }: { data: any[] }) {
  const params = useParams();
  const stateId = params.stateId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const getRedirectWithoutLast = (r?: string) => {
    if (!r) return undefined;
    const parts = r.split("_");
    parts.pop();
    const next = parts.join("_");
    return next || undefined;
  };

  const columns = [
    {
      label: "SL",
      accessor: "__",
      width: "30px",
      formatter: (accessor: string, row: any, index: number) => (
        <div className="w-full h-full text-start pl-2 text-[#0B0B0B]">
          {index + 1}
        </div>
      ),
    },
    {
      label: "Universities",
      accessor: "program_name",
      width: "300px",
      formatter: (accessor: string, row: any) => (
        <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
          {accessor}
        </div>
      ),
    },
    {
      label: "Degrees",
      accessor: "degree_types",
      width: "170px",
      formatter: (accessor: string[], row: any) => (
        <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B]">
          {accessor?.join(", ") || "--"}
        </div>
      ),
    },
    {
      label: "Location",
      accessor: "location",
      width: "170px",
      formatter: (accessor: string, row: any) => (
        <div className="w-full h-full text-start pl-2 py-3 text-[#0B0B0B] whitespace-nowrap">
          {accessor}
        </div>
      ),
    },
  ];

  return (
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
          rounded: "8px",
        }}
        rowStyle={{
          hover: true,
          hoverbg: "hover:bg-[#ECEFF3]",
          rowClickable: true,
          rowClick: (row: any) => {
            const params = new URLSearchParams(window.location.search);
            params.set("location", `${row.latitude},${row.longitude}`);
            if (redirect) {
              const newRedirect = getRedirectWithoutLast(redirect);
              if (newRedirect) params.set("redirect", newRedirect);
              else params.delete("redirect");
            }

            if(row?.latitude && row?.longitude && stateId){
                router.push(`/mu/academia/${stateId}?${params.toString()}`);
            }
          },
        }}
      />
    </div>
  );
}
