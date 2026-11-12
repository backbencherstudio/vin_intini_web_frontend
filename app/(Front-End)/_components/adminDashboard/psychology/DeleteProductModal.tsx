"use client";

import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";

interface DeleteProductModalProps {
  isOpen: boolean;
  productName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProductModal({
  isOpen,
  productName,
  onClose,
  onConfirm,
}: DeleteProductModalProps) {
  return (
    <CustomDeletModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Product?"
      description={
        productName
          ? `Are you sure you want to delete "${productName}"? This will remove it from the catalog.`
          : 'Click "Delete Product" if you want to remove this product, otherwise press Cancel.'
      }
      confirmText="Delete Product"
      cancelText="Cancel"
    />
  );
}
