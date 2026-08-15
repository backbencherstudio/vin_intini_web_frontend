"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import TopHeader from "../_components/Top-Header";
import { useState } from "react";

type Job = {
    id: number;
    title: string;
    company: string;
    state: string;
    city: string;
    category: string;
    type: string;
    mode: string;
    salary: string;
};

const jobs: Job[] = [
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },

    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Birmingham",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },
    {
        id: 1,
        title: "Clinical Psychologist",
        company: "Bryce Hospital",
        state: "Alabama",
        city: "Huntsville",
        category: "State Institution",
        type: "Full Time",
        mode: "Hybrid",
        salary: "$80k-$85k",
    },


];


export default function JobsPage() {
    const [editOpen, setEditOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const openEdit = (job: Job) => {
        setSelectedJob(job);
        setEditOpen(true);
    };

    const columns: Column<Job>[] = [
        {
            header: "No.",
            cell: (row) => <span className="text-gray-500">{row.id}</span>,
        },
        {
            header: "Job Title",
            accessor: "title",
            cell: (row) => (
                <span className="font-medium text-gray-900">{row.title}</span>
            ),
        },
        {
            header: "Company Name",
            accessor: "company",
            cell: (row) => <span className="font-medium">{row.company}</span>,
        },
        {
            header: "State",
            cell: (row) => <CustomBadge color="gray">{row.state}</CustomBadge>,
        },
        {
            header: "City",
            cell: (row) => <CustomBadge color="yellow">{row.city}</CustomBadge>,
        },
        {
            header: "Category",
            cell: (row) => {
                const color =
                    row.category === "State Institution"
                        ? "orange"
                        : row.category === "University"
                            ? "blue"
                            : row.category === "VA Facility"
                                ? "cyan"
                                : "gray";
                return <CustomBadge color={color}>{row.category}</CustomBadge>;
            },
        },
        {
            header: "Type and Mode",
            cell: (row) => (
                <div className="flex gap-1.5">
                    <CustomBadge color="blue">{row.type}</CustomBadge>
                    <CustomBadge color="cyan">{row.mode}</CustomBadge>
                </div>
            ),
        },
        {
            header: "Salary Range",
            cell: (row) => (
                <span className="text-[#04A1B7] text-[14px] font-semibold">
                    {row.salary}
                </span>
            ),
        },
    ];

    return (
        <div>
            <DataTable
                columns={columns}
                data={jobs}
                defaultPageSize={10}
                onEdit={openEdit}
                onDelete={openEdit}         // ← এখানে connect করো
            // onDelete={(row) => console.log("Delete", row)}
            />

            <CustomModal
                open={editOpen}
                onOpenChange={setEditOpen}
                title="Edit Job"
                size="lg"
            >
                {selectedJob && (
                    <TopHeader
                    // এখানে selectedJob পাঠাতে পারো
                    // job={selectedJob}
                    // onSuccess={() => setEditOpen(false)}
                    />
                )}
            </CustomModal>
        </div>
    );
}