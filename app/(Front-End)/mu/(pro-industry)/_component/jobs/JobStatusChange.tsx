"use client";

import CommonStatusDropdown, {
  StatusOption,
} from "@/components/reusable/CommonStatusDropdown";
import { useStatusUpdateForJobsMutation } from "@/feature/slice/jobs/jobSlice";
import toast from "react-hot-toast";
import { JobItem } from "./JobListCard";

const JOB_STATUS_OPTIONS: StatusOption[] = [
  { value: "published", label: "Active" },
  { value: "archive", label: "Archive" },
  { value: "expired", label: "Expired" },
];

function JobStatusChange({ value, row }: { value: string; row: JobItem }) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useStatusUpdateForJobsMutation();

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

  const handleStatusChange = async (newStatus: string) => {
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

  const currentVal =
    value?.toLowerCase() === "active"
      ? "published"
      : value?.toLowerCase() || "published";

  return (
    <div className="flex justify-center">
      <CommonStatusDropdown
        value={currentVal}
        options={JOB_STATUS_OPTIONS}
        onChange={handleStatusChange}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
}

export default JobStatusChange;
