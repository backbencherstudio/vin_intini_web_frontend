"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import Pagination from "@/components/reusable/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetLeaveRequestsQuery } from "@/feature/slice/admin/user-management";
import { LeaveRequest } from "@/feature/slice/admin/user-management/userTypes";
import userIcon from "@/public/images/admin/parterner.png";
import {
  ArrowDownToLine,
  ArrowUpDown,
  Calendar,
  Clock,
  SearchIcon,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

export default function LeaveManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const {
    data: leaveResponse,
    isLoading,
    isError,
  } = useGetLeaveRequestsQuery({
    query: {
      page,
      per_page: PAGE_SIZE,
      search: search.trim() || undefined,
    },
  });

  const rawData: LeaveRequest[] = leaveResponse?.data ?? [];
  const totalRequests =
    leaveResponse?.pagination?.total ?? leaveResponse?.total_request ?? rawData.length;
  const totalPages =
    leaveResponse?.pagination?.last_page ?? Math.max(1, Math.ceil(totalRequests / PAGE_SIZE));

  // Client-side search and sort refinement if needed
  const displayData = useMemo(() => {
    let list = [...rawData];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.reason?.toLowerCase().includes(q)
      );
    }

    if (sort === "a-z") {
      list.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));
    } else if (sort === "z-a") {
      list.sort((a, b) => (b.full_name || "").localeCompare(a.full_name || ""));
    }

    return list;
  }, [rawData, search, sort]);

  // CSV Export helper
  const handleExport = () => {
    if (!displayData.length) return;
    const headers = [
      "No.",
      "ID",
      "User ID",
      "Full Name",
      "Email",
      "Reason",
      "Request Date",
      "Permanently Delete",
      "Remaining Days",
    ];
    const rows = displayData.map((item, idx) => [
      item.sl_no ?? idx + 1,
      item.id,
      item.user_id,
      `"${item.full_name?.replace(/"/g, '""') || ""}"`,
      `"${item.email || ""}"`,
      `"${item.reason?.replace(/"/g, '""') || ""}"`,
      `"${item.request_date || ""}"`,
      `"${item.permanently_delete || ""}"`,
      `"${item.remaining_days || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leave_requests_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<LeaveRequest>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="text-gray-500 font-medium">{row.sl_no ?? row.id}</span>
      ),
    },
    {
      header: "User",
      accessor: "full_name",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <Image
              src={userIcon}
              alt={row.full_name}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm">
              {row.full_name}
            </span>
            <span className="text-xs text-gray-500">User ID: #{row.user_id}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      cell: (row) => (
        <span className="text-[14px] font-normal text-gray-800">
          {row.email}
        </span>
      ),
    },
    {
      header: "Reason",
      accessor: "reason",
      cell: (row) => (
        <div className="max-w-[260px] truncate" title={row.reason}>
          <span className="text-[13px] font-normal text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 inline-block">
            {row.reason}
          </span>
        </div>
      ),
    },
    {
      header: "Request Date",
      accessor: "request_date",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-gray-700 text-sm">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>{row.request_date}</span>
        </div>
      ),
    },
    {
      header: "Permanently Delete",
      accessor: "permanently_delete",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
          <Calendar className="h-3.5 w-3.5 text-red-400" />
          <span>{row.permanently_delete}</span>
        </div>
      ),
    },
    {
      header: "Remaining Days",
      accessor: "remaining_days",
      cell: (row) => {
        const isZero =
          row.remaining_days?.toLowerCase().includes("0 day") ||
          row.remaining_days === "0";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isZero
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <Clock className="h-3 w-3" />
            {row.remaining_days}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <CustomTitleDescription
            title="Leave Management"
            description={`${totalRequests.toLocaleString()} Leave Requests`}
          />
        </div>

        <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center">
          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white transition-opacity hover:opacity-90 md:w-auto"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Export
          </button>

          {/* Search */}
          <div className="relative w-full md:w-[240px]">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808897]" />
            <input
              className="h-10 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm focus:border-primaryColor focus:outline-none"
              type="text"
              placeholder="Search user, email, reason..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Sort */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-10 w-full cursor-pointer gap-2 py-5 md:w-[170px]">
              <ArrowUpDown className="h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="a-z">Alphabet A-Z</SelectItem>
              <SelectItem value="z-a">Alphabet Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      {isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          Failed to load leave requests. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primaryColor border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">Loading leave requests...</p>
        </div>
      ) : displayData.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
          <UserRound className="h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No leave requests found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {search
              ? "No requests match your search criteria."
              : "There are currently no active leave requests."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} data={displayData} />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={totalRequests}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
