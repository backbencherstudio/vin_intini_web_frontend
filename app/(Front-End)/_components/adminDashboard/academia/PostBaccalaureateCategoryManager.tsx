"use client";

import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import StatusToggle from "@/components/reusable/dashboard/StatusToggle";
import {
  useCreatePostBaccalaureateCategoryMutation,
  useDeletePostBaccalaureateCategoryMutation,
  useGetPostBaccalaureateCategoriesQuery,
  useReorderPostBaccalaureateCategoriesMutation,
  useUpdatePostBaccalaureateCategoryMutation,
} from "@/feature/slice/admin/academia/PostBaccalaureateSlice";
import { PostBaccalaureateCategoryType } from "@/lib/type";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  Check,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface SortableCategoryRowProps {
  category: PostBaccalaureateCategoryType;
  index: number;
  total: number;
  isReordering: boolean;
  isToggling: boolean;
  onMove: (index: number, direction: "up" | "down") => void;
  onRename: (id: number, name: string) => Promise<boolean>;
  onToggleActive: (
    category: PostBaccalaureateCategoryType,
    isActive: boolean,
  ) => void;
  onRequestDelete: (category: PostBaccalaureateCategoryType) => void;
}

function SortableCategoryRow({
  category,
  index,
  total,
  isReordering,
  isToggling,
  onMove,
  onRename,
  onToggleActive,
  onRequestDelete,
}: SortableCategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(category.name);
  const [isSavingRename, setIsSavingRename] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveRename = async () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      toast.error("Category name cannot be empty.");
      return;
    }
    if (trimmed === category.name) {
      setIsEditing(false);
      return;
    }

    setIsSavingRename(true);
    const ok = await onRename(category.id, trimmed);
    setIsSavingRename(false);
    if (ok) {
      setIsEditing(false);
    }
  };

  const assignedCount = category.programs_count ?? 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3 sm:px-4 bg-white transition-shadow ${
        isDragging ? "shadow-lg border-buttonColor z-10" : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${category.name}`}
          className="p-1.5 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing shrink-0 touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-gray-100 text-xs font-medium text-gray-600 shrink-0">
          #{index + 1}
        </span>

        {isEditing ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSaveRename();
                } else if (e.key === "Escape") {
                  setDraftName(category.name);
                  setIsEditing(false);
                }
              }}
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-buttonColor/30"
              autoFocus
            />
            <button
              type="button"
              disabled={isSavingRename}
              onClick={() => void handleSaveRename()}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer shrink-0"
              title="Save name"
            >
              {isSavingRename ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftName(category.name);
                setIsEditing(false);
              }}
              className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer shrink-0"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="font-medium text-sm text-gray-900 truncate">
              {category.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {assignedCount} {assignedCount === 1 ? "program" : "programs"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 shrink-0">
        <div className="min-w-[94px]">
          <StatusToggle
            checked={Boolean(category.is_active)}
            activeLabel="Active"
            inactiveLabel="Hidden"
            disabled={isToggling}
            ariaLabel={`Toggle ${category.name} active status`}
            onChange={(isActive) => onToggleActive(category, isActive)}
          />
        </div>

        <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
          <button
            type="button"
            disabled={index === 0 || isReordering}
            onClick={() => onMove(index, "up")}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
            title="Move up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={index === total - 1 || isReordering}
            onClick={() => onMove(index, "down")}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
            title="Move down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftName(category.name);
              setIsEditing(true);
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
            title="Rename category"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRequestDelete(category)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PostBaccalaureateCategoryManager() {
  const { data, isLoading, refetch } = useGetPostBaccalaureateCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreatePostBaccalaureateCategoryMutation();
  const [updateCategory] = useUpdatePostBaccalaureateCategoryMutation();
  const [reorderCategories, { isLoading: isReordering }] =
    useReorderPostBaccalaureateCategoriesMutation();
  const [deleteCategory] = useDeletePostBaccalaureateCategoryMutation();

  const [optimisticCategories, setOptimisticCategories] = useState<
    PostBaccalaureateCategoryType[] | null
  >(null);
  const [newName, setNewName] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<PostBaccalaureateCategoryType | null>(null);

  const orderedCategories = optimisticCategories ?? data?.data ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const persistOrder = async (nextList: PostBaccalaureateCategoryType[]) => {
    setOptimisticCategories(nextList);
    try {
      await reorderCategories({
        category_ids: nextList.map((item) => item.id),
      }).unwrap();
      await refetch();
      setOptimisticCategories(null);
      toast.success("Category order updated.");
    } catch {
      setOptimisticCategories(null);
      toast.error("Failed to save category order.");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedCategories.findIndex(
      (item) => item.id === Number(active.id),
    );
    const newIndex = orderedCategories.findIndex(
      (item) => item.id === Number(over.id),
    );

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const next = arrayMove(orderedCategories, oldIndex, newIndex);
    void persistOrder(next);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedCategories.length) {
      return;
    }
    const next = arrayMove(orderedCategories, index, targetIndex);
    void persistOrder(next);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      await createCategory({ name: trimmed, is_active: true }).unwrap();
      setNewName("");
      toast.success(`Added category "${trimmed}".`);
    } catch (error: unknown) {
      const err = error as {
        data?: { message?: string; errors?: Record<string, string[]> };
      };
      const firstError = err?.data?.errors
        ? Object.values(err.data.errors).flat()[0]
        : null;
      toast.error(firstError || err?.data?.message || "Failed to add category.");
    }
  };

  const handleRename = async (id: number, name: string): Promise<boolean> => {
    try {
      await updateCategory({ id, name }).unwrap();
      toast.success("Category renamed.");
      return true;
    } catch (error: unknown) {
      const err = error as {
        data?: { message?: string; errors?: Record<string, string[]> };
      };
      const firstError = err?.data?.errors
        ? Object.values(err.data.errors).flat()[0]
        : null;
      toast.error(firstError || err?.data?.message || "Failed to rename category.");
      return false;
    }
  };

  const handleToggleActive = async (
    category: PostBaccalaureateCategoryType,
    isActive: boolean,
  ) => {
    setTogglingId(category.id);
    try {
      await updateCategory({
        id: category.id,
        is_active: isActive,
      }).unwrap();
      toast.success(
        `${category.name} is now ${isActive ? "active" : "hidden"}.`,
      );
    } catch {
      toast.error("Failed to update category status.");
    } finally {
      setTogglingId((prev) => (prev === category.id ? null : prev));
    }
  };

  const handleRequestDelete = (category: PostBaccalaureateCategoryType) => {
    const assigned = category.programs_count ?? 0;
    if (assigned > 0) {
      toast.error(
        `Cannot delete "${category.name}" while ${assigned} program(s) use it. Unassign them or toggle it hidden.`,
      );
      return;
    }
    setDeleteTarget(category);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    try {
      await deleteCategory(deleteTarget.id).unwrap();
      toast.success(`Deleted "${deleteTarget.name}".`);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete category.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Post-Baccalaureate Filter Categories
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Add, rename, toggle visibility, or drag/reorder categories. Active categories appear in this exact order in the public Filter Degree dropdown.
          </p>
        </div>

        <form
          onSubmit={handleAddCategory}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add new category (e.g. MSBS, Pre-Dental Bridge)"
            className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-buttonColor/30"
          />
          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primaryColor text-white text-sm font-medium hover:opacity-95 disabled:opacity-60 cursor-pointer shrink-0"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Loading categories...
        </div>
      ) : orderedCategories.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No categories found. Add your first category above.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedCategories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2.5">
              {orderedCategories.map((category, index) => (
                <SortableCategoryRow
                  key={category.id}
                  category={category}
                  index={index}
                  total={orderedCategories.length}
                  isReordering={isReordering}
                  isToggling={togglingId === category.id}
                  onMove={handleMove}
                  onRename={handleRename}
                  onToggleActive={handleToggleActive}
                  onRequestDelete={handleRequestDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <CustomDeletModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name || ""}"?`}
      />
    </div>
  );
}
