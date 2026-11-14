"use client";

import { useState } from "react";
import { AlertTriangle, ShieldBan } from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";
import type { AdminJobItem } from "@/feature/slice/admin/jobs";

const QUICK_REASONS = [
  "Role details violate platform terms and compliance guidelines",
  "Misleading job title, inaccurate responsibilities, or scam warning",
  "Salary or compensation range is unverified, missing, or fraudulent",
  "Unverified third-party recruiting agency posting without permission",
  "Discriminatory language or violates equal opportunity guidelines",
  "Duplicate posting or already filled position",
];

interface AdminRejectJobModalProps {
  job: AdminJobItem | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<boolean | void>;
}

export default function AdminRejectJobModal({
  job,
  isSubmitting = false,
  onClose,
  onConfirm,
}: AdminRejectJobModalProps) {
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 5) {
      setValidationError("Please enter a clear rejection reason (minimum 5 characters).");
      return;
    }

    setValidationError(null);
    await onConfirm(trimmed);
  };

  return (
    <CustomModal
      open={Boolean(job)}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
      title="Reject Job Posting"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5">
          <ShieldBan className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="space-y-1 text-xs text-red-900">
            <p className="font-semibold text-sm">
              Rejecting &ldquo;{job.job_title}&rdquo;
            </p>
            <p className="text-red-700">
              Industry: <span className="font-medium">{job.industry?.name || "Verified Partner"}</span> ({job.job_id})
            </p>
            <p className="leading-relaxed text-red-800">
              This job will be immediately unlisted and marked as rejected. The industry owner will receive your rejection reason via real-time notification, in-app bell, and push notification.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Preset Policy Reasons
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_REASONS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setReason(preset);
                  setValidationError(null);
                }}
                className="cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <CustomTextArea
          name="rejection_reason"
          label="Detailed Rejection Reason"
          required
          rows={4}
          maxLength={1000}
          value={reason}
          placeholder="Explain to the industry owner why this job listing is rejected..."
          onChange={(e) => {
            setReason(e.target.value);
            if (validationError) setValidationError(null);
          }}
          error={validationError ?? undefined}
          helperText={`${reason.length}/1000 characters`}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <CustomButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="destructive"
            loading={isSubmitting}
            loadingText="Rejecting..."
          >
            Confirm Rejection
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
}

