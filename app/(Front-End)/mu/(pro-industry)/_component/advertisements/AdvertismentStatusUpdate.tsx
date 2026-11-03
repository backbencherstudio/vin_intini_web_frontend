"use client";

import CommonStatusDropdown, {
  StatusOption,
} from "@/components/reusable/CommonStatusDropdown";
import { useUpdateAdvertisementStatusMutation } from "@/feature/slice/jobs/advertisementSlice";
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
  row: { id: string | number; status?: string };
  disabled?: boolean;
  className?: string;
}) {
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdvertisementStatusMutation();

  const status = row.status?.toLowerCase() || "draft";

  const handleStatusChange = async (newStatus: string) => {
    if (disabled || isUpdatingStatus || newStatus === status) return;

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
