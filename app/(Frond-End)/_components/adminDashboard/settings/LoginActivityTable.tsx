"use client";

import AdminPagination from "@/components/reusable/dashboard/AdminPagination";
import DataTable, {
    Column,
} from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import Pagination from "@/components/reusable/Pagination";
import { useGetLoginActivityQuery } from "@/feature/slice/admin/securitySettings";
import { LogoutIcon } from "@/public/svgIcons/Icons";
import { Monitor } from "lucide-react";
import { useState } from "react";

type LoginActivity = {
    id: number;
    device: string;
    browser: string;
    location: string;
    ip_address: string;
    status: "Successful" | "Failed";
    is_active: boolean;
    is_current: boolean;
    signin_status: string;
    login_at: string;
    created_at: string;
};

export default function LoginActivityTable() {
   const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);

const { data, isLoading } = useGetLoginActivityQuery({
  page,
  limit,
});

const loginActivities: LoginActivity[] =
  data?.data?.items || [];

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

        setDeleteOpen(false);
        setSelectedLogin(null);
    };

    const columns: Column<LoginActivity>[] = [
        {
            header: "No.",
            cell: (row) => (
                <span className="text-[13px] font-medium text-[#4A4C56]">
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

                    <span className="text-[13px] font-semibold text-[#0A0A0A]">
                        {row.device} • {row.browser}
                    </span>
                </div>
            ),
        },

        {
            header: "Location",
            cell: (row) => (
                <span className="whitespace-nowrap text-[13px] font-semibold text-[#0A0A0A]">
                    {row.location}
                </span>
            ),
        },

        {
            header: "IP Address",
            cell: (row) => (
                <span className="whitespace-nowrap text-[13px] font-medium text-[#1D1F2C]">
                    {row.ip_address}
                </span>
            ),
        },

        {
            header: "Date & Time",
            cell: (row) => {
                const date = new Date(row.login_at);

                return (
                    <div className="flex flex-col">
                        <span className="whitespace-nowrap text-[13px] font-medium text-[#1D1F2C]">
                            {date.toLocaleDateString()}
                        </span>

                        <span className="whitespace-nowrap text-[12px] text-[#A5A5AB]">
                            {date.toLocaleTimeString()}
                        </span>
                    </div>
                );
            },
        },

        {
            header: "Status",
            cell: (row) => (
                <CustomBadge
                   color={
                        row.status === "Successful"
                            ? "green"
                            : "red"
                    }
                    className={
                        row.status === "Successful"
                            ? "!rounded-[4px] !border !border-[#72DED1] !bg-[#F0FFFD] !px-2.5 !py-1 text-[11px] !text-[#287F6E]"
                            : "!rounded-[4px] !border !border-red-200 !bg-red-50 !px-2.5 !py-1 text-[11px] !text-red-500"
                    }
                >
                    {row.status}
                </CustomBadge>
            ),
        },
        {
            header: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-2.5 whitespace-nowrap">
                    <button
                        onClick={() => openEdit(row)}
                        className=" flex items-center gap-1 bg-[#FEECEE] text-red-500 px-2 py-1 rounded-sm text-[12px] font-medium"
                    >
                        <LogoutIcon className="w-4 h-4" />
                        Logout
                    </button>
                  
                </div>
            ),
        }
    ];

    return (
        <div className="w-full">
            <div className="py-6">
                <h2 className="text-[#1D1F2C] text-[20px] font-semibold">
                    Login Activity
                </h2>

                <p className="mt-1 text-[#4A4C56] text-[14px]">
                    Review your recent account login activity.
                </p>
            </div>

            <DataTable
                columns={columns}
                data={loginActivities}
         
            />

            {/* Backend Pagination */}
           <AdminPagination
  pagination={data}
  onPageChange={setPage}
  onPageSizeChange={(size) => {
    setLimit(size);
    setPage(1);
  }}
/>

            {/* <CustomDeletModal
                isOpen={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedLogin(null);
                }}
                onConfirm={handleDelete}
                title="Do you want to delete this login activity?"
                description="Click “Delete Now” if you want to delete otherwise press cancel."
            /> */}
        </div>
    );
}