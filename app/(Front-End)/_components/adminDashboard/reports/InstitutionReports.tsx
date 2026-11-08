"use client";

import { useMemo, useState } from "react";
import { ArrowDownToLine, Building2, Search, Users } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/reusable/dashboard/AdminTable";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import Pagination from "@/components/reusable/Pagination";
import {
  InstitutionReport,
  InstitutionStudent,
  useGetInstitutionReportsQuery,
  useGetInstitutionStudentsQuery,
} from "@/feature/slice/admin/reports/adminReportApi";

const PAGE_SIZE = 20;

export default function InstitutionReports() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<{
    id: number | string;
    name: string;
  } | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetInstitutionReportsQuery({
      search: search.trim() || undefined,
      page,
    });

  const studentsQuery = useGetInstitutionStudentsQuery(
    {
      id: selected?.id ?? 0,
      search: studentSearch.trim() || undefined,
      page: studentPage,
      per_page: 10,
    },
    { skip: !selected },
  );

  const pagination = data?.pagination;
  const institutions = data?.data ?? [];
  const totalInstitutions = pagination?.total ?? institutions.length;
  const totalPages = pagination?.last_page ?? 1;

  const studentPagination = studentsQuery.data?.pagination;
  const students = studentsQuery.data?.data ?? [];
  const totalStudents = studentPagination?.total ?? students.length;
  const totalStudentPages = studentPagination?.last_page ?? 1;

  const handleExportCSV = () => {
    if (!institutions.length) {
      toast.error("No institutions to export");
      return;
    }
    const headers = [
      "No.",
      "Institution Name",
      "Total Students",
      "Current Students",
      "Completed Programs",
    ];
    const rows = institutions.map((inst) => [
      inst.sl_no ?? inst.id,
      inst.institution_name,
      inst.total_students,
      inst.present_students,
      inst.completed_programs,
    ]);
    const escapeCell = (val: unknown) =>
      `"${String(val ?? "").replaceAll('"', '""')}"`;
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `institution-reports-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Institution reports exported successfully");
  };

  const columns: Column<InstitutionReport>[] = useMemo(
    () => [
      {
        header: "No.",
        cell: (row) => (
          <span className="font-medium text-gray-500">
            {row.sl_no ?? row.id}
          </span>
        ),
      },
      {
        header: "Institution",
        cell: (row) => (
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-primaryColor border border-teal-100">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-medium text-gray-900 text-sm">
              {row.institution_name}
            </span>
          </div>
        ),
      },
      {
        header: "Students",
        cell: (row) => (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            {row.total_students}
          </span>
        ),
      },
      {
        header: "Current",
        cell: (row) => (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            {row.present_students} active
          </span>
        ),
      },
      {
        header: "Completed",
        cell: (row) => (
          <span className="text-sm text-gray-600 font-medium">
            {row.completed_programs}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSelected({ id: row.id, name: row.institution_name });
                setStudentPage(1);
                setStudentSearch("");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primaryColor hover:border-gray-300 cursor-pointer shadow-2xs"
            >
              <Users className="h-3.5 w-3.5 text-primaryColor" />
              <span>Students</span>
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const studentColumns: Column<InstitutionStudent>[] = useMemo(
    () => [
      {
        header: "Student",
        cell: (student) => (
          <div className="flex items-center gap-2.5 min-w-[180px]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-primaryColor border border-teal-100">
              {student.student_name ? student.student_name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-gray-900">
                {student.student_name || "Unknown"}
              </span>
              <span className="truncate text-xs text-gray-500">
                {student.student_email || "—"}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Program",
        cell: (student) => (
          <span className="text-sm text-gray-700">
            {student.program || "—"}
          </span>
        ),
      },
      {
        header: "Field",
        cell: (student) => (
          <span className="text-sm text-gray-700">
            {student.field || "—"}
          </span>
        ),
      },
      {
        header: "Academic Period",
        cell: (student) => (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {student.academic_period || "—"}
          </span>
        ),
      },
      {
        header: "Status",
        cell: (student) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
              student.status === "Present"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {student.status}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-6">
      {/* Title & Controls */}
      <CustomTitleDescription
        title="Institution reports"
        description="Review enrollment and program activity by institution."
        action={
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Export CSV
            </button>
            <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <CustomInput
                aria-label="Search institutions"
                className="pl-9 pr-3"
                placeholder="Search institutions"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        }
      />

      {/* Main Table / Loading / Empty State */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primaryColor border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">
            Loading institution reports...
          </p>
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            Institution reports could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : institutions.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
          <Building2 className="h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No institutions found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {search
              ? "No institutions match your search query."
              : "No institutions have been recorded yet."}
          </p>
        </div>
      ) : (
        <div
          className={`space-y-6 ${
            isFetching ? "opacity-60 transition-opacity" : ""
          }`}
        >
          <DataTable columns={columns} data={institutions} />
          {pagination && pagination.last_page > 1 && (
            <Pagination
              page={page}
              pageSize={pagination.per_page || PAGE_SIZE}
              total={totalInstitutions}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      {/* Students Modal */}
      <CustomModal
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={
          selected?.name ? `${selected.name} students` : "Institution students"
        }
        size="xl"
      >
        <div className="space-y-4 p-2">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <CustomInput
              aria-label="Search students"
              className="pl-9 pr-3"
              placeholder="Search students..."
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value);
                setStudentPage(1);
              }}
            />
          </div>

          {studentsQuery.isLoading ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
              <div className="h-7 w-7 animate-spin rounded-full border-3 border-primaryColor border-t-transparent" />
              <p className="mt-3 text-xs text-gray-500">Loading students...</p>
            </div>
          ) : studentsQuery.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center">
              <p className="text-sm text-red-600">Students could not be loaded.</p>
            </div>
          ) : students.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
              <Users className="h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No students found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <DataTable
                columns={studentColumns}
                data={students.map((s, idx) => ({ ...s, id: `${s.student_email || idx}-${idx}` }))}
              />
              {studentPagination && studentPagination.last_page > 1 && (
                <Pagination
                  page={studentPage}
                  pageSize={studentPagination.per_page || 10}
                  total={totalStudents}
                  totalPages={totalStudentPages}
                  onPageChange={setStudentPage}
                />
              )}
            </div>
          )}
        </div>
      </CustomModal>
    </section>
  );
}
