"use client";

import { useState } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { CalendarClock, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import AdminDateField from "./AdminDateField";
import {
  useUpdateAdminJobMutation,
  type AdminJobItem,
} from "@/feature/slice/admin/jobs";

interface AdminRepublishJobModalProps {
  job: AdminJobItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const parseJobDate = (val?: string | null): Date | undefined => {
  if (!val) return undefined;
  try {
    const raw = String(val).split("T")[0];
    const [y, m, d] = raw.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  } catch {
    return undefined;
  }
};

const formatDateDisplay = (val?: string | null) => {
  if (!val) return "Not specified";
  const parsed = parseJobDate(val);
  if (!parsed) return String(val);
  return format(parsed, "MMM dd, yyyy");
};

interface RepublishFormProps {
  job: AdminJobItem;
  onClose: () => void;
  onSuccess?: () => void;
}

function RepublishForm({ job, onClose, onSuccess }: RepublishFormProps) {
  const [updateAdminJob, { isLoading: isUpdating }] = useUpdateAdminJobMutation();

  const initialStart = (() => {
    const today = startOfDay(new Date());
    const jobStart = parseJobDate(job.announcement_start_date);
    return jobStart && !isBefore(jobStart, today) ? jobStart : today;
  })();

  const [startDate, setStartDate] = useState<Date | undefined>(initialStart);
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(initialStart, 14));
  const [error, setError] = useState<string>("");

  const handleApplyPreset = (days: number) => {
    const base = startDate || new Date();
    setEndDate(addDays(base, days));
    setError("");
  };

  const handleStartDateChange = (date?: Date) => {
    setStartDate(date);
    if (date && endDate && isBefore(endDate, date)) {
      setEndDate(addDays(date, 14));
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!endDate) {
      setError("Please select an application deadline (End Date).");
      return;
    }

    const today = startOfDay(new Date());
    if (isBefore(endDate, today)) {
      setError("The application deadline must be today or a future date.");
      return;
    }

    if (startDate && isBefore(endDate, startDate)) {
      setError("The application deadline cannot be earlier than the start date.");
      return;
    }

    try {
      const payload: any = {
        id: job.id,
        announcement_start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
        announcement_end_date: format(endDate, "yyyy-MM-dd"),
        status: "published",
      };

      await updateAdminJob(payload).unwrap();
      toast.success("Job deadline extended and published successfully!");
      onClose();
      onSuccess?.();
    } catch (err: any) {
      const serverErrors = err?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const firstErrorMessage = Object.values(serverErrors).flat()[0] as string;
        toast.error(firstErrorMessage || "Validation error occurred.");
      } else {
        const msg = err?.data?.message || err?.message || "Failed to publish job.";
        toast.error(msg);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-1 py-2">
      {/* Informative Alert Message */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 shadow-2xs">
        <CalendarClock className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900 text-sm">
            This job post has expired
          </p>
          <p className="text-amber-800 leading-relaxed text-xs">
            The previous application deadline was{" "}
            <strong>{formatDateDisplay(job.announcement_end_date)}</strong>. To make this job active and published on the network again, please set a new Start Date and a future End Date.
          </p>
        </div>
      </div>

      {/* Job Identity Card */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-[11px] uppercase font-semibold">Job Title</p>
            <h4 className="font-bold text-gray-900 text-sm mt-0.5">{job.job_title}</h4>
          </div>
          <span className="rounded-md bg-cyan-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-cyan-800">
            #{job.job_id}
          </span>
        </div>
        <p className="text-gray-500 mt-1">
          Company: <strong className="text-gray-700">{job.industry?.name || "Verified Partner"}</strong>
        </p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#04A1B7]" />
            Quick Deadline Extension:
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[7, 14, 30, 60].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => handleApplyPreset(days)}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-2xs hover:border-[#04A1B7] hover:bg-cyan-50 hover:text-[#04A1B7] transition cursor-pointer"
            >
              +{days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Date Inputs in Requested Format */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminDateField
          label="Start Date (Optional)"
          placeholder="Select start date"
          value={startDate}
          onChange={handleStartDateChange}
        />

        <AdminDateField
          label="End Date (Application Deadline)"
          required
          placeholder="Select end date"
          value={endDate}
          minDate={startDate || new Date()}
          onChange={(d) => {
            setEndDate(d);
            setError("");
          }}
          error={error}
          helperText="Must be today or a future date"
        />
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <CustomButton
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isUpdating}
        >
          Cancel
        </CustomButton>
        <CustomButton
          type="submit"
          variant="primary"
          loading={isUpdating}
          loadingText="Publishing Job..."
        >
          Update Dates & Publish
        </CustomButton>
      </div>
    </form>
  );
}

export default function AdminRepublishJobModal({
  job,
  open,
  onOpenChange,
  onSuccess,
}: AdminRepublishJobModalProps) {
  if (!job) return null;

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Extend Deadline & Publish Job"
      size="md"
    >
      <RepublishForm
        key={`${job.id}-${open}`}
        job={job}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </CustomModal>
  );
}
