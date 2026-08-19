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
import EditTransactionForm from "./EditTransactionForm";

type Transaction = {
    id: number;
    transactionId: string;
    img: string;
    subscriber: string;
    plan: string;
    amount: string;
    status: "Completed" | "Failed" | "Refunded";
    paymentMethod: string;
    cardNumber: string;
    date: string;
    time: string;
};

const initialTransactions: Transaction[] = [
    {
        id: 1,
        transactionId: "TXN-564NBDFD4",
        img: userIcon.src,
        subscriber: "Rachel White",
        plan: "Premium",
        amount: "$9.99 ",
        status: "Completed",
        paymentMethod: "VISA",
        cardNumber: "4859********5675",
        date: "02 Jun 2026",
        time: "08:37 PM"
    },
    {
        id: 2,
        transactionId: "TXN-75JD453567",
        img: userIcon.src,
        subscriber: "James Smith",
        plan: "Premium",
        amount: "$6.99",
        status: "Failed",
        paymentMethod: "Mastercard",
        cardNumber: "5560********6777",
        date: "02 Jun 2026",
        time: "08:37 PM"
    },
    {
        id: 3,
        transactionId: "TXN-48XMCJ2938",
        img: userIcon.src,
        subscriber: "Emily Johnson",
        plan: "Premium",
        amount: "$9.99",
        status: "Failed",
        paymentMethod: "American Express",
        cardNumber: "7864********6777",
        date: "02 Jun 2026",
        time: "08:37 PM"
    },
    {
        id: 4,
        transactionId: "TXN-82NMVJ6720",
        img: userIcon.src,
        subscriber: "Daniel Rodriguez",
        plan: "Premium",
        amount: "$6.99 ",
        status: "Refunded",
        paymentMethod: "VISA",
        cardNumber: "6011********4321",
        date: "02 Jun 2026",
        time: "08:37 PM"
    },
    {
        id: 5,
        transactionId: "TXN-67PLMNB345",
        img: userIcon.src,
        subscriber: "Michael Brown",
        plan: "Basic",
        amount: "$6.99",
        status: "Completed",
        paymentMethod: "Mastercard",
        cardNumber: "3530********9876",
        date: "02 Jun 2026",
        time: "08:37 PM"
    },
    {
        id: 6,
        transactionId: "TXN-30ZNBVJ876",
        img: userIcon.src,
        subscriber: "Linda Davis",
        plan: "Basic",
        amount: "$6.99 ",
        status: "Completed",
        paymentMethod: "American Express",
        cardNumber: "6759********2468",
        date: "02 Jun 2026",
        time: "08:37 PM"
    },
    {
        id: 7,
        transactionId: "TXN-88TRPLW563",
        img: userIcon.src,
        subscriber: "William Garcia",
        plan: "Basic",
        amount: "$6.99 ",
        status: "Completed",
        paymentMethod: "VISA",
        cardNumber: "2223********8642",
        date: "02 Jun 2026",
        time: "08:37 PM"
    },
    {
        id: 8,
        transactionId: "TXN-21QWPLJ907",
        img: userIcon.src,
        subscriber: "Chloe Wilson",
        plan: "Basic",
        amount: "$6.99 ",
        status: "Refunded",
        paymentMethod: "Mastercard",
        cardNumber: "4007********7531",
        date: "02 Jun 2026",
        time: "08:37 PM"
    },
];

export default function TransactionTable() {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [sort, setSort] = useState("default");
    const [statusFilter, setStatusFilter] = useState("default");
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const openView = (row: Transaction) => {
        setSelectedTransaction(row);
        setViewOpen(true);
    };

    const openEdit = (row: Transaction) => {
        setSelectedTransaction(row);
        setEditOpen(true);
    };

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
            header: "Transaction ID",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.transactionId}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="text-primary" size={14} />
                    </button>
                </div>
            ),
        },
        {
            header: "Subscribers",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.img && (
                        <Image
                            src={row.img}
                            alt={row.subscriber}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                        />
                    )}
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.subscriber}</span>
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
            header: "Amount",
            cell: (row) => (
                <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.amount}
                    <span className="text-[14px] text-[#777980]">/ year</span>
                </span>
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
            header: "Payment Method",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.paymentMethod === "VISA" && (
                        <span>
                            <Image src={visaIcon.src} alt="visa" width={28} height={28} className="rounded-full" />
                        </span>
                    )}
                    {row.paymentMethod === "Mastercard" && (
                        <div className="flex -space-x-1">
                            <span><Image src={mastercardIcon.src} alt="mastercard" width={28} height={28} className="rounded-full" /></span>
                        </div>
                    )}
                    {row.paymentMethod === "American Express" && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                            <span><Image src={americanExpressIcon.src} alt="americanExpress" width={28} height={28} className="rounded-full" /></span>
                        </span>
                    )}
                    <span className="overflow-hidden text-ellipsis text-[#0A0A0A] font-semibold text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI']">{row.cardNumber}</span>
                </div>
            ),
        },
        {
            header: "Date & Time",
            cell: (row) => (
                <div className="overflow-hidden text-ellipsis text-[#0A0A0A]  text-[14px] leading-[140%] tracking-[0.07px] font-['Segoe_UI'] flex flex-col gap-0.5">
                    <div>{row.date}</div>
                    <div className="text-[#A5A5AB]">{row.time}</div>
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
                            className="h-10 w-full xl:w-[300px] rounded-md border border-gray-200 bg-white p-2 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#04A1B7]"
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
                    <button className="flex h-[38px] w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#04A1B7] px-4 text-white transition hover:bg-[#038a9c]">
                        <ArrowDownToLine className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={transactions}
                defaultPageSize={10}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            {/* Edit Modal */}
            <CustomModal
                open={editOpen}
                onOpenChange={setEditOpen}
                title="Edit Transaction"
                size="lg"
            >
                <EditTransactionForm
                    data={selectedTransaction}
                    onClose={() => setEditOpen(false)}
                />
            </CustomModal>

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