"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type Column<T> = {
    header: string;
    accessor?: keyof T;
    cell?: (row: T) => React.ReactNode;
    className?: string;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    pageSizeOptions?: number[];
    defaultPageSize?: number;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
};

export default function DataTable<T extends { id: string | number }>({
    columns,
    data,
    pageSizeOptions = [5, 10, 20, 50],
    defaultPageSize = 10,
    onEdit,
    onDelete,
    onView
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultPageSize);

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageSizeChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    // Page numbers with ellipsis
    const getPages = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
        if (currentPage >= totalPages - 2)
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    return (
        <div className="w-full">
            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-[#777980] font-['Segoe_UI'] text-[14px] font-semibold leading-[140%] tracking-[0.07px] whitespace-nowrap"
                                >
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 text-center">
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((col, j) => (
                                        <td
                                            key={j}
                                            className={`px-4 py-3 text-sm text-gray-700 ${col.className || ""}`}
                                        >
                                            {col.cell
                                                ? col.cell(row)
                                                : col.accessor
                                                    ? String(row[col.accessor] ?? "")
                                                    : null}
                                        </td>
                                    ))}

                                    {(onEdit || onDelete) && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-3">
                                                {
                                                    onView && (
                                                        <button
                                                            onClick={() => onView(row)}
                                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )
                                                }
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                    className="px-4 py-12 text-center text-sm text-gray-400"
                                >
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-1">
                    {/* Left: Showing text */}
                    <p className="text-sm text-gray-500">
                        Showing {startIndex} to {endIndex} of {totalItems} results
                    </p>

                    {/* Right: Pagination controls */}
                    <div className="flex items-center gap-3">
                        {/* Previous */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {getPages().map((page, idx) =>
                                page === "..." ? (
                                    <span key={idx} className="px-2 text-gray-400">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(Number(page))}
                                        className={`min-w-[32px] h-8 px-2 text-sm rounded-lg border transition-colors ${currentPage === page
                                            ? "bg-gray-100 border-gray-300 text-gray-900 font-medium"
                                            : "border-transparent text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Next */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Per page select */}
                        <Select value={String(itemsPerPage)} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-[100px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={String(size)}>
                                        {size} Result
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    );
}