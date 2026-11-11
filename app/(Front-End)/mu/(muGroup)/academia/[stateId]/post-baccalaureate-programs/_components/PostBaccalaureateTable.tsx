"use client";

import DynamicTable from "@/components/reusable/DynamicTable";
import { PostBaccalaureateProgramType } from "@/lib/type";
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface PostBaccalaureateTableProps {
  data: PostBaccalaureateProgramType[];
  currentPage: number;
  limit: number;
  sort: "asc" | "desc";
  onToggleSort: () => void;
}

export default function PostBaccalaureateTable({
  data,
  currentPage = 1,
  limit = 10,
  sort,
  onToggleSort,
}: PostBaccalaureateTableProps) {
  const params = useParams();
  const stateId = (params?.stateId as string) || "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const getRedirectWithoutLast = (r?: string | null) => {
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
      formatter: (
        _accessor: unknown,
        _row: PostBaccalaureateProgramType,
        index: number,
      ) => (
        <div className="w-full h-full text-start pl-2 text-[#0B0B0B]">
          {index + 1 + (currentPage - 1) * limit}
        </div>
      ),
    },
    {
      label: "Universities",
      accessor: "program_name",
      width: "260px",
      sortable: true,
      sortFunction: onToggleSort,
      formatter: (accessor: string) => (
        <div className="w-full h-full text-start pl-2 pr-2 py-3 text-[#0B0B0B]">
          {accessor}
        </div>
      ),
    },
    {
      label: "Degree/Recognition",
      accessor: "degree_recognitions",
      width: "220px",
      position: "justify-center",
      formatter: (accessor: string[]) => (
        <div className="w-full h-full text-center pl-2 py-3 text-[#0B0B0B]">
          {accessor && accessor.length > 0 ? accessor.join(", ") : "--"}
        </div>
      ),
    },
    {
      label: "Location",
      accessor: "location",
      width: "190px",
      position: "justify-center",
      formatter: (accessor: string | null) => (
        <div className="w-full h-full text-center pl-2 py-3 text-[#0B0B0B]">
          {accessor || "--"}
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
          rowClickCheck: "latitude,longitude",
          rowClickable: true,
          rowClick: (row: PostBaccalaureateProgramType) => {
            if (!row?.latitude || !row?.longitude || !stateId) {
              return;
            }
            const nextParams = new URLSearchParams(window.location.search);
            nextParams.set("location", `${row.latitude},${row.longitude}`);
            if (redirect) {
              const newRedirect = getRedirectWithoutLast(redirect);
              if (newRedirect) nextParams.set("redirect", newRedirect);
              else nextParams.delete("redirect");
            }
            router.push(`/mu/academia/${stateId}?${nextParams.toString()}`);
          },
        }}
        sortConfig={{
          key: "program_name",
          direction: sort === "asc" ? "ascending" : "descending",
        }}
      />
    </div>
  );
}
