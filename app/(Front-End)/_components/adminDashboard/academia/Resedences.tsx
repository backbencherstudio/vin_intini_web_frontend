"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon, MoveUpRight, Plus, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import AdminFilterPopover from "@/components/reusable/dashboard/AdminFilterPopover";
import MedicalResidencyForm from "./Edit&PostResencesModal";
import {
  useDeleteResedencyMutation,
  useGetAllResidenciesQuery,
} from "@/feature/slice/admin/academia/ResedencesSlice";
import Pagination from "@/components/reusable/Pagination";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";

type Job = {
  id: number;
  program_name: string;
  location: string;
  phone: string | null;
  state: string;
  "degree-types": string[];
  map_pin: {
    latitude: string;
    longitude: string;
  } | null;
  website: string;
};
export default function Resedences() {
  const [search, setSearch] = useState("");
  const [stateId, setStateId] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { data: residency, isLoading } = useGetAllResidenciesQuery({
    search,
    state_id: stateId,
    per_page: perPage,
    page,
  });
  const residencyData = residency?.data ?? [];

  const [jobs, setJobs] = useState<Job[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sort, setSort] = useState("default");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [deleteResedencyData, { isLoading: isDeleting }] =
    useDeleteResedencyMutation();

  const { data: statesData } = useGetAllStateQuery({});
  const states = statesData?.data ?? [];

  const openAdd = () => {
    setSelectedJob(null);
    setAddOpen(true);
  };

  const openEdit = (job: Job) => {
    setSelectedJob(job);
    setEditOpen(true);
  };

  const openDelete = (job: Job) => {
    setSelectedJob(job);
    setDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedJob) return;

    try {
      await deleteResedencyData(selectedJob.id).unwrap();

      setDeleteOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Failed to delete university:", error);
    }
  };

  const columns: Column<Job>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="text-[#0A0A0A]  text-[14px] font-semibold">
          {row.id}
        </span>
      ),
    },
    {
      header: "Program Name",
      accessor: "program_name",
      cell: (row) => (
        <span className="text-[#0A0A0A]  text-[14px] font-semibold">
          {row.program_name}
        </span>
      ),
    },
    {
      header: "State",
      accessor: "state",
      cell: (row) => <CustomBadge color="gray">{row.state}</CustomBadge>,
    },
    // {
    //   header: "Psychology Degrees",
    //   accessor: "degreeType",
    //   cell: (row) => (
    //     <div className="flex gap-2 flex-wrap">
    //       {row.degreeType.map((degree, index) => (
    //         <CustomBadge
    //           key={index}
    //           color="green"
    //           className="text-[14px] font-normal text-[#0A0A0A]"
    //         >
    //           {degree}
    //         </CustomBadge>
    //       ))}
    //     </div>
    //   ),
    // },
    {
      header: "Map Pin (Lat,Long)",
      cell: (row: any) => (
        <span className="text-[#006EFF] text-xs font-semibold">
          {row?.map_pin
            ? `${row.map_pin.latitude},${row.map_pin.longitude}`
            : "-"}
        </span>
      ),
    },
    {
      header: "Website",
      accessor: "website",
      cell: (row) => (
        <a
          href={
            row.website
              ? row.website.startsWith("http")
                ? row.website
                : `https://${row.website}`
              : `https://www.google.com/search?q=${encodeURIComponent(
                  row.program_name || "",
                )}`
          }
          target="_blank"
          rel="noreferrer"
          className="flex gap-1 text-[#006EFF] items-center ext-[#006EFF] text-right  text-[14px] font-semibold leading-[132%] tracking-[0.06px] cursor-pointer"
        >
          <MoveUpRight className="h-5 w-5" />
          Visit
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <CustomTitleDescription
        title="Manage Residencies"
        description={`${(residency?.pagination?.total ?? residencyData.length).toLocaleString()} residencies`}
        action={
          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />
              <CustomInput
                aria-label="Search university name"
                className="pl-7"
                placeholder="Search University Name"
                value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <AdminFilterPopover
              title="Filter residencies"
              activeCount={Number(Boolean(stateId))}
              onReset={() => { setStateId(""); setPage(1); }}
            >
              <CustomSelect
                label="State"
                value={stateId || "default"}
                onChange={(value) => {
                  setStateId(value === "default" ? "" : String(value));
                  setPage(1);
                }}
                options={[
                  {
                    label: "All states",
                    value: "default",
                  },
                  ...states.map((st: any) => ({
                    label: st.name,
                    value: String(st.id),
                  })),
                ]}
                placeholder="All states"
              />
            </AdminFilterPopover>

            <button
              onClick={openAdd}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add New Residency
            </button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={residencyData}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <Pagination
        page={page}
        pageSize={perPage}
        total={residency?.pagination?.total ?? 0}
        totalPages={residency?.pagination?.last_page ?? 0}
        onPageChange={setPage}
        showPageSize
        onPageSizeChange={(size) => {
          setPerPage(size);
          setPage(1);
        }}
      />

      {/* Add Modal */}
      <CustomModal
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Medical Residencies"
        size="lg"
      >
        <MedicalResidencyForm mode="add" onClose={() => setAddOpen(false)} />
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Medical Residencies"
        size="lg"
      >
        <MedicalResidencyForm
          mode="edit"
          onClose={() => setEditOpen(false)}
          initialData={
            selectedJob
              ? {
                  id: selectedJob.id,
                  programName: selectedJob.program_name,
                  state: selectedJob.state,
                  city: selectedJob.location,
                  latitude: selectedJob.map_pin?.latitude || "",
                  longitude: selectedJob.map_pin?.longitude || "",
                  degrees: selectedJob["degree-types"]?.join(", ") || "",
                  phoneNumber: selectedJob.phone || "",
                  website: selectedJob.website || "",
                }
              : undefined
          }
        />
      </CustomModal>

      {/* Delete Modal */}
      <CustomDeletModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteUser}
        title="Do you want to delete this residency?"
        description="Click “Delete Now” if you want to delete otherwise press cancel."
      />
    </div>
  );
}
