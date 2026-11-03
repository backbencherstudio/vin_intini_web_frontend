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
