"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Search,
  User,
  Users,
} from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomSelect, {
  type SelectOption,
} from "@/components/reusable/dashboard/CustomSelect";
import type {
  AdminJobsMeta,
  ApplicantItem,
  ApplicantStage,
  JobApplicantsStats,
} from "@/feature/slice/admin/jobs";

interface AdminApplicantsTableProps {
  jobInfo?: {
    id: number;
    job_id: string;
    job_title: string;
    position?: string | null;
    work_mode: string;
    industry?: { id: number; name: string; logo: string | null } | null;
  };
  applicants: ApplicantItem[];
  stats?: JobApplicantsStats;
  meta?: AdminJobsMeta;
  isLoading?: boolean;
  selectedStage: string;
  onStageChange: (stage: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewApplicant: (applicant: ApplicantItem) => void;
  onUpdateApplicantStage: (applicant: ApplicantItem, newStage: ApplicantStage) => void;
  updatingId?: number | null;
}

const STAGE_DROPDOWN_OPTIONS: SelectOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Interviewed", value: "interviewed" },
  { label: "Offered", value: "offered" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminApplicantsTable({
  jobInfo,
  applicants,
  stats,
  meta,
  isLoading = false,
  selectedStage,
  onStageChange,
  searchQuery,
  onSearchChange,
  currentPage,
  onPageChange,
  onViewApplicant,
  onUpdateApplicantStage,
  updatingId,
}: AdminApplicantsTableProps) {
  const stageTabs = [
    { id: "all", label: "All Applicants", count: stats?.all ?? 0 },
    { id: "pending", label: "Pending", count: stats?.pending ?? 0 },
    { id: "reviewing", label: "Reviewing", count: stats?.reviewing ?? 0 },
    { id: "shortlisted", label: "Shortlisted", count: stats?.shortlisted ?? 0 },
    { id: "interviewed", label: "Interviewed", count: stats?.interviewed ?? 0 },
    { id: "offered", label: "Offered", count: stats?.offered ?? 0 },
    { id: "hired", label: "Hired", count: stats?.hired ?? 0 },
    { id: "rejected", label: "Rejected", count: stats?.rejected ?? 0 },
  ];

  const getStageBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "reviewing":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "shortlisted":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "interviewed":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "offered":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "hired":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-5">
      {/* Back button and Job Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/jobs"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-[#04A1B7] hover:bg-cyan-50 hover:text-[#04A1B7]"
            title="Back to Job Management"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                {jobInfo?.job_title || "Job Applicants"}
              </h2>
              {jobInfo?.work_mode && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize">
                  {jobInfo.work_mode}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Industry: <span className="font-semibold text-gray-700">{jobInfo?.industry?.name || "Company"}</span>
              {jobInfo?.job_id && (
                <span className="font-mono text-gray-400 ml-2">#{jobInfo.job_id}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-right">
            <span className="block text-[11px] font-medium text-cyan-700 uppercase">
              Total Applicants
            </span>
            <span className="text-lg font-bold text-cyan-900">
              {stats?.all ?? applicants.length}
            </span>
          </div>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {stageTabs.map((tab) => {
          const isActive = selectedStage === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStageChange(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#04A1B7] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search applicants by name, email, position, or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#04A1B7] focus:outline-none focus:ring-1 focus:ring-[#04A1B7]"
        />
      </div>

      {/* Applicants Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3.5">Candidate</th>
                <th className="px-4 py-3.5">Current Role</th>
                <th className="px-4 py-3.5">Expected Salary</th>
                <th className="px-4 py-3.5">Applied Date</th>
                <th className="px-4 py-3.5 text-center">Resume</th>
                <th className="px-4 py-3.5">Application Stage</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 w-32 rounded bg-gray-200 mb-1" />
                      <div className="h-3 w-20 rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-28 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="mx-auto h-6 w-16 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-7 w-28 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="ml-auto h-8 w-8 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : applicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <Users className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">No applicants found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      No candidates currently match this stage or search query.
                    </p>
                  </td>
                </tr>
              ) : (
                applicants.map((app) => {
                  const isUpdatingThis = updatingId === app.id;

                  return (
                    <tr
                      key={app.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      {/* Candidate Name & Contact */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {app.applicant?.profile_image ? (
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-200">
                              <Image
                                src={app.applicant.profile_image}
                                alt={app.full_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-500">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => onViewApplicant(app)}
                              className="font-bold text-gray-900 hover:text-[#04A1B7] transition-colors text-left truncate block"
                            >
                              {app.full_name}
                            </button>
                            <p className="text-[11px] text-gray-400 truncate">
                              {app.email}
                              {app.phone_number && ` • ${app.phone_number}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Current Role */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-800">
                          {app.current_position || "Not specified"}
                        </p>
                      </td>

                      {/* Expected Salary */}
                      <td className="px-4 py-3.5 font-medium text-gray-800">
                        {app.expected_salary
                          ? `$${Number(app.expected_salary).toLocaleString()}`
                          : <span className="text-gray-400 italic">Open</span>}
                      </td>

                      {/* Applied Date */}
                      <td className="px-4 py-3.5 text-gray-600">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : "N/A"}
                      </td>

                      {/* Resume Download */}
                      <td className="px-4 py-3.5 text-center">
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-[#04A1B7] hover:bg-cyan-100 transition-colors"
                            title="Download Candidate Resume"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            CV
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>

                      {/* Stage Selector */}
                      <td className="px-4 py-3.5">
                        <div className="w-36">
                          <select
                            value={app.status}
                            disabled={isUpdatingThis}
                            onChange={(e) =>
                              onUpdateApplicantStage(app, e.target.value as ApplicantStage)
                            }
                            className={`h-8 w-full rounded-lg border px-2.5 text-xs font-semibold outline-none transition-colors cursor-pointer disabled:opacity-50 ${getStageBadgeColor(
                              app.status
                            )}`}
                          >
                            {STAGE_DROPDOWN_OPTIONS.map((opt) => (
                              <option key={String(opt.value)} value={String(opt.value)}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onViewApplicant(app)}
                          title="View Full Profile"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-[#04A1B7] hover:bg-cyan-50 hover:text-[#04A1B7] cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-4 py-3 sm:flex-row">
            <p className="text-xs text-gray-500">
              Showing page <span className="font-semibold">{meta.current_page}</span> of{" "}
              <span className="font-semibold">{meta.last_page}</span> (Total {meta.total} candidates)
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={meta.current_page <= 1}
                onClick={() => onPageChange(meta.current_page - 1)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - meta.current_page) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      p === meta.current_page
                        ? "bg-[#04A1B7] text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              <button
                type="button"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => onPageChange(meta.current_page + 1)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

