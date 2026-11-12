"use client";

import { useState } from "react";
import { ShieldBan } from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";
import type { AdminProductItem } from "@/feature/slice/admin/products";

const QUICK_REASONS = [
  "Contains prohibited or illegal claims",
  "Violates regulatory and clinical compliance guidelines",
  "Unverified or misleading product information",
  "Inappropriate or policy-violating media content",
];

interface RejectProductModalProps {
  product: AdminProductItem | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<boolean>;
}

function RejectProductFormBody({
  product,
  isSubmitting = false,
  onClose,
  onConfirm,
}: {
  product: AdminProductItem;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<boolean>;
}) {
  const [reason, setReason] = useState(product.rejection_reason ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 5) {
      setValidationError(
        "Please enter a clear rejection reason (minimum 5 characters).",
      );
      return;
    }

    setValidationError(null);
    await onConfirm(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/75 p-3.5">
        <ShieldBan className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div className="space-y-1 text-xs text-red-900">
          <p className="font-semibold">
            Rejecting &ldquo;{product.product_name}&rdquo;
          </p>
          <p className="leading-relaxed text-red-800">
            This product will be immediately hidden from all platform feeds and
            active boosts. The industry will receive your rejection reason via
            notification and will not be able to reactivate or boost this
            listing.
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-[#4A4C56]">
          Quick policy reasons
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
              className="cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-[#4A4C56] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <CustomTextArea
        name="rejection_reason"
        label="Rejection Reason"
        required
        rows={4}
        maxLength={1000}
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          if (validationError) setValidationError(null);
        }}
        placeholder="Explain why this product violates platform or legal guidelines..."
        helperText="Visible to the industry owner so they understand why this listing was removed."
        error={validationError ?? undefined}
      />

      <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-3">
        <CustomButton
          type="button"
          variant="outline"
          size="sm"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </CustomButton>

        <CustomButton
          type="submit"
          variant="destructive"
          size="sm"
          loading={isSubmitting}
        >
          <ShieldBan className="h-3.5 w-3.5" />
          <span>Reject &amp; Hide Product</span>
        </CustomButton>
      </div>
    </form>
  );
}

export default function RejectProductModal({
  product,
  isSubmitting = false,
  onClose,
  onConfirm,
}: RejectProductModalProps) {
  return (
    <CustomModal
      open={Boolean(product)}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
      size="md"
      title="Reject Product"
    >
      {product && (
        <RejectProductFormBody
          key={product.id}
          product={product}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      )}
    </CustomModal>
  );
}
