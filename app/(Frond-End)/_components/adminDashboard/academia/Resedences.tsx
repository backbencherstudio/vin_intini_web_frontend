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
import MedicalResidencyForm from "./Edit&PostResencesModal";

type Job = {
    id: number;
    programName: string;
    state: string;
    degreeType: string[];
    mapPin: string;
    website: string;
};

const initialJobs: Job[] = [
    {
        id: 1,
        programName: "University of Alabama Birmingham (UAB) Psychiatry Residency Program",
        state: "Alabama",
        degreeType: ["MS", "PhD"],
        mapPin: "34.94563, -67.34244",
        website: "Visit Now",
    },
    {
        id: 2,
        programName: "Alabama State University",
        state: "Alabama",
        degreeType: ["BA", "MS", "PhD"],
        mapPin: "87.89600, -76.35798",
        website: "Visit Now",
    },
    {
        id: 3,
        programName: "Auburn University. Geology",
        state: "Alabama",
        degreeType: ["MS", "PhD"],
        mapPin: "12.45678, -23.98765",
        website: "Visit Now",
    },
    {
        id: 4,
        programName: "Alcorn State University",
        state: "Alabama",
        degreeType: ["MBS"],
        mapPin: "56.43210, -12.34563",
        website: "Visit Now",
    },
];

export default function Resedences() {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [sort, setSort] = useState("default");
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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

    const handleDeleteUser = () => {
        if (selectedJob) {
            setJobs((prev) => prev.filter((item) => item.id !== selectedJob.id));
            setDeleteOpen(false);
            setSelectedJob(null);
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
            accessor: "programName",
            cell: (row) => (
                <span className="text-[#0A0A0A]  text-[14px] font-semibold">
                    {row.programName}
                </span>
            ),
        },
        {
            header: "State",
            accessor: "state",
            cell: (row) => <CustomBadge color="gray">{row.state}</CustomBadge>,
        },
        {
            header: "Psychology Degrees",
            accessor: "degreeType",
            cell: (row) => (
                <div className="flex gap-2 flex-wrap">
                    {row.degreeType.map((degree, index) => (
                        <CustomBadge
                            key={index}
                            color="green"
                            className="text-[14px] font-normal text-[#0A0A0A]"
                        >
                            {degree}
                        </CustomBadge>
                    ))}
                </div>
            ),
        },
        {
            header: "Map Pin (Lat,Long)",
            cell: (row) => (
                <span className="text-[#006EFF] text-xs font-semibold">
                    {row.mapPin}
                </span>
            ),
        },
        {
            header: "Website",
            accessor: "website",
            cell: (row) => (
                <span className="flex gap-1 text-[#006EFF] items-center text-[14px] font-semibold cursor-pointer">
                    <MoveUpRight className="h-5 w-5" />
                    {row.website}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="mb-6 w-full">
                    <CustomTitleDescription
                        title="Manage Universities"
                        description="Showing 1-20 of 1697 Records"
                    />
                </div>

                <div className="mb-6 flex w-full justify-end">
                    <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center">
                        {/* Search */}
                        <div className="relative w-full md:w-[220px]">
                            <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />
                            <input
                                className="h-10 w-full rounded-md border p-2 pl-7"
                                type="text"
                                placeholder="Search University Name"
                            />
                        </div>

                        {/* Filter */}
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="h-10 py-5 w-full cursor-pointer gap-2 md:w-[170px]">
                                <FilterIcon className="h-4 w-4" />
                                <SelectValue placeholder="Filter by state" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Filter by state</SelectItem>
                                <SelectItem value="connections">Connections</SelectItem>
                                <SelectItem value="z-a">Alphabet Z-A</SelectItem>
                                <SelectItem value="a-z">Alphabet A-Z</SelectItem>
                            </SelectContent>
                        </Select>

                        <button
                            onClick={openAdd}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white md:w-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Add New Residency
                        </button>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={jobs}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            {/* Add Modal */}
            <CustomModal
                open={addOpen}
                onOpenChange={setAddOpen}
                title="Add Medical Residencies"
                size="lg"
            >
                <MedicalResidencyForm
                    mode="add"
                    onClose={() => setAddOpen(false)}
                />
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
                                programName: selectedJob.programName,
                                state: selectedJob.state,
                                degrees: selectedJob.degreeType.join(", "),

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