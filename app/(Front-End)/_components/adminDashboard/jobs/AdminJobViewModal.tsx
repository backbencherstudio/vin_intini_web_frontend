"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldAlert,
  Tag,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import type { AdminJobItem } from "@/feature/slice/admin/jobs";
import { useGetAdminJobByIdQuery } from "@/feature/slice/admin/jobs";

interface AdminJobViewModalProps {
  job: AdminJobItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (job: AdminJobItem) => void;
  onToggleStatus: (job: AdminJobItem, newStatus: string) => void;
  onEdit?: (job: AdminJobItem) => void;
  isUpdatingStatus?: boolean;
}

export default function AdminJobViewModal({
  job,
  open,
  onOpenChange,
  onReject,
  onToggleStatus,
  onEdit,
  isUpdatingStatus = false,
}: AdminJobViewModalProps) {
  const { data: detailData, isLoading: isDetailLoading } = useGetAdminJobByIdQuery(
    job?.id ?? 0,
    { skip: !job?.id || !open }
  );

  const activeJob = detailData?.data ?? job;
  const appStats = detailData?.application_stats;

  if (!activeJob) return null;

  const isRejected = activeJob.status === "rejected";
  const isPublished = activeJob.status === "published";

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> Published
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <Clock className="h-3.5 w-3.5" /> Expired
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 capitalize">
            {status}
          </span>
        );
    }
  };

  const parsedTags: string[] = (() => {
    if (!activeJob.tags) return [];
    if (Array.isArray(activeJob.tags)) return activeJob.tags;
    try {
      const parsed = JSON.parse(activeJob.tags);
      return Array.isArray(parsed) ? parsed : [String(activeJob.tags)];
    } catch {
      return String(activeJob.tags).split(",").map((t) => t.trim()).filter(Boolean);
    }
  })();

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Job Posting Details"
      size="lg"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1 py-2">
        {/* Rejection Banner */}
        {isRejected && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-red-900 shadow-sm">
            <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
            <div className="space-y-1 text-xs">
              <p className="text-sm font-bold text-red-800">
                This job posting is currently REJECTED
              </p>
              <p className="font-medium text-red-700">
                Reason: &ldquo;{activeJob.rejection_reason || "Violation of community rules or listing guidelines"}&rdquo;
              </p>
              {activeJob.reviewed_at && (
                <p className="text-[11px] text-red-600">
                  Reviewed at: {new Date(activeJob.reviewed_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Header Profile / Basic Info */}
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {activeJob.industry?.logo ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                <Image
                  src={activeJob.industry.logo}
                  alt={activeJob.industry.name || "Industry Logo"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-500 shadow-sm">
                <Building2 className="h-8 w-8" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {activeJob.job_title}
                </h3>
                {getStatusBadge(activeJob.status)}
              </div>
              <p className="text-sm font-medium text-gray-600">
                {activeJob.industry?.name || "Verified Partner"}
              </p>
              <p className="text-xs text-gray-400">
                Job ID: <span className="font-mono font-medium text-gray-600">{activeJob.job_id}</span>
                {activeJob.network_type && (
                  <span className="ml-2 inline-block rounded-md bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-800 uppercase">
                    {activeJob.network_type}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(activeJob);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#04A1B7] bg-white px-3 py-2 text-xs font-semibold text-[#04A1B7] shadow-2xs transition hover:bg-cyan-50 cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Job</span>
              </button>
            )}
            <Link
              href={`/dashboard/jobs/${activeJob.id}/applicants`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#04A1B7] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#038A9D]"
            >
              <Users className="h-4 w-4" />
              View Applicants ({activeJob.applications_count ?? 0})
            </Link>
          </div>
        </div>

        {/* Applicant Stage Stats Bar */}
        {appStats && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Applications Overview ({appStats.total} total)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7 text-center">
              <div className="rounded-xl border border-amber-200 bg-white p-2">
                <span className="block text-xs font-medium text-amber-700">Pending</span>
                <span className="text-base font-bold text-amber-900">{appStats.pending}</span>
              </div>
              <div className="rounded-xl border border-blue-200 bg-white p-2">
                <span className="block text-xs font-medium text-blue-700">Reviewing</span>
                <span className="text-base font-bold text-blue-900">{appStats.reviewing}</span>
              </div>
              <div className="rounded-xl border border-purple-200 bg-white p-2">
                <span className="block text-xs font-medium text-purple-700">Shortlisted</span>
                <span className="text-base font-bold text-purple-900">{appStats.shortlisted}</span>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-white p-2">
                <span className="block text-xs font-medium text-indigo-700">Interview</span>
                <span className="text-base font-bold text-indigo-900">{appStats.interviewed}</span>
              </div>
              <div className="rounded-xl border border-teal-200 bg-white p-2">
                <span className="block text-xs font-medium text-teal-700">Offered</span>
                <span className="text-base font-bold text-teal-900">{appStats.offered}</span>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white p-2">
                <span className="block text-xs font-medium text-emerald-700">Hired</span>
                <span className="text-base font-bold text-emerald-900">{appStats.hired}</span>
              </div>
              <div className="rounded-xl border border-red-200 bg-white p-2">
                <span className="block text-xs font-medium text-red-700">Rejected</span>
                <span className="text-base font-bold text-red-900">{appStats.rejected}</span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <Building2 className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Position & Category</p>
              <p className="text-xs font-semibold text-gray-800">
                {activeJob.position || "General"} {activeJob.category ? `• ${activeJob.category}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Work Mode & Location</p>
              <p className="text-xs font-semibold text-gray-800 capitalize">
                {activeJob.work_mode} {activeJob.state?.name ? `• ${activeJob.state.name}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Salary Range</p>
              <p className="text-xs font-semibold text-gray-800">
                {activeJob.salary_min || activeJob.salary_max ? (
                  <>
                    ${Number(activeJob.salary_min || 0).toLocaleString()} - ${Number(activeJob.salary_max || 0).toLocaleString()}
                    {activeJob.salary_type ? ` / ${activeJob.salary_type}` : ""}
                  </>
                ) : (
                  "Competitive / Negotiable"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <UserCheck className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Employment & Experience</p>
              <p className="text-xs font-semibold text-gray-800 capitalize">
                {activeJob.employment_type || "Full Time"} {activeJob.experience ? `• ${activeJob.experience}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Contact Email</p>
              <p className="text-xs font-semibold text-gray-800 truncate">{activeJob.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase">Created Date</p>
              <p className="text-xs font-semibold text-gray-800">
                {activeJob.created_at ? new Date(activeJob.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Posting Schedule */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Posting Schedule & Timeline
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
              <Calendar className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase">Announcement Start Date</p>
                <p className="text-xs font-bold text-gray-800">
                  {formatDate(activeJob.announcement_start_date) || "Immediate / Not Specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
              <Clock className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase">Application Deadline (End Date)</p>
                <p className="text-xs font-bold text-gray-800">
                  {formatDate(activeJob.announcement_end_date) || "Open Until Filled"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
              <Calendar className="h-5 w-5 text-gray-500 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase">Posted Date</p>
                <p className="text-xs font-bold text-gray-800">
                  {formatDate(activeJob.created_at) || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Job Description & Responsibilities
          </h4>
          <div
            className="prose prose-sm max-w-none rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-xs leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: activeJob.job_description }}
          />
        </div>

        {/* Tags */}
        {parsedTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tags & Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {parsedTags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow-2xs"
                >
                  <Tag className="h-3 w-3 text-gray-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            {isRejected && (
              <CustomButton
                type="button"
                variant="primary"
                loading={isUpdatingStatus}
                loadingText="Restoring..."
                onClick={() => onToggleStatus(activeJob, "published")}
              >
                Restore & Publish
              </CustomButton>
            )}
            {!isRejected && (
              <CustomButton
                type="button"
                variant="destructive"
                onClick={() => onReject(activeJob)}
              >
                Reject Listing
              </CustomButton>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <CustomButton
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(activeJob);
                }}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit Job
              </CustomButton>
            )}
            <CustomButton
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Close
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}

