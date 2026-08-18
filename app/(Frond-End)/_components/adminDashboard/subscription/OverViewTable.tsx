"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownToLine, ArrowUpDown, Download, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";

type Job = {
    id: number;
    img: string;
    name: string;
    subscription: string;
    email: string;
    profession: string;
    connections: string;
    status: string;
    joined: string;
};

const initialJobs: Job[] = [
    {
        id: 1,
        img: userIcon.src,
        name: "Clinical Psychologist",
        subscription: "Premium",
        email: "rachel@gmail.com",
        profession: "Clinical Psychologist",
        connections: "125",
        status: "Active",
        joined: "2024-01-15",
    },
    {
        id: 2,
        img: userIcon.src,
        name: "Clinical Psychologist",
        subscription: "Premium",
        email: "rachel@gmail.com",
        profession: "Clinical Psychologist",
        connections: "125",
        status: "Active",
        joined: "2024-01-15",
    },
    {
        id: 3,
        img: userIcon.src,
        name: "Clinical Psychologist",
        subscription: "Premium",
        email: "rachel@gmail.com",
        profession: "Clinical Psychologist",
        connections: "125",
        status: "Suspended",
        joined: "2024-01-15",
    },
    {
        id: 4,
        img: userIcon.src,
        name: "Clinical Psychologist",
        subscription: "Premium",
        email: "rachel@gmail.com",
        profession: "Clinical Psychologist",
        connections: "125",
        status: "Suspended",
        joined: "2024-01-15",
    },
    {
        id: 5,
        img: userIcon.src,
        name: "Clinical Psychologist",
        subscription: "Premium",
        email: "rachel@gmail.com",
        profession: "Clinical Psychologist",
        connections: "125",
        status: "Active",
        joined: "2024-01-15",
    },
    {
        id: 6,
        img: userIcon.src,
        name: "Clinical Psychologist",
        subscription: "Premium",
        email: "rachel@gmail.com",
        profession: "Clinical Psychologist",
        connections: "125",
        status: "Active",
        joined: "2024-01-15",
    },
];

export default function OverViewTable() {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [sort, setSort] = useState("default");

    const [date, setDate] = useState<DateRange | undefined>(undefined);
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
            header: "Full Name",
            accessor: "name",
            cell: (row) => (
                <span className="flex items-center gap-2 font-medium text-gray-900">
                    {row.img && (
                        <Image
                            src={row.img}
                            alt={row.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    )}
                    {row.name}
                </span>
            ),
        },
        {
            header: "Subscriptions",
            accessor: "subscription",
            cell: (row) => (
                <CustomBadge color="orange" className="font-medium">
                    {row.subscription}
                </CustomBadge>
            ),
        },
        {
            header: "Email",
            cell: (row) => (
                <span className="text-[14px] font-normal text-[#0A0A0A]">
                    {row.email}
                </span>
            ),
        },
        {
            header: "Profession",
            cell: (row) => (
                <span className="text-[14px] font-normal text-[#0A0A0A]">
                    {row.profession}
                </span>
            ),
        },
        {
            header: "Connections",
            cell: (row) => (
                <span className="text-[14px] font-normal text-[#0A0A0A]">
                    {row.connections}
                </span>
            ),
        },
        {
            header: "Status",
            cell: (row) => (
                row.status === "Active" ? (
                    <CustomBadge color="active">{row.status}</CustomBadge>
                ) : (
                    <CustomBadge color="suspended">{row.status}</CustomBadge>
                )
            ),
        },
        {
            header: "Joined",
            cell: (row) => (
                <span className="text-[14px] font-normal text-[#0A0A0A]">
                    {row.joined}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row md:items-center">
                {/* Title */}
                <div className="mb-6  w-full">
                    <CustomTitleDescription
                        title="overview"
                        description="8,560 Premium Users"
                    />
                </div>

                {/* Actions */}
                <div className="mb-6 flex w-full justify-end">
                    <div className="flex w-full flex-col items-start gap-4 lg:w-auto lg:flex-row lg:items-center">

                        {/* Export */}


                        {/* Search */}
                        <div className="relative w-full ">
                            <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />

                            <input
                                className="h-10 w-full rounded-md border p-2 pl-7"
                                type="text"
                                placeholder="Search by user name, email or plan..."
                            />
                        </div>

                        <CustomSelect
                            className=" h-[38px]"
                            value={sort}
                            onChange={(value: string) =>
                                setSort(value === "default" ? "" : value)

                            }
                            options={[
                                {
                                    label: "All Plans",
                                    value: "default",
                                },
                                {
                                    label: "Premium",
                                    value: "Premium",
                                },
                                {
                                    label: "Basic",
                                    value: "Basic",
                                },
                                {
                                    label: "Pro Industry",
                                    value: "Pro Industry",
                                },

                            ]}
                        />

                        <CustomSelect
                            value={sort}
                            className=" h-[38px]"
                            onChange={(value: string) =>
                                setSort(value === "All Status" ? "" : value)

                            }
                            options={[
                                {
                                    label: "All Status",
                                    value: "default",
                                },
                                {
                                    label: "Suspended",
                                    value: "suspended",
                                },


                            ]}
                        />
                        <DateRangePicker className=" h-[38px]" date={date} setDate={setDate} placeholder='Select date range' />

                        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#04A1B7] px-4 py-2 text-white md:w-auto">
                            <ArrowDownToLine className="h-4 w-4" />
                            Export
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
                            Edit content here for {selectedJob.name}
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