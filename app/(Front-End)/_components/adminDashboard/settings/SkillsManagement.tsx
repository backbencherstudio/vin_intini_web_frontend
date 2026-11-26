"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  EyeOff,
  GitMerge,
  Pencil,
  Plus,
  Search,
  Sparkles,
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
  AdminSkillItem,
  useCreateAdminSkillMutation,
  useDeleteAdminSkillMutation,
  useGetAdminSkillsQuery,
  useMergeAdminSkillMutation,
  useRenameAdminSkillMutation,
  useUpdateAdminSkillStatusMutation,
} from "@/feature/slice/admin/reports/adminReportApi";

const PAGE_SIZE = 20;

export default function SkillsManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified">("all");
  const [page, setPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillVerified, setNewSkillVerified] = useState(true);

  const [editingSkill, setEditingSkill] = useState<AdminSkillItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editVerified, setEditVerified] = useState(true);

  const [mergingSkill, setMergingSkill] = useState<AdminSkillItem | null>(null);
  const [mergeSearch, setMergeSearch] = useState("");
  const [mergeTargetId, setMergeTargetId] = useState<number | string>("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAdminSkillsQuery({
      search: search.trim() || undefined,
      status: statusFilter,
      page,
    });

  const mergeCandidatesQuery = useGetAdminSkillsQuery(
    {
      search: mergeSearch.trim() || undefined,
      status: "verified",
      page: 1,
    },
    { skip: !mergingSkill },
  );

  const [createSkill, { isLoading: isCreating }] = useCreateAdminSkillMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdminSkillStatusMutation();
  const [renameSkill, { isLoading: isRenaming }] = useRenameAdminSkillMutation();
  const [mergeSkill, { isLoading: isMerging }] = useMergeAdminSkillMutation();
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteAdminSkillMutation();

  const pagination = data?.pagination;
  const skills = data?.data ?? [];
  const pendingCount = data?.summary?.pending_count ?? 0;
  const verifiedCount = data?.summary?.verified_count ?? 0;
  const totalItems = pagination?.total ?? skills.length;
  const totalPages = pagination?.last_page ?? 1;

  const mergeCandidates = (mergeCandidatesQuery.data?.data ?? []).filter(
    (item) => String(item.id) !== String(mergingSkill?.id),
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      const res = await createSkill({
        name: newSkillName.trim(),
        is_verified: newSkillVerified,
      }).unwrap();
      toast.success(res.message || "Skill added");
      setIsAddOpen(false);
      setNewSkillName("");
      setNewSkillVerified(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add skill");
    }
  };

  const handleToggleStatus = async (row: AdminSkillItem) => {
    try {
      const res = await updateStatus({
        id: row.id,
        is_verified: !row.is_verified,
      }).unwrap();
      toast.success(res.message || "Skill status updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editName.trim()) return;
    try {
      const res = await renameSkill({
        id: editingSkill.id,
        name: editName.trim(),
        is_verified: editVerified,
      }).unwrap();
      toast.success(res.message || "Skill updated");
      setEditingSkill(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update skill");
    }
  };

  const handleMergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergingSkill || !mergeTargetId) {
      toast.error("Please select a target skill");
      return;
    }
    try {
      const res = await mergeSkill({
        id: mergingSkill.id,
        target_skill_id: mergeTargetId,
      }).unwrap();
      toast.success(res.message || "Skill merged successfully");
      setMergingSkill(null);
      setMergeTargetId("");
      setMergeSearch("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to merge skill");
    }
  };

  const handleDelete = async (row: AdminSkillItem) => {
    try {
      const res = await deleteSkill(row.id).unwrap();
      toast.success(res.message || "Skill deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete skill");
    }
  };

  const columns: Column<AdminSkillItem>[] = useMemo(
    () => [
      {
        header: "No.",
        cell: (row) => (
          <span className="font-medium text-gray-500">{row.sl_no ?? row.id}</span>
        ),
      },
      {
        header: "Skill",
        cell: (row) => (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-primaryColor border border-teal-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-medium text-gray-900 text-sm">{row.name}</span>
          </div>
        ),
      },
      {
        header: "Usage",
        cell: (row) => (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            {row.usage_count}
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
                setEditingSkill(row);
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
                setMergingSkill(row);
                setMergeTargetId("");
                setMergeSearch("");
              }}
              title="Merge into a verified skill"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primaryColor cursor-pointer shadow-2xs"
            >
              <GitMerge className="h-3.5 w-3.5" />
              <span>Merge</span>
            </button>
            {row.usage_count === 0 && (
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(row)}
                title="Delete unused skill"
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
        title="Skills"
        description="Review and curate skills shown in profile, onboarding, and experience dropdowns."
        action={
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
            <button
              type="button"
              onClick={() => {
                setNewSkillName("");
                setNewSkillVerified(true);
                setIsAddOpen(true);
              }}
              className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </button>
            <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <CustomInput
                aria-label="Search skills"
                className="pl-9 pr-3"
                placeholder="Search skills"
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
              label: "All Skills",
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

      {/* Main Table */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primaryColor border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">Loading skills...</p>
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            Skills could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : skills.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
          <Sparkles className="h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No skills found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {search
              ? "No skills match your search query."
              : "No skills found in this filter."}
          </p>
        </div>
      ) : (
        <div
          className={`space-y-6 ${
            isFetching ? "opacity-60 transition-opacity" : ""
          }`}
        >
          <DataTable columns={columns} data={skills} />
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

      {/* Add Skill Modal */}
      <CustomModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Skill"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 p-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Skill Name
            </label>
            <CustomInput
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Enter official skill name"
              required
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={newSkillVerified}
              onChange={(e) => setNewSkillVerified(e.target.checked)}
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
              {isCreating ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Edit Skill Modal */}
      <CustomModal
        open={!!editingSkill}
        onOpenChange={(open) => {
          if (!open) setEditingSkill(null);
        }}
        title="Edit Skill"
        size="md"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4 p-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Skill Name
            </label>
            <CustomInput
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter official skill name"
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
              onClick={() => setEditingSkill(null)}
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

      {/* Merge Skill Modal */}
      <CustomModal
        open={!!mergingSkill}
        onOpenChange={(open) => {
          if (!open) setMergingSkill(null);
        }}
        title="Merge Skill"
        size="md"
      >
        <form onSubmit={handleMergeSubmit} className="space-y-4 p-2">
          <p className="text-xs text-gray-600">
            Reassign all profiles, educations, and experiences using{" "}
            <span className="font-semibold text-gray-900">
              {mergingSkill?.name}
            </span>{" "}
            to a verified skill and delete the duplicate.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">
              Search Verified Target Skill
            </label>
            <CustomInput
              value={mergeSearch}
              onChange={(e) => setMergeSearch(e.target.value)}
              placeholder="Search verified skills..."
            />
          </div>
          <div className="max-h-52 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
            {mergeCandidatesQuery.isLoading ? (
              <p className="p-3 text-xs text-gray-500">Loading...</p>
            ) : mergeCandidates.length === 0 ? (
              <p className="p-3 text-xs text-gray-500">
                No verified skills found.
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
                      name="mergeSkillTarget"
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
                    {candidate.usage_count} uses
                  </span>
                </label>
              ))
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMergingSkill(null)}
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
