"use client";

import DataTable, {
    Column,
} from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import { Monitor } from "lucide-react";
import { useState } from "react";

type LoginActivity = {
    id: number;
    device: string;
    browser: string;
    location: string;
    ipAddress: string;
    date: string;
    time: string;
    status: "Successful" | "Failed";
};

const initialLoginActivities: LoginActivity[] = [
    {
        id: 1,
        device: "Windows",
        browser: "Chrome",
        location: "Dhaka, Bangladesh",
        ipAddress: "103.13.45.124",
        date: "09 Jul 2026",
        time: "01:24 AM",
        status: "Successful",
    },
    {
        id: 2,
        device: "Mac",
        browser: "Chrome",
        location: "Dhaka, Bangladesh",
        ipAddress: "103.15.76.109",
        date: "07 Jul 2026",
        time: "11:56 AM",
        status: "Successful",
    },
    {
        id: 3,
        device: "Windows",
        browser: "Firefox",
        location: "Dhaka, Bangladesh",
        ipAddress: "172.16.254.3",
        date: "15 Jul 2026",
        time: "06:42 PM",
        status: "Successful",
    },
    {
        id: 4,
        device: "Mac",
        browser: "Safari",
        location: "Dhaka, Bangladesh",
        ipAddress: "54.213.1.45",
        date: "22 Jul 2026",
        time: "09:15 AM",
        status: "Successful",
    },
    {
        id: 5,
        device: "Linux",
        browser: "Chrome",
        location: "Dhaka, Bangladesh",
        ipAddress: "203.0.113.7",
        date: "29 Jul 2026",
        time: "03:30 PM",
        status: "Successful",
    },
];

export default function LoginActivityTable() {
    const [loginActivities, setLoginActivities] = useState<LoginActivity[]>(
        initialLoginActivities
    );

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedLogin, setSelectedLogin] =
        useState<LoginActivity | null>(null);

    const openDelete = (row: LoginActivity) => {
        setSelectedLogin(row);
        setDeleteOpen(true);
    };
    const openEdit = (row: LoginActivity) => {
        setSelectedLogin(row);
    };

    const handleDelete = () => {
        if (!selectedLogin) return;

        setLoginActivities((prev) =>
            prev.filter((item) => item.id !== selectedLogin.id)
        );

        setDeleteOpen(false);
        setSelectedLogin(null);
    };

    const columns: Column<LoginActivity>[] = [
        {
            header: "No.",
            cell: (row) => (
                <span className="text-[13px] font-medium leading-[140%] text-[#4A4C56]">
                    {row.id}
                </span>
            ),
        },

        {
            header: "Device / Browser",
            cell: (row) => (
                <div className="flex items-center gap-2.5 whitespace-nowrap">
                    <Monitor
                        size={16}
                        strokeWidth={2}
                        className="text-[#1D1F2C]"
                    />

                    <span className="text-[13px] font-semibold leading-[140%] tracking-[0.065px] text-[#0A0A0A]">
                        {row.device} • {row.browser}
                    </span>
                </div>
            ),
        },

        {
            header: "Location",
            cell: (row) => (
                <span className="whitespace-nowrap text-[13px] font-semibold leading-[140%] tracking-[0.065px] text-[#0A0A0A]">
                    {row.location}
                </span>
            ),
        },

        {
            header: "IP Address",
            cell: (row) => (
                <span className="whitespace-nowrap text-[13px] font-medium leading-[140%] tracking-[0.065px] text-[#1D1F2C]">
                    {row.ipAddress}
                </span>
            ),
        },

        {
            header: "Date & Time",
            cell: (row) => (
                <div className="flex flex-col gap-0">
                    <span className="whitespace-nowrap text-[13px] font-medium leading-[140%] text-[#1D1F2C]">
                        {row.date}
                    </span>

                    <span className="whitespace-nowrap text-[12px] font-normal leading-[140%] text-[#A5A5AB]">
                        {row.time}
                    </span>
                </div>
            ),
        },

        {
            header: "Status",
            cell: (row) => (
                <CustomBadge
                    color="active"
                    className="!rounded-[4px] !border !border-[#72DED1] !bg-[#F0FFFD] !px-2.5 !py-1 text-[11px] font-medium !text-[#287F6E]"
                >
                    
                    {row.status}
                </CustomBadge>
            ),
        },
    ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="py-6">
                <h2 className="text-[#1D1F2C] text-[20px] font-semibold leading-[130%] tracking-[0.1px]
">
                    Login Activity
                </h2>

                <p className="mt-1 text-[#4A4C56] text-[14px] font-normal leading-[140%] tracking-[0.07px]
">
                    Review your recent account login activity.
                </p>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={loginActivities}
                defaultPageSize={10}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            {/* Delete Modal */}
            <CustomDeletModal
                isOpen={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedLogin(null);
                }}
                onConfirm={handleDelete}
                title="Do you want to delete this login activity?"
                description="Click “Delete Now” if you want to delete otherwise press cancel."
            />
        </div>
    );
}