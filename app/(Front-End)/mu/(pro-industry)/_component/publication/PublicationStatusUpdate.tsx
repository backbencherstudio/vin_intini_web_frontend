"use client";

import CommonStatusDropdown, {
  StatusOption,
} from "@/components/reusable/CommonStatusDropdown";
import { usePublicationStatusUpdateMutation } from "@/feature/slice/jobs/publicationSlice";
import toast from "react-hot-toast";

const STATUS_OPTIONS: StatusOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

export default function PublicationStatusUpdate({
  row,
  disabled = false,
  className,
}: {
  row: { id: string | number; status?: string };
  disabled?: boolean;
  className?: string;
}) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    usePublicationStatusUpdateMutation();

  const status = row.status?.toLowerCase() || "draft";

  const handleStatusChange = async (newStatus: string) => {
    if (disabled || isUpdatingStatus || newStatus === status) return;

    try {
      const response = await updateStatus({
        id: row.id,
        status: newStatus,
      }).unwrap();
      toast.success(response?.message || `Status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Publication status update error:", error);
      toast.error(
        error?.data?.message || "Failed to update publication status",
      );
    }
  };

  return (
    <div className={className || "flex justify-center px-2"}>
      <CommonStatusDropdown
        value={status}
        options={STATUS_OPTIONS}
        onChange={handleStatusChange}
        isLoading={isUpdatingStatus}
        disabled={disabled}
      />
    </div>
  );
}
