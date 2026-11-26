"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  CheckCircle2,
  EyeOff,
  GitMerge,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/reusable/dashboard/AdminTable";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import Pagination from "@/components/reusable/Pagination";
import {
  InstitutionReport,
  InstitutionStudent,
  useCreateInstitutionMutation,
  useDeleteInstitutionMutation,
  useGetInstitutionReportsQuery,
  useGetInstitutionStudentsQuery,
  useMergeInstitutionMutation,
  useRenameInstitutionMutation,
  useUpdateInstitutionStatusMutation,
} from "@/feature/slice/admin/reports/adminReportApi";

const PAGE_SIZE = 20;

export default function InstitutionReports() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<{
    id: number | string;
    name: string;
  } | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newInstName, setNewInstName] = useState("");
  const [newInstVerified, setNewInstVerified] = useState(true);

  const [editingInst, setEditingInst] = useState<InstitutionReport | null>(null);
  const [editName, setEditName] = useState("");
  const [editVerified, setEditVerified] = useState(true);

  const [mergingInst, setMergingInst] = useState<InstitutionReport | null>(null);
  const [mergeSearch, setMergeSearch] = useState("");
  const [mergeTargetId, setMergeTargetId] = useState<number | string>("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetInstitutionReportsQuery({
      search: search.trim() || undefined,
      status: statusFilter,
      page,
    });

  const mergeCandidatesQuery = useGetInstitutionReportsQuery(
    {
      search: mergeSearch.trim() || undefined,
      status: "verified",
      page: 1,
    },
    { skip: !mergingInst },
  );

  const [createInstitution, { isLoading: isCreating }] =
    useCreateInstitutionMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateInstitutionStatusMutation();
  const [renameInstitution, { isLoading: isRenaming }] =
    useRenameInstitutionMutation();
  const [mergeInstitution, { isLoading: isMerging }] =
    useMergeInstitutionMutation();
  const [deleteInstitution, { isLoading: isDeleting }] =
    useDeleteInstitutionMutation();

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
  const pendingCount = data?.summary?.pending_count ?? 0;
  const verifiedCount = data?.summary?.verified_count ?? 0;
  const totalInstitutions = pagination?.total ?? institutions.length;
  const totalPages = pagination?.last_page ?? 1;

  const mergeCandidates = (mergeCandidatesQuery.data?.data ?? []).filter(
    (item) => String(item.id) !== String(mergingInst?.id),
  );

  const studentPagination = studentsQuery.data?.pagination;
  const students = studentsQuery.data?.data ?? [];
  const totalStudents = studentPagination?.total ?? students.length;
  const totalStudentPages = studentPagination?.last_page ?? 1;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim()) return;
    try {
      const res = await createInstitution({
        name: newInstName.trim(),
        is_verified: newInstVerified,
      }).unwrap();
      toast.success(res.message || "Institution added");
      setIsAddOpen(false);
      setNewInstName("");
      setNewInstVerified(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add institution");
    }
  };

  const handleToggleStatus = async (row: InstitutionReport) => {
    try {
      const res = await updateStatus({
        id: row.id,
        is_verified: !row.is_verified,
      }).unwrap();
      toast.success(res.message || "Institution status updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInst || !editName.trim()) return;
    try {
      const res = await renameInstitution({
        id: editingInst.id,
        name: editName.trim(),
        is_verified: editVerified,
      }).unwrap();
      toast.success(res.message || "Institution updated");
      setEditingInst(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update institution");
    }
  };

  const handleMergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergingInst || !mergeTargetId) {
      toast.error("Please select a target institution");
      return;
    }
    try {
      const res = await mergeInstitution({
        id: mergingInst.id,
        target_institution_id: mergeTargetId,
      }).unwrap();
      toast.success(res.message || "Institution merged successfully");
      setMergingInst(null);
      setMergeTargetId("");
      setMergeSearch("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to merge institution");
    }
  };

  const handleDelete = async (row: InstitutionReport) => {
    try {
      const res = await deleteInstitution(row.id).unwrap();
      toast.success(res.message || "Institution deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete institution");
    }
  };

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
              <GraduationCap className="h-4 w-4" />
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
        header: "Status",
        cell: (row) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
              row.is_verified
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {row.is_verified ? "Verified" : "Pending"}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: (row) => (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSelected({ id: row.id, name: row.institution_name });
                setStudentPage(1);
                setStudentSearch("");
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primaryColor hover:border-gray-300 cursor-pointer shadow-2xs"
            >
              <Users className="h-3.5 w-3.5 text-primaryColor" />
              <span>Students</span>
            </button>
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => handleToggleStatus(row)}
              title={row.is_verified ? "Hide from public dropdown" : "Approve for public dropdown"}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer shadow-2xs ${
                row.is_verified
                  ? "border-gray-200 bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              {row.is_verified ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Approve</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingInst(row);
                setEditName(row.institution_name);
                setEditVerified(row.is_verified);
              }}
              title="Rename / Edit"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primaryColor cursor-pointer shadow-2xs"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMergingInst(row);
                setMergeTargetId("");
                setMergeSearch("");
              }}
              title="Merge into a verified institution"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primaryColor cursor-pointer shadow-2xs"
            >
              <GitMerge className="h-3.5 w-3.5" />
              <span>Merge</span>
            </button>
            {row.total_students === 0 && (
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(row)}
                title="Delete unused institution"
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer shadow-2xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [isUpdatingStatus, isDeleting],
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
              onClick={() => {
                setNewInstName("");
                setNewInstVerified(true);
                setIsAddOpen(true);
              }}
              className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add Institution
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 whitespace-nowrap"
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { key: "all", label: "All Institutions", count: pendingCount + verifiedCount },
            { key: "pending", label: "Pending Review", count: pendingCount },
            { key: "verified", label: "Verified", count: verifiedCount },
          ] as const
        ).map((tab) => {
          const active = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setStatusFilter(tab.key);
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium border transition-colors cursor-pointer ${
                active
                  ? "bg-primaryColor text-white border-primaryColor"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                  active
                    ? "bg-white/20 text-white"
                    : tab.key === "pending" && tab.count > 0
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

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
          <GraduationCap className="h-12 w-12 text-gray-300" />
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
      {/* Add Institution Modal */}
      <CustomModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Institution"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 p-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Institution Name
            </label>
            <CustomInput
              value={newInstName}
              onChange={(e) => setNewInstName(e.target.value)}
              placeholder="Enter official institution name"
              required
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={newInstVerified}
              onChange={(e) => setNewInstVerified(e.target.checked)}
              className="h-4 w-4 accent-primaryColor"
            />
            <span>Verified (visible in public dropdown suggestions)</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {isCreating ? "Adding..." : "Add Institution"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Rename / Approve Modal */}
      <CustomModal
        open={!!editingInst}
        onOpenChange={(open) => {
          if (!open) setEditingInst(null);
        }}
        title="Edit Institution"
        size="md"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4 p-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Institution Name
            </label>
            <CustomInput
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter official institution name"
              required
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={editVerified}
              onChange={(e) => setEditVerified(e.target.checked)}
              className="h-4 w-4 accent-primaryColor"
            />
            <span>Verified (visible in public dropdown suggestions)</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingInst(null)}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRenaming}
              className="rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {isRenaming ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Merge Modal */}
      <CustomModal
        open={!!mergingInst}
        onOpenChange={(open) => {
          if (!open) setMergingInst(null);
        }}
        title="Merge Institution"
        size="md"
      >
        <form onSubmit={handleMergeSubmit} className="space-y-4 p-2">
          <p className="text-xs text-gray-600">
            Move all students from{" "}
            <span className="font-semibold text-gray-900">
              {mergingInst?.institution_name}
            </span>{" "}
            into a verified institution and remove the duplicate entry.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Search Verified Target Institution
            </label>
            <CustomInput
              value={mergeSearch}
              onChange={(e) => setMergeSearch(e.target.value)}
              placeholder="Search verified institutions..."
            />
          </div>
          <div className="max-h-52 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
            {mergeCandidatesQuery.isLoading ? (
              <p className="p-3 text-xs text-gray-500">Loading...</p>
            ) : mergeCandidates.length === 0 ? (
              <p className="p-3 text-xs text-gray-500">
                No verified institutions found.
              </p>
            ) : (
              mergeCandidates.map((candidate) => (
                <label
                  key={candidate.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="radio"
                      name="mergeTarget"
                      value={String(candidate.id)}
                      checked={String(mergeTargetId) === String(candidate.id)}
                      onChange={() => setMergeTargetId(candidate.id)}
                      className="accent-primaryColor"
                    />
                    <span className="truncate text-gray-800">
                      {candidate.institution_name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {candidate.total_students} students
                  </span>
                </label>
              ))
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMergingInst(null)}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isMerging || !mergeTargetId}
              className="rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {isMerging ? "Merging..." : "Merge & Delete Duplicate"}
            </button>
          </div>
        </form>
      </CustomModal>
    </section>
  );
}
