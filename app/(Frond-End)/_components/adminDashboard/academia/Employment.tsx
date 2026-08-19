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
import AddEmployment from "./EmploymentAddModal";
import UpdateEmployment from "./EmploymentUpdate";

type Job = {
    id: number;
    state: string;
    category: string;
    mapPin: string;
    jobtitle: string;
    city: string;
    companyName: string;
    typemode: string[];
    saleryrange: string

};

const initialJobs: Job[] = [
    {
        id: 1,
        jobtitle: "Clinical Psychologist",
        companyName:
            "University of Alabama Birmingham (UAB) Psychiatry Residency Program",
        state: "Alabama",
        city: "Montgomery",
        category: "State Institution",
        mapPin: "Montgomery, Alabama",
        typemode: ["Full Time", "Hybrid"],
        saleryrange: "$80k-$85k"
    },
    {
        id: 2,
        jobtitle: "Clinical Psychologist",
        companyName:
            "University of Alabama Birmingham (UAB) Psychiatry Residency Program",
        state: "Alabama",
        city: "Montgomery",
        category: "State Institution",
        mapPin: "Montgomery, Alabama",
        typemode: ["Full Time", "Hybrid"],
        saleryrange: "$80k-$85k"
    }, {
        id: 3,
        jobtitle: "Clinical Psychologist",
        companyName:
            "University of Alabama Birmingham (UAB) Psychiatry Residency Program",
        state: "Alabama",
        city: "Montgomery",
        category: "University",
        mapPin: "Montgomery, Alabama",
        typemode: ["Full Time", "Hybrid"],
        saleryrange: "$80k-$85k"
    }, {
        id: 4,
        jobtitle: "Clinical Psychologist",
        companyName:
            "University of Alabama Birmingham (UAB) Psychiatry Residency Program",
        state: "Alabama",
        city: "Montgomery",
        category: "State Institution",
        mapPin: "Montgomery, Alabama",
        typemode: ["Full Time", "Hybrid"],
        saleryrange: "$80k-$85k"
    }, {
        id: 5,
        jobtitle: "Clinical Psychologist",
        companyName:
            "University of Alabama Birmingham (UAB) Psychiatry Residency Program",
        state: "Alabama",
        city: "Montgomery",
        category: "VA Facility",
        mapPin: "Montgomery, Alabama",
        typemode: ["Full Time", "Hybrid"],
        saleryrange: "$80k-$85k"
    }, {
        id: 6,
        jobtitle: "Clinical Psychologist",
        companyName:
            "University of Alabama Birmingham (UAB) Psychiatry Residency Program",
        state: "Alabama",
        city: "Montgomery",
        category: "State Institution",
        mapPin: "Montgomery, Alabama",
        typemode: ["Full Time", "Hybrid"],
        saleryrange: "$80k-$85k"
    },
];

export default function Employment() {
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
            header: "Job Title ",
            accessor: "jobtitle",
            cell: (row) => (
                <span className="flex items-center gap-2 overflow-hidden text-[#0A0A0A] text-ellipsis font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">

                    {row.jobtitle}
                </span>
            ),
        },
        {
            header: "Company Name ",
            accessor: "companyName",
            cell: (row) => (
                <span className="flex items-center gap-2 overflow-hidden text-[#0A0A0A] text-ellipsis font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">

                    {row.companyName}
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
            header: "City",
            accessor: "city",
            cell: (row) => (
                <CustomBadge color="yellow">
                    {row.city}
                </CustomBadge>
            ),
        },

        {
            header: "Category",
            accessor: "category",
            cell: (row) => (
                <CustomBadge color={row.category === "State Institution" ? "orange" : row.category === "University Hospital" ? "blue" : "green"}>
                    {row.category}
                </CustomBadge>

            ),
        },






        {
            header: "Type and Mode",
            cell: (row) => (
                <div className="flex gap-2">
                    {row.typemode.map((mode, index) => (
                        <CustomBadge key={index} color="blue">
                            {mode}
                        </CustomBadge>
                    ))}
                </div>
            ),
        },

        {
            header: "Salary Range",
            accessor: "saleryrange",
            cell: (row) => (
                <span className="flex items-center gap-2 overflow-hidden text-[#04A1B7] text-ellipsis font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                    {row.saleryrange}
                </span>
            )

        }

        // {
        //     header: "Website",
        //     accessor: "website",
        //     cell: (row) => (
        //         <span className="flex gap-1 text-[#006EFF] items-center ext-[#006EFF] text-right font-['Segoe_UI'] text-[14px] font-semibold leading-[132%] tracking-[0.06px] cursor-pointer">
        //             <MoveUpRight className="h-5 w-5" />  {row.website}
        //         </span>
        //     ),
        // },

    ];

    return (
        <div>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                {/* Title */}
                <div className="mb-6  w-full">
                    <CustomTitleDescription
                        title="Manage Job Openings"
                        description="Showing 1-20 of 456 Programs"
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

                        <button onClick={() => setViewOpen(true)} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#04A1B7] px-4 py-2 text-white md:w-auto">
                            <Plus className="h-4 w-4" />
                            Add New Job
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
                <CustomModal
                    open={viewOpen}
                    onOpenChange={setViewOpen}
                    title="Add New Job"
                    size="lg"
                >
                    <AddEmployment onClose={() => setViewOpen(false)} />
                </CustomModal>

                {/* Edit Job */}
                <CustomModal
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    title="Edit Job"
                    size="lg"
                >
                    {selectedJob && (
                        <div className="p-6">
                            <UpdateEmployment onClose={() => setEditOpen(false)} data={selectedJob} />
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