"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import { AlertCircle, ArrowUpDown } from "lucide-react";
import CategorySectionCard, { CategorySection, SubcategoryItem } from "./CategorySectionCard";
import ViewSectionDetailsModal from "./ViewSectionDetailsModal";
import CreateTabModal from "./CreateTabModal";
import CreateSectionModal from "./CreateSectionModal";
import ReorderSectionsModal from "./ReorderSectionsModal";
import {
    useCreateCategoryTabMutation,
    useDeleteCategorySectionMutation,
    useDeleteCategoryTabMutation,
    useReorderCategorySectionsMutation,
    useReorderCategoryTabsMutation,
    useToggleCategorySectionStatusMutation,
    useToggleCategoryTabStatusMutation,
    useUpdateCategoryTabMutation,
} from "@/feature/slice/admin/categories";

interface CategorySectionListProps {
    sections: CategorySection[];
    activeTab?: string;
    onEditSection?: (section: CategorySection, data: { industryType: string; sectionHeading: string }) => void;
    industryOptions?: { label: string; value: string }[];
}

export default function CategorySectionList({
    sections,
    activeTab = "all",
    onEditSection,
    industryOptions,
}: CategorySectionListProps) {
    const visibleSections =
        activeTab === "all"
            ? sections
            : activeTab === "hidden"
            ? sections.filter((section) => section.is_active === false)
            : sections.filter((section) => section.category === activeTab);

    const [selectedSectionId, setSelectedSectionId] = useState<string | number | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [tabModalOpen, setTabModalOpen] = useState(false);
    const [editingTab, setEditingTab] = useState<SubcategoryItem | string | undefined>();

    // Section Edit state
    const [editingSection, setEditingSection] = useState<CategorySection | null>(null);
    const [editSectionModalOpen, setEditSectionModalOpen] = useState(false);

    // Section Delete Confirmation state
    const [sectionToDelete, setSectionToDelete] = useState<CategorySection | null>(null);
    const [deleteSectionModalOpen, setDeleteSectionModalOpen] = useState(false);

    // Section Reordering Modal state
    const [reorderModalOpen, setReorderModalOpen] = useState(false);

    // Subcategory Delete Confirmation state
    const [tabToDelete, setTabToDelete] = useState<{
        section: CategorySection;
        subcategory: SubcategoryItem;
    } | null>(null);
    const [deleteTabModalOpen, setDeleteTabModalOpen] = useState(false);

    const [deleteSection, { isLoading: isDeletingSection }] = useDeleteCategorySectionMutation();
    const [reorderCategorySections] = useReorderCategorySectionsMutation();
    const [toggleCategorySectionStatus] = useToggleCategorySectionStatusMutation();
    const [createTab] = useCreateCategoryTabMutation();
    const [updateTab] = useUpdateCategoryTabMutation();
    const [deleteTab, { isLoading: isDeletingTab }] = useDeleteCategoryTabMutation();
    const [reorderCategoryTabs] = useReorderCategoryTabsMutation();
    const [toggleCategoryTabStatus] = useToggleCategoryTabStatusMutation();

    const selectedSection = useMemo(() => {
        return sections.find((section) => String(section.id) === String(selectedSectionId)) ?? null;
    }, [sections, selectedSectionId]);

    const openDetails = (section: CategorySection) => {
        setSelectedSectionId(section.id);
        setDetailsOpen(true);
    };

    const openCreateTab = (section?: CategorySection) => {
        if (section) setSelectedSectionId(section.id);
        setEditingTab(undefined);
        setTabModalOpen(true);
    };

    const openEditTab = (section: CategorySection, subcategory: string | SubcategoryItem) => {
        setSelectedSectionId(section.id);
        setEditingTab(subcategory);
        setTabModalOpen(true);
    };

    const handleOpenEditSection = (section: CategorySection) => {
        setEditingSection(section);
        setEditSectionModalOpen(true);
    };

    const handleSaveEditSection = (data: { industryType: string; sectionHeading: string }) => {
        if (!editingSection) return;
        onEditSection?.(editingSection, data);
    };

    // Open confirmation modal for section delete
    const handlePromptDeleteSection = (section: CategorySection) => {
        setSectionToDelete(section);
        setDeleteSectionModalOpen(true);
    };

    // Confirm section delete
    const handleConfirmDeleteSection = async () => {
        if (!sectionToDelete) return;
        try {
            const res = await deleteSection(sectionToDelete.id).unwrap();
            toast.success(res?.message || "Section deleted successfully");
            setDeleteSectionModalOpen(false);
            setSectionToDelete(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete section");
        }
    };

    // Toggle Section Active/Hidden Status
    const handleToggleActiveSection = async (section: CategorySection, isActive: boolean) => {
        try {
            const res = await toggleCategorySectionStatus({
                id: section.id,
                is_active: isActive,
            }).unwrap();
            toast.success(res?.message || `Section '${section.title}' marked as ${isActive ? "Active" : "Hidden"}`);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update section status");
            throw err;
        }
    };

    // Reorder Sections (from modal)
    const handleReorderSections = async (orderedIds: (number | string)[]) => {
        try {
            const res = await reorderCategorySections({ section_ids: orderedIds }).unwrap();
            toast.success(res?.message || "Sections reordered successfully");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to reorder sections");
            throw err;
        }
    };

    // Move single section Up/Down from card header
    const handleMoveSection = async (section: CategorySection, direction: "up" | "down") => {
        const index = visibleSections.findIndex((s) => String(s.id) === String(section.id));
        if (index === -1) return;
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= visibleSections.length) return;

        const reordered = [...visibleSections];
        const [moved] = reordered.splice(index, 1);
        reordered.splice(targetIndex, 0, moved);

        await handleReorderSections(reordered.map((s) => s.id));
    };

    // Open confirmation modal for subcategory delete
    const handlePromptDeleteTab = (section: CategorySection, subcategory: string | SubcategoryItem) => {
        const item: SubcategoryItem =
            typeof subcategory === "object"
                ? subcategory
                : { id: subcategory, name: subcategory };
        setTabToDelete({ section, subcategory: item });
        setDeleteTabModalOpen(true);
    };

    // Confirm subcategory delete
    const handleConfirmDeleteTab = async () => {
        if (!tabToDelete) return;
        try {
            const res = await deleteTab(tabToDelete.subcategory.id).unwrap();
            toast.success(res?.message || "Subcategory deleted successfully");
            setDeleteTabModalOpen(false);
            setTabToDelete(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete subcategory");
        }
    };

    const handleSaveTab = async (tabName: string) => {
        if (!selectedSectionId) return;

        try {
            if (editingTab && typeof editingTab === "object" && "id" in editingTab) {
                const res = await updateTab({
                    id: editingTab.id,
                    body: { category_name: tabName },
                }).unwrap();
                toast.success(res?.message || "Subcategory updated successfully");
            } else {
                const res = await createTab({
                    section_id: selectedSectionId,
                    category_name: tabName,
                }).unwrap();
                toast.success(res?.message || "Subcategory created successfully");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save subcategory");
        }
    };

    const handleSaveInlineTab = async (
        section: CategorySection,
        subcategory: SubcategoryItem,
        newName: string
    ) => {
        try {
            const res = await updateTab({
                id: subcategory.id,
                body: { category_name: newName },
            }).unwrap();
            toast.success(res?.message || "Subcategory updated successfully");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update subcategory");
            throw err;
        }
    };

    const handleReorderTabs = async (
        section: CategorySection,
        orderedIds: (number | string)[]
    ) => {
        try {
            await reorderCategoryTabs({ category_ids: orderedIds }).unwrap();
            toast.success("Subcategories reordered successfully");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to reorder subcategories");
            throw err;
        }
    };

    const handleToggleActiveTab = async (
        subcategory: SubcategoryItem,
        isActive: boolean
    ) => {
        try {
            await toggleCategoryTabStatus({
                id: subcategory.id,
                is_active: isActive,
            }).unwrap();
            toast.success(`Subcategory marked as ${isActive ? "Active" : "Hidden"}`);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update status");
            throw err;
        }
    };

    const handleMoveCardTab = async (
        section: CategorySection,
        index: number,
        direction: "up" | "down"
    ) => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= section.subsections.length) return;

        const subList = [...section.subsections];
        const [moved] = subList.splice(index, 1);
        subList.splice(targetIndex, 0, moved);

        const orderedIds = subList.map((item) =>
            typeof item === "object" ? item.id : item
        );
        await handleReorderTabs(section, orderedIds);
    };

    const handleQuickAddTab = async (sectionId: string | number, tabName: string) => {
        try {
            const res = await createTab({
                section_id: sectionId,
                category_name: tabName,
            }).unwrap();
            toast.success(res?.message || `Subcategory '${tabName}' created successfully`);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create subcategory");
        }
    };

    return (
        <>
            {/* Header bar with section count and Reorder button */}
            {visibleSections.length > 1 && (
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Sections ({visibleSections.length})
                    </p>
                    <button
                        type="button"
                        onClick={() => setReorderModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                        title="Open section reordering modal"
                    >
                        <ArrowUpDown className="h-3.5 w-3.5 text-buttonColor" />
                        <span>Reorder Sections</span>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleSections.map((section) => (
                    <CategorySectionCard
                        key={section.id}
                        section={section}
                        onEdit={handleOpenEditSection}
                        onDelete={handlePromptDeleteSection}
                        onToggleActiveSection={handleToggleActiveSection}
                        onCreateTab={openCreateTab}
                        onSeeMore={openDetails}
                        onEditTab={openEditTab}
                        onDeleteTab={handlePromptDeleteTab}
                        onSaveInlineTab={handleSaveInlineTab}
                        onMoveTab={handleMoveCardTab}
                        onToggleActiveTab={(sec, sub, isActive) => handleToggleActiveTab(sub, isActive)}
                    />
                ))}
            </div>

            {/* View Section Details Modal */}
            <ViewSectionDetailsModal
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                section={selectedSection}
                onAddTab={(name) => {
                    if (selectedSection) handleQuickAddTab(selectedSection.id, name);
                }}
                onEditTab={(subcategory) => {
                    if (selectedSection) openEditTab(selectedSection, subcategory);
                }}
                onDeleteTab={(subcategory) => {
                    if (selectedSection) handlePromptDeleteTab(selectedSection, subcategory);
                }}
                onSaveInlineTab={(subcategory, newName) => {
                    if (selectedSection) {
                        return handleSaveInlineTab(selectedSection, subcategory, newName);
                    }
                }}
                onReorderTabs={handleReorderTabs}
                onToggleActive={handleToggleActiveTab}
            />

            {/* Create / Edit Subcategory Modal */}
            <CreateTabModal
                open={tabModalOpen}
                onOpenChange={setTabModalOpen}
                initialValue={typeof editingTab === "object" ? editingTab.name : (editingTab || "")}
                sectionTitle={selectedSection?.title}
                onSubmit={handleSaveTab}
            />

            {/* Edit Section Modal */}
            <CreateSectionModal
                open={editSectionModalOpen}
                onOpenChange={setEditSectionModalOpen}
                industryOptions={industryOptions}
                initialValues={
                    editingSection
                        ? {
                              industryType: editingSection.category,
                              sectionHeading: editingSection.title,
                          }
                        : undefined
                }
                onSubmit={handleSaveEditSection}
            />

            {/* Delete Section Confirmation Modal */}
            <CustomModal
                open={deleteSectionModalOpen}
                onOpenChange={setDeleteSectionModalOpen}
                title="Delete Section"
                size="sm"
            >
                {sectionToDelete && (
                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-red-900">
                                    Are you sure you want to delete this section?
                                </h4>
                                <p className="mt-1 text-xs text-red-700 leading-relaxed">
                                    Section <strong>&ldquo;{sectionToDelete.title}&rdquo;</strong> and all of its{" "}
                                    <strong>{sectionToDelete.subsections.length}</strong> subcategories will be permanently deleted.
                                </p>
                                {sectionToDelete.products_count !== undefined && sectionToDelete.products_count > 0 ? (
                                    <div className="mt-2.5 rounded-lg border border-red-300 bg-white/80 p-2.5 text-xs font-semibold text-red-800">
                                        ⚠️ <strong>Cannot be deleted:</strong> {sectionToDelete.products_count} active product(s) are linked to this section. Products are never automatically deleted — please reassign or delete the products first.
                                    </div>
                                ) : (
                                    <p className="mt-2 text-xs text-gray-500">
                                        This section currently has 0 active products.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                            <CustomButton
                                type="button"
                                variant="ghost"
                                onClick={() => setDeleteSectionModalOpen(false)}
                                disabled={isDeletingSection}
                            >
                                Cancel
                            </CustomButton>
                            <CustomButton
                                type="button"
                                variant="destructive"
                                disabled={isDeletingSection || (Boolean(sectionToDelete.products_count && sectionToDelete.products_count > 0))}
                                loading={isDeletingSection}
                                loadingText="Deleting..."
                                onClick={handleConfirmDeleteSection}
                            >
                                Delete Section
                            </CustomButton>
                        </div>
                    </div>
                )}
            </CustomModal>

            {/* Delete Subcategory Confirmation Modal */}
            <CustomModal
                open={deleteTabModalOpen}
                onOpenChange={setDeleteTabModalOpen}
                title="Delete Subcategory"
                size="sm"
            >
                {tabToDelete && (
                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-red-900">
                                    Delete subcategory?
                                </h4>
                                <p className="mt-1 text-xs text-red-700 leading-relaxed">
                                    Are you sure you want to delete{" "}
                                    <strong>&ldquo;{tabToDelete.subcategory.name}&rdquo;</strong> from section{" "}
                                    <strong>&ldquo;{tabToDelete.section.title}&rdquo;</strong>?
                                </p>
                                {tabToDelete.subcategory.products_count !== undefined &&
                                tabToDelete.subcategory.products_count > 0 ? (
                                    <div className="mt-2.5 rounded-lg border border-red-300 bg-white/80 p-2.5 text-xs font-semibold text-red-800">
                                        ⚠️ <strong>Cannot be deleted:</strong> {tabToDelete.subcategory.products_count} active product(s) are linked to this subcategory. Products are protected and will never be deleted — please reassign or delete the products first.
                                    </div>
                                ) : (
                                    <p className="mt-2 text-xs text-gray-500">
                                        This subcategory currently has 0 active products.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                            <CustomButton
                                type="button"
                                variant="ghost"
                                onClick={() => setDeleteTabModalOpen(false)}
                                disabled={isDeletingTab}
                            >
                                Cancel
                            </CustomButton>
                            <CustomButton
                                type="button"
                                variant="destructive"
                                disabled={isDeletingTab || (Boolean(tabToDelete.subcategory.products_count && tabToDelete.subcategory.products_count > 0))}
                                loading={isDeletingTab}
                                loadingText="Deleting..."
                                onClick={handleConfirmDeleteTab}
                            >
                                Delete Subcategory
                            </CustomButton>
                        </div>
                    </div>
                )}
            </CustomModal>
            {/* Reorder Sections Modal */}
            <ReorderSectionsModal
                open={reorderModalOpen}
                onOpenChange={setReorderModalOpen}
                sections={sections}
                initialTab={activeTab === "psychotropics" ? "psychotropics" : "biotechnology"}
                onReorder={handleReorderSections}
                onToggleActive={handleToggleActiveSection}
            />
        </>
    );
}
