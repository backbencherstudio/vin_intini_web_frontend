// components/reusable/dashboard/DeleteConfirmationModal.tsx

import React from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export default function CustomDeletModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Do you want to delete this user?",
  description = "Click “Delete Now” if you want to delete otherwise press cancel.",
  confirmText = "Delete Now",
  cancelText = "Cancel",
}: DeleteConfirmationModalProps) {
  return (
    <CustomModal
      open={isOpen}
      onOpenChange={onClose}
      title={title}
      size="xsm"
      closeButtonType="custom"
    >
      <div className="flex flex-col gap-6 w-full p-3">
        <p className="text-[#777980]  text-[16px] font-normal leading-[150%] tracking-[0.08px]">
          {description}
        </p>

        <div className="flex w-full items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-30.75 h-9 cursor-pointer rounded-sm border border-[#8C8C8C] px-3 text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-[#777980] transition-colors"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-30.75 h-9 cursor-pointer rounded-sm bg-redColor px-3 text-[14px] font-semibold leading-[140%] tracking-[0.07px] text-white transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
