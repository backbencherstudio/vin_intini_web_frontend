"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownToLine, ArrowUpDown, Download, FilterIcon, MoveUpRight, Plus, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import { neuroscienceFields } from "@/app/(Frond-End)/mu/(muGroup)/neuroscience-network/_mock/neuroscienceData";
import { spawn } from "child_process";

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
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [sort, setSort] = useState("default");

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const openView = (job: Job) => {
        setSelectedJob(job);
        setViewOpen(true);
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
            setJobs((prevJobs) => prevJobs.filter((item) => item.id !== selectedJob.id));
            console.log(`Deleted user with ID: ${selectedJob.id}`);
            setDeleteOpen(false);
            setSelectedJob(null);
        }
    };

    const columns: Column<Job>[] = [
        {
            header: "No.",
            cell: (row) => (
                <span className="overflow-hidden text-[#0A0A0A] text-ellipsis font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">{row.id}</span>
            ),
        },
        {
            header: "Program Name",
            accessor: "programName",
            cell: (row) => (
                <span className="flex items-center gap-2 overflow-hidden text-[#0A0A0A] text-ellipsis font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">

                    {row.programName}
                </span>
            ),
        },
        {
            header: "State",
            accessor: "state",
            cell: (row) => (
                <CustomBadge color="gray">
                    {row.state}
                </CustomBadge>
            ),
        },

        {
            header: "Psychology Degrees",
            accessor: "degreeType",
            cell: (row) => (
                <div className="flex gap-2">
                    {row.degreeType.map((degree, index) => {
                        return (
                            <CustomBadge color="green" className="text-[14px] font-normal text-[#0A0A0A]">
                                <span key={index}>{degree}</span>
                            </CustomBadge>
                        )
                    })}
                </div>

            ),
        },






        {
            header: "Map Pin (Lat,Long)",
            cell: (row) => (
                <span className="text-[#006EFF] text-right font-['Segoe_UI'] text-xs font-semibold leading-[132%] tracking-[0.06px]">
                    {row.mapPin}
                </span>
            ),
        },

        {
            header: "Website",
            accessor: "website",
            cell: (row) => (
                <span className="flex gap-1 text-[#006EFF] items-center ext-[#006EFF] text-right font-['Segoe_UI'] text-[14px] font-semibold leading-[132%] tracking-[0.06px] cursor-pointer">
                    <MoveUpRight className="h-5 w-5" />  {row.website}
                </span>
            ),
        },

    ];

    return (
        <div>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                {/* Title */}
                <div className="mb-6  w-full">
                    <CustomTitleDescription
                        title="Manage Universities"
                        description="Showing 1-20 of 1697 Records"
                    />
                </div>

                {/* Actions */}
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

                        {/* Sort */}
                        <Select
                            value={sort}
                            onValueChange={(value) => setSort(value)}
                        >
                            <SelectTrigger className="h-10 py-5 w-full cursor-pointer gap-2 md:w-[170px]">
                                < FilterIcon className="h-4 w-4" />
                                <SelectValue placeholder="Filter by state" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="default">
                                    Filter by state
                                </SelectItem>

                                <SelectItem value="connections">
                                    Connections
                                </SelectItem>

                                <SelectItem value="z-a">
                                    Alphabet Z-A
                                </SelectItem>

                                <SelectItem value="a-z">
                                    Alphabet A-Z
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#04A1B7] px-4 py-2 text-white md:w-auto">
                            <Plus className="h-4 w-4" />
                            Add New Residency
                        </button>

                    </div>
                </div>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={jobs}
                    defaultPageSize={10}

                    onEdit={openEdit}
                    onDelete={openDelete}
                />

                {/* View Job Details */}


                {/* Edit Job */}
                <CustomModal
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    size="lg"
                >
                    {selectedJob && (
                        <div className="p-6">
                            Edit content here for {selectedJob.programName}
                        </div>
                    )}
                </CustomModal>

                {/* Delete Job */}
                <CustomDeletModal
                    isOpen={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDeleteUser}
                    title="Do you want to delete this user?"
                    description="Click “Delete Now” if you want to delete otherwise press cancel."
                />
            </div>
        </div>
    );
}