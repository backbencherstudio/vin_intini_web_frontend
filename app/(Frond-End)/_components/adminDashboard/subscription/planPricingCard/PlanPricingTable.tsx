"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import Image from "next/image";
import userIcon from "@/public/images/admin/parterner.png";
import visaIcon from "@/public/images/admin/visa.png";
import mastercardIcon from "@/public/images/admin/paypal.png";
import americanExpressIcon from "@/public/images/admin/american.png";
import { useState } from "react";
import { ArrowDownToLine, Copy, SearchIcon } from "lucide-react";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";


type Transaction = {
    id: number;
    subscriber: number;
    plan: string;
    description:string;
    amount: string;
    status: "Completed" | "Failed" | "Refunded";
};

const initialTransactions: Transaction[] = [
    {
        id: 1,
       
        subscriber: 4923,
        plan: "Premium",
        description:"Perfect for students and professionals getting started.",
        amount: "$9.99 ",
        status: "Completed",
    },
    {
        id: 2,
   
        subscriber: 453,
        plan: "Premium",
         description:"Unlock advanced networking and career opportunities.",
        amount: "$6.99",
        status: "Failed",
    },
    {
        id: 3,
     
        subscriber: 3678,
        plan: "Pro Industry",
         description:"Built for organizations, recruiters, and industry partners.",

        amount: "$9.99",
        status: "Failed",
    }
];

export default function PlanPricingTable() {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [sort, setSort] = useState("default");
    const [statusFilter, setStatusFilter] = useState("default");
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const openDelete = (row: Transaction) => {
        setSelectedTransaction(row);
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (selectedTransaction) {
            setTransactions((prev) => prev.filter((item) => item.id !== selectedTransaction.id));
            setDeleteOpen(false);
            setSelectedTransaction(null);
        }
    };

    const columns: Column<Transaction>[] = [
        {
            header: "No.",
            cell: (row) => <span className="text-gray-500">{row.id}</span>,
        },

        {
            header: "Description",
            cell: (row) => (
                <div className="flex items-center gap-2">
                   
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-normal text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.description}</span>
                </div>
            ),
        },
   
    
        {
            header: "Plan",
            cell: (row) => (
                <CustomBadge
                    color={row.plan === "Premium" ? "orange" : "purple"}
                    className="font-medium"
                >
                    {row.plan}
                </CustomBadge>
            ),
        },
     
        {
            header: "Status",
            cell: (row) => {
                if (row.status === "Completed") {
                    return <CustomBadge color="active">{row.status}</CustomBadge>;
                }
                if (row.status === "Failed") {
                    return <CustomBadge color="suspended">{row.status}</CustomBadge>;
                }
                return <CustomBadge color="orange">{row.status}</CustomBadge>; // Refunded
            },
        },
       
           {
            header: "Amount",
            cell: (row) => (
                <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.amount}
                    <span className="text-[14px] text-[#777980]">/ month</span>
                </span>
            ),
        },

            {
            header: "Subscribers",
            cell: (row) => (
                <div className="flex items-center gap-2">
                   
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.subscriber}</span>
                </div>
            ),
        },
    ];

    return (
        <div>
            {/* Filters */}
            <div className="flex w-full justify-start lg:justify-end">
                <div className="mb-6 flex flex-col w-full lg:w-full xl:w-2/3 lg:flex-row items-center justify-start gap-4 ">
                    {/* Search */}
                    <div className="relative w-full  xl:w-[300px]">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808897]" />

                        <input
                            className="h-10 w-full xl:w-[300px] rounded-md border border-gray-200 bg-white p-2 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-primaryColor"
                            type="text"
                            placeholder="Search by user name, email or plan..."
                        />
                    </div>

                    {/* All Plans */}
                    <CustomSelect
                        className="h-[38px]"
                        value={sort}
                        onChange={(value: string) =>
                            setSort(value === "default" ? "" : value)
                        }
                        options={[
                            { label: "All Plans", value: "default" },
                            { label: "Premium", value: "Premium" },
                            { label: "Basic", value: "Basic" },
                        ]}
                    />

                    {/* All Status */}
                    <CustomSelect
                        className="h-[38px] "
                        value={statusFilter}
                        onChange={(value: string) =>
                            setStatusFilter(value === "default" ? "" : value)
                        }
                        options={[
                            { label: "All Status", value: "default" },
                            { label: "Completed", value: "Completed" },
                            { label: "Failed", value: "Failed" },
                            { label: "Refunded", value: "Refunded" },
                        ]}
                    />

                    {/* Date Range */}
                    <DateRangePicker
                        className="h-[38px] "
                        date={date}
                        setDate={setDate}
                        placeholder="Select Date Range"
                    />

                    {/* Export */}
                    <button className="flex h-[38px] w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 text-white transition hover:bg-[#038a9c]">
                        <ArrowDownToLine className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={transactions}
                onDelete={openDelete}
            />


            {/* Delete Modal */}
            <CustomDeletModal
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Do you want to delete this transaction?"
                description='Click “Delete Now” if you want to delete otherwise press cancel.'
            />
        </div>
    );
}