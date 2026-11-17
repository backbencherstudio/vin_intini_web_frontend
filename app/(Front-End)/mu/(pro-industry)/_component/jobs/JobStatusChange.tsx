"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import CommonStatusDropdown, {
  StatusOption,
} from "@/components/reusable/CommonStatusDropdown";
import { useStatusUpdateForJobsMutation } from "@/feature/slice/jobs/jobSlice";
import { getEffectiveJobStatus } from "@/lib/jobStatusHelper";
import toast from "react-hot-toast";
import { JobItem } from "./JobListCard";
import IndustryRepublishJobModal from "./IndustryRepublishJobModal";

const BASE_JOB_STATUS_OPTIONS: StatusOption[] = [
  { value: "published", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
  { value: "archive", label: "Archived" },
  { value: "expired", label: "Expired" },
];

function JobStatusChange({ value, row }: { value: string; row: JobItem }) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useStatusUpdateForJobsMutation();
  const [isRepublishOpen, setIsRepublishOpen] = useState(false);

  const effectiveStatus = getEffectiveJobStatus(
    row.status || value,
    row.announcement_start_date,
    row.announcement_end_date
  );

  const options = useMemo(() => {
    const list = [...BASE_JOB_STATUS_OPTIONS];
    if (effectiveStatus === "scheduled") {
      return [{ value: "scheduled", label: "Scheduled" }, ...list];
    }
    return list;
  }, [effectiveStatus]);

  const isRejected =
    value?.toLowerCase() === "rejected" ||
    row?.status?.toLowerCase() === "rejected";

  if (isRejected) {
    return (
      <div className="flex justify-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-semibold text-red-700 cursor-not-allowed select-none shadow-2xs"
        >
          <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
          Rejected
        </span>
      </div>
    );
  }

  if (effectiveStatus === "draft") {
    return (
      <div className="flex justify-center">
        <Link
          href={`/mu/job-listing/${row.id}/edit`}
          title="Draft job - Click to complete and publish"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-[#FEF6E6] px-3.5 py-1 text-xs font-semibold text-[#d97706] hover:bg-amber-100/90 hover:border-amber-300 transition-colors cursor-pointer select-none shadow-2xs"
        >
          <span className="h-2 w-2 rounded-full bg-[#d97706] shrink-0" />
          Draft
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === effectiveStatus) return;

    if (newStatus === "scheduled") {
      toast("To schedule a job post, please edit the job and set a future start date.", {
        icon: "ℹ️",
      });
      return;
    }

    if (newStatus === "published") {
      if (row.announcement_end_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(
          row.announcement_end_date.includes("T")
            ? row.announcement_end_date
            : `${row.announcement_end_date}T23:59:59`
        );
        if (end < today) {
          // Job had a deadline that has passed -> Must update end date to reactivate
          setIsRepublishOpen(true);
          return;
        }
      }
    }

    const payload: { status: string; rejection_reason?: string } = {
      status: newStatus,
    };

    try {
      const res = await updateStatus({
        id: row.id,
        data: payload,
      }).unwrap();
      toast.success(res?.message || `Job status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error(error?.data?.message || "Failed to update job status");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <CommonStatusDropdown
        value={effectiveStatus}
        options={options}
        onChange={handleStatusChange}
        isLoading={isUpdatingStatus}
      />
      {effectiveStatus === "scheduled" && row.announcement_start_date && (
        <span className="text-[10px] font-medium text-indigo-600">
          Goes live {format(new Date(row.announcement_start_date.split("T")[0] + "T00:00:00"), "MMM dd")}
        </span>
      )}
      <IndustryRepublishJobModal
        job={row}
        open={isRepublishOpen}
        onOpenChange={setIsRepublishOpen}
      />
    </div>
  );
}

export default JobStatusChange;
