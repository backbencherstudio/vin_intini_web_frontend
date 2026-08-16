"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownToLine, ArrowUpDown, Download, FilterIcon, Plus, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import { sankeyPayloadSearcher } from "recharts/types/chart/Sankey";

type Job = {
    id: number;
    network: string;
    industry: string;
    img: string;
    partnerName: string;
    tag: string;
    description: string;
};

const initialJobs: Job[] = [
    {
        id: 1,
        network: "Psychology",
        industry: "Publications",
        img: userIcon.src,
        partnerName: "Clinical Psychologist",
        tag: "MS",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"

    },
    {
        id: 1,
        network: "Psychology",
        industry: "Publications",
        img: userIcon.src,
        partnerName: "Clinical Psychologist",
        tag: "MS",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"

    },
    {
        id: 1,
        network: "Psychology",
        industry: "Biotechnology",
        img: userIcon.src,
        partnerName: "Clinical Psychologist",
        tag: "MS",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"

    },
    {
        id: 1,
        network: "Neuroscience",
        industry: "Publications",
        img: userIcon.src,
        partnerName: "Clinical Psychologist",
        tag: "MS",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"

    },
    {
        id: 1,
        network: "Psychology",
        industry: "Biotechnology",
        img: userIcon.src,
        partnerName: "Clinical Psychologist",
        tag: "MS",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"

    },
    {
        id: 1,
        network: "Neuroscience",
        industry: "Publications",
        img: userIcon.src,
        partnerName: "Clinical Psychologist",
        tag: "MS",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"

    },
];

export default function Partner() {
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
                <span className="text-gray-500">{row.id}</span>
            ),
        },
        {
            header: "Network",
            accessor: "network",
            cell: (row: any) => (
                row.network === "Psychology" ? (
                    <CustomBadge color="blue">{row.network}</CustomBadge>
                ) : (
                    <CustomBadge color="green">{row.network}</CustomBadge>
                )
            )
        },
        {
            header: "Industry",
            accessor: "industry",
            cell: (row) => {
                return (
                    <div className="text-[#0A0A0A] text-ellipsis font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                        {row.industry}
                    </div>
                )
            }

        },
        {
            header: "Partner Name",
            accessor: "partnerName",
            cell: (row) => (
                <span className="flex items-center gap-2 text-[#0A0A0A] text-ellipsis font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
                    {row.img && (
                        <Image
                            src={row.img}
                            alt={row.partnerName}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    )}
                    {row.partnerName}
                </span>
            ),
        },
        {
            header: "Tag",
            accessor: "tag",
            cell: (row) => (
                <CustomBadge color="yellow" className="font-medium">
                    {row.tag}
                </CustomBadge>
            ),
        },
        {
            header: "Descriptions",
            accessor: "description",
            cell: (row) => (
                <span className="text-[#4A4C56]  max-w-[400px] line-clamp-2 whitespace-pre-line text-ellipsis font-['Segoe_UI'] text-[14px] leading-[140%] tracking-[0.07px]">
                    {
                        row.description
                    }
                </span>
            )
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
                            Add New University
                        </button>

                    </div>
                </div>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={jobs}
                    defaultPageSize={10}
                    onView={openView}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />

                {/* View Job Details */}
                <CustomModal
                    open={viewOpen}
                    onOpenChange={setViewOpen}
                    showCloseButton={false}
                    size="lg"
                >
                    <div>

                    </div>
                </CustomModal>

                {/* Edit Job */}
                <CustomModal
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    size="lg"
                >
                    {selectedJob && (
                        <div className="p-6">
                            Edit content here for {selectedJob.partnerName}
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