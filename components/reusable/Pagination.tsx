"use client";

import { LeftAngleIcon, RightAngleIcon } from "@/public/svgIcons/Icons";

export default function Pagination({
    page,
    pageSize,
    total,
    totalPages,
    onPageChange,
}: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {

    const getPages = () => {
        if (totalPages <= 6) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (page <= 3) return [1, 2, 3, "...", totalPages];
        if (page >= totalPages - 2)
            return [1, "...", totalPages - 2, totalPages - 1, totalPages];

        return [1, "...", page - 1, page, page + 1, "...", totalPages];
    };

    const pagesToShow = getPages();

    return (
        <div className="flex justify-end items-center gap-3">
            {/* Prev */}
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className={`pr-2 py-1 flex items-center justify-center rounded-md border border-[#A5A5AB] bg-white shadow-sm
          transition
          ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
        `}
            >
                <LeftAngleIcon className="w-5 h-5" />
                <span>Previous</span>
            </button>

            {/* Page numbers */}
            <ul className="flex items-center gap-3">
                {pagesToShow.map((p, idx) =>
                    p === "..." ? (
                        <li key={idx} className="text-gray-400 select-none cursor-default">
                            ...
                        </li>
                    ) : (
                        <li key={idx}>
                            <button
                                disabled={page === p}
                                onClick={() => onPageChange(Number(p))}
                                className={`
                  px-3 py-1 flex items-center justify-center rounded-md font-medium transition
                  ${page === p ? "bg-[#E9E9EA] text-[#4A4C56] cursor-default" : "bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer"}
                `}
                            >
                                {p}
                            </button>
                        </li>
                    )
                )}
            </ul>

            {/* Next */}
            <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => onPageChange(page + 1)}
                className={`pl-2 py-1 flex items-center justify-center rounded-md border border-[#A5A5AB] bg-white shadow-sm
          transition
          ${page === totalPages || totalPages === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
        `}
            >
                <span>Next</span>
                <LeftAngleIcon className="w-5 h-5 rotate-180" />
            </button>
        </div>
    );
}
