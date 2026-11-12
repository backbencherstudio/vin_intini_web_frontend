"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useDeleteAdminProductMutation,
  useRejectAdminProductMutation,
  useUpdateAdminProductStatusMutation,
  type AdminProductItem,
  type AdminProductStatus,
} from "@/feature/slice/admin/products";
import { extractApiErrorMessage } from "../psychology/productHelpers";

interface UseAdminProductActionsOptions {
  onMutationSuccess?: () => void;
}

export function useAdminProductActions(
  options?: UseAdminProductActionsOptions,
) {
  const onMutationSuccess = options?.onMutationSuccess;

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(
    null,
  );
  const [defaultSectionId, setDefaultSectionId] = useState<number | undefined>();
  const [defaultCategoryId, setDefaultCategoryId] = useState<
    number | undefined
  >();

  const [viewingProduct, setViewingProduct] = useState<AdminProductItem | null>(
    null,
  );
  const [rejectingProduct, setRejectingProduct] =
    useState<AdminProductItem | null>(null);
  const [deletingProduct, setDeletingProduct] =
    useState<AdminProductItem | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const [updateProductStatus] = useUpdateAdminProductStatusMutation();
  const [rejectAdminProduct, { isLoading: isRejecting }] =
    useRejectAdminProductMutation();
  const [deleteAdminProduct, { isLoading: isDeleting }] =
    useDeleteAdminProductMutation();

  const handleOpenCreateModal = (
    hasSections: boolean,
    sectionId?: number,
    categoryId?: number,
  ) => {
    if (!hasSections) {
      toast.error(
        "Create at least one section and category first before adding products.",
      );
      return;
    }

    setEditingProduct(null);
    setDefaultSectionId(sectionId);
    setDefaultCategoryId(categoryId);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: AdminProductItem) => {
    setEditingProduct(product);
    setDefaultSectionId(product.section_id);
    setDefaultCategoryId(product.category_id);
    setIsFormModalOpen(true);
  };

  const handleToggleStatus = async (
    product: AdminProductItem,
    nextStatus: AdminProductStatus,
  ) => {
    if (updatingStatusId === product.id) return;

    setUpdatingStatusId(product.id);
    try {
      const res = await updateProductStatus({
        id: product.id,
        status: nextStatus,
      }).unwrap();
      toast.success(res.message || `Product marked as ${nextStatus}.`);
      setViewingProduct((prev) =>
        prev?.id === product.id
          ? {
              ...prev,
              status: nextStatus,
              rejection_reason: null,
              rejected_at: null,
            }
          : prev,
      );
      onMutationSuccess?.();
    } catch (err) {
      toast.error(
        extractApiErrorMessage(err, "Failed to update product status."),
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleConfirmReject = async (reason: string): Promise<boolean> => {
    if (!rejectingProduct || isRejecting) return false;

    const target = rejectingProduct;
    try {
      const res = await rejectAdminProduct({
        id: target.id,
        reason,
      }).unwrap();
      toast.success(
        res.message || `"${target.product_name}" rejected and hidden.`,
      );
      setViewingProduct((prev) =>
        prev?.id === target.id ? (res.data ?? prev) : prev,
      );
      setRejectingProduct(null);
      onMutationSuccess?.();
      return true;
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Failed to reject product."));
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct || isDeleting) return;

    const target = deletingProduct;
    try {
      const res = await deleteAdminProduct(target.id).unwrap();
      toast.success(
        res.message || `"${target.product_name}" removed successfully.`,
      );
      if (viewingProduct?.id === target.id) {
        setViewingProduct(null);
      }
      setDeletingProduct(null);
      onMutationSuccess?.();
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Failed to delete product."));
    }
  };

  return {
    isFormModalOpen,
    setIsFormModalOpen,
    editingProduct,
    setEditingProduct,
    defaultSectionId,
    defaultCategoryId,
    viewingProduct,
    setViewingProduct,
    rejectingProduct,
    setRejectingProduct,
    isRejecting,
    deletingProduct,
    setDeletingProduct,
    updatingStatusId,
    onMutationSuccess,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleToggleStatus,
    handleConfirmReject,
    handleConfirmDelete,
  };
}
