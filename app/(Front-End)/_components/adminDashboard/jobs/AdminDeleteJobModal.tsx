"use client";

import { Trash2 } from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomModal from "@/components/reusable/dashboard/CustomModal";

interface AdminDeleteJobModalProps {
  isOpen: boolean;
  jobTitle?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function AdminDeleteJobModal({
  isOpen,
  jobTitle,
  isSubmitting = false,
  onClose,
  onConfirm,
}: AdminDeleteJobModalProps) {
  return (
    <CustomModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
      title="Delete Job Posting"
      size="xsm"
    >
      <div className="space-y-4 p-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Trash2 className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-semibold text-gray-900">
            Are you sure you want to delete this job?
          </h4>
          <p className="text-sm text-gray-500">
            {jobTitle ? (
              <>
                You are about to permanently delete &ldquo;
                <span className="font-medium text-gray-800">{jobTitle}</span>
                &rdquo;.
              </>
            ) : (
              "This action cannot be undone."
            )}{" "}
            All applications tied to this post will also be permanently removed.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          <CustomButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="button"
            variant="destructive"
            loading={isSubmitting}
            loadingText="Deleting..."
            onClick={onConfirm}
          >
            Delete Permanently
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}

