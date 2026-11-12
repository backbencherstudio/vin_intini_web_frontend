"use client";

import type {
  AdminIndustryType,
  AdminNetworkType,
  AdminProductSection,
} from "@/feature/slice/admin/products";
import CreateProductModal from "../psychology/CreateProductModal";
import DeleteProductModal from "../psychology/DeleteProductModal";
import ProductViewModal from "../psychology/ProductViewModal";
import RejectProductModal from "../psychology/RejectProductModal";
import type { useAdminProductActions } from "./useAdminProductActions";

interface AdminProductModalsProps {
  networkType: AdminNetworkType;
  industryType: AdminIndustryType;
  sections: AdminProductSection[];
  actions: ReturnType<typeof useAdminProductActions>;
}

export default function AdminProductModals({
  networkType,
  industryType,
  sections,
  actions,
}: AdminProductModalsProps) {
  return (
    <>
      <CreateProductModal
        open={actions.isFormModalOpen}
        onOpenChange={(open) => {
          actions.setIsFormModalOpen(open);
          if (!open) {
            actions.setEditingProduct(null);
          }
        }}
        networkType={networkType}
        industryType={industryType}
        sections={sections}
        editingProduct={actions.editingProduct}
        defaultSectionId={actions.defaultSectionId}
        defaultCategoryId={actions.defaultCategoryId}
        onSuccess={actions.onMutationSuccess}
      />

      <ProductViewModal
        open={Boolean(actions.viewingProduct)}
        onOpenChange={(open) => {
          if (!open) actions.setViewingProduct(null);
        }}
        product={actions.viewingProduct}
        isUpdatingStatus={
          Boolean(actions.viewingProduct) &&
          actions.updatingStatusId === actions.viewingProduct?.id
        }
        onEdit={actions.handleOpenEditModal}
        onToggleStatus={actions.handleToggleStatus}
        onReject={(prod) => actions.setRejectingProduct(prod)}
      />

      <RejectProductModal
        product={actions.rejectingProduct}
        isSubmitting={actions.isRejecting}
        onClose={() => actions.setRejectingProduct(null)}
        onConfirm={actions.handleConfirmReject}
      />

      <DeleteProductModal
        isOpen={Boolean(actions.deletingProduct)}
        productName={actions.deletingProduct?.product_name}
        onClose={() => actions.setDeletingProduct(null)}
        onConfirm={actions.handleConfirmDelete}
      />
    </>
  );
}

