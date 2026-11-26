"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  EyeOff,
  GitMerge,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/reusable/dashboard/AdminTable";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import Pagination from "@/components/reusable/Pagination";
import {
  ExperienceCompanyItem,
  useCreateExperienceCompanyMutation,
  useDeleteExperienceCompanyMutation,
  useGetExperienceCompaniesQuery,
  useMergeExperienceCompanyMutation,
  useRenameExperienceCompanyMutation,
  useUpdateExperienceCompanyStatusMutation,
} from "@/feature/slice/admin/reports/adminReportApi";

const PAGE_SIZE = 20;

export default function ExperienceOrganizations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified">("all");
  const [page, setPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgVerified, setNewOrgVerified] = useState(true);

  const [editingOrg, setEditingOrg] = useState<ExperienceCompanyItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editVerified, setEditVerified] = useState(true);

  const [mergingOrg, setMergingOrg] = useState<ExperienceCompanyItem | null>(null);
  const [mergeSearch, setMergeSearch] = useState("");
  const [mergeTargetId, setMergeTargetId] = useState<number | string>("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetExperienceCompaniesQuery({
      search: search.trim() || undefined,
      status: statusFilter,
      page,
    });

  const mergeCandidatesQuery = useGetExperienceCompaniesQuery(
    {
      search: mergeSearch.trim() || undefined,
      status: "verified",
      page: 1,
    },
    { skip: !mergingOrg },
  );

  const [createCompany, { isLoading: isCreating }] =
    useCreateExperienceCompanyMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateExperienceCompanyStatusMutation();
  const [renameCompany, { isLoading: isRenaming }] =
    useRenameExperienceCompanyMutation();
  const [mergeCompany, { isLoading: isMerging }] =
    useMergeExperienceCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] =
    useDeleteExperienceCompanyMutation();

  const pagination = data?.pagination;
  const companies = data?.data ?? [];
  const pendingCount = data?.summary?.pending_count ?? 0;
  const verifiedCount = data?.summary?.verified_count ?? 0;
  const totalItems = pagination?.total ?? companies.length;
  const totalPages = pagination?.last_page ?? 1;

  const mergeCandidates = (mergeCandidatesQuery.data?.data ?? []).filter(
    (item) => String(item.id) !== String(mergingOrg?.id),
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      const res = await createCompany({
        name: newOrgName.trim(),
        is_verified: newOrgVerified,
      }).unwrap();
      toast.success(res.message || "Organization added");
      setIsAddOpen(false);
      setNewOrgName("");
      setNewOrgVerified(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add organization");
    }
  };

  const handleToggleStatus = async (row: ExperienceCompanyItem) => {
    try {
      const res = await updateStatus({
        id: row.id,
        is_verified: !row.is_verified,
      }).unwrap();
      toast.success(res.message || "Organization status updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg || !editName.trim()) return;
    try {
      const res = await renameCompany({
        id: editingOrg.id,
        name: editName.trim(),
        is_verified: editVerified,
      }).unwrap();
      toast.success(res.message || "Organization updated");
      setEditingOrg(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update organization");
    }
  };

  const handleMergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergingOrg || !mergeTargetId) {
      toast.error("Please select a target organization");
      return;
    }
    try {
      const res = await mergeCompany({
        id: mergingOrg.id,
        target_company_id: mergeTargetId,
      }).unwrap();
      toast.success(res.message || "Organization merged successfully");
      setMergingOrg(null);
      setMergeTargetId("");
      setMergeSearch("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to merge organization");
    }
  };

  const handleDelete = async (row: ExperienceCompanyItem) => {
    try {
      const res = await deleteCompany(row.id).unwrap();
      toast.success(res.message || "Organization deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete organization");
    }
  };

  const columns: Column<ExperienceCompanyItem>[] = useMemo(
    () => [
      {
        header: "No.",
        cell: (row) => (
          <span className="font-medium text-gray-500">{row.sl_no ?? row.id}</span>
        ),
      },
      {
        header: "Organization",
        cell: (row) => (
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-primaryColor border border-teal-100">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-medium text-gray-900 text-sm">{row.name}</span>
          </div>
        ),
      },
      {
        header: "Linked Experiences",
        cell: (row) => (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <Briefcase className="h-3.5 w-3.5 text-gray-400" />
            {row.total_experiences}
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
              disabled={isUpdatingStatus}
              onClick={() => handleToggleStatus(row)}
              title={
                row.is_verified
                  ? "Hide from public dropdown"
                  : "Approve for public dropdown"
              }
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
                setEditingOrg(row);
                setEditName(row.name);
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
                setMergingOrg(row);
                setMergeTargetId("");
                setMergeSearch("");
              }}
              title="Merge into a verified organization"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primaryColor cursor-pointer shadow-2xs"
            >
              <GitMerge className="h-3.5 w-3.5" />
              <span>Merge</span>
            </button>
            {row.total_experiences === 0 && (
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(row)}
                title="Delete unused organization"
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

  return (
    <section className="space-y-6">
      <CustomTitleDescription
        title="Experience Organizations"
        description="Manage organizations shown in user profile Experience dropdown suggestions."
        action={
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
            <button
              type="button"
              onClick={() => {
                setNewOrgName("");
                setNewOrgVerified(true);
                setIsAddOpen(true);
              }}
              className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add Organization
            </button>
            <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <CustomInput
                aria-label="Search organizations"
                className="pl-9 pr-3"
                placeholder="Search organizations"
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
            {
              key: "all",
              label: "All Organizations",
              count: pendingCount + verifiedCount,
            },
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
          <p className="mt-3 text-sm text-gray-500">Loading organizations...</p>
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            Organizations could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : companies.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
          <Building2 className="h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No organizations found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {search
              ? "No organizations match your search query."
              : "No organizations found in this filter."}
          </p>
        </div>
      ) : (
        <div
          className={`space-y-6 ${
            isFetching ? "opacity-60 transition-opacity" : ""
          }`}
        >
          <DataTable columns={columns} data={companies} />
          {pagination && pagination.last_page > 1 && (
            <Pagination
              page={page}
              pageSize={pagination.per_page || PAGE_SIZE}
              total={totalItems}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      {/* Add Organization Modal */}
      <CustomModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Organization"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 p-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Organization Name
            </label>
            <CustomInput
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Enter official organization name"
              required
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={newOrgVerified}
              onChange={(e) => setNewOrgVerified(e.target.checked)}
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
              {isCreating ? "Adding..." : "Add Organization"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Rename / Approve Modal */}
      <CustomModal
        open={!!editingOrg}
        onOpenChange={(open) => {
          if (!open) setEditingOrg(null);
        }}
        title="Edit Organization"
        size="md"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4 p-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Organization Name
            </label>
            <CustomInput
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter official organization name"
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
              onClick={() => setEditingOrg(null)}
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
        open={!!mergingOrg}
        onOpenChange={(open) => {
          if (!open) setMergingOrg(null);
        }}
        title="Merge Organization"
        size="md"
      >
        <form onSubmit={handleMergeSubmit} className="space-y-4 p-2">
          <p className="text-xs text-gray-600">
            Move all experiences from{" "}
            <span className="font-semibold text-gray-900">
              {mergingOrg?.name}
            </span>{" "}
            into a verified organization and remove the duplicate entry.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Search Verified Target Organization
            </label>
            <CustomInput
              value={mergeSearch}
              onChange={(e) => setMergeSearch(e.target.value)}
              placeholder="Search verified organizations..."
            />
          </div>
          <div className="max-h-52 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
            {mergeCandidatesQuery.isLoading ? (
              <p className="p-3 text-xs text-gray-500">Loading...</p>
            ) : mergeCandidates.length === 0 ? (
              <p className="p-3 text-xs text-gray-500">
                No verified organizations found.
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
                      name="mergeOrgTarget"
                      value={String(candidate.id)}
                      checked={String(mergeTargetId) === String(candidate.id)}
                      onChange={() => setMergeTargetId(candidate.id)}
                      className="accent-primaryColor"
                    />
                    <span className="truncate text-gray-800">
                      {candidate.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {candidate.total_experiences} experiences
                  </span>
                </label>
              ))
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMergingOrg(null)}
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
