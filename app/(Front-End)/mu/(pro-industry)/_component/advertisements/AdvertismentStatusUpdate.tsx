"use client";

import CommonStatusDropdown, {
  StatusOption,
} from "@/components/reusable/CommonStatusDropdown";
import { useUpdateAdvertisementStatusMutation } from "@/feature/slice/jobs/advertisementSlice";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS: StatusOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

function AdvertismentStatusUpdate({
  row,
  disabled = false,
  className,
}: {
  row: { id: string | number; status?: string; rejection_reason?: string | null };
  disabled?: boolean;
  className?: string;
}) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdvertisementStatusMutation();

  const status = row.status?.toLowerCase() || "draft";
  const isRejected = status === "rejected";

  const handleStatusChange = async (newStatus: string) => {
    if (disabled || isRejected || isUpdatingStatus || newStatus === status) return;

    try {
      const response = await updateStatus({
        id: row.id,
        data: { status: newStatus },
      }).unwrap();
      toast.success(response?.message || `Status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Advertisement status update error:", error);
      toast.error(
        error?.data?.message || "Failed to update advertisement status",
      );
    }
  };

  if (isRejected) {
    return (
      <div className={className || "flex justify-center px-3"}>
        <span
          title={
            row.rejection_reason
              ? `Rejected by Admin: ${row.rejection_reason}`
              : "Rejected by Admin"
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 cursor-not-allowed"
        >
          <Lock className="w-3 h-3 shrink-0" />
          <span>Rejected</span>
        </span>
      </div>
    );
  }

  return (
    <div className={className || "flex justify-center px-3"}>
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

export default AdvertismentStatusUpdate;
