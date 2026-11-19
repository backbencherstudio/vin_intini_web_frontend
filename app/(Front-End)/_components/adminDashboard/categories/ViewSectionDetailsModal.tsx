"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import StatusToggle from "@/components/reusable/dashboard/StatusToggle";
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
import type { CategorySection, SubcategoryItem } from "./CategorySectionCard";

interface ViewSectionDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    section: CategorySection | null;
    onAddTab?: (tabName: string) => void;
    onEditTab?: (subcategory: string | SubcategoryItem) => void;
    onDeleteTab?: (subcategory: string | SubcategoryItem) => void;
    onSaveInlineTab?: (subcategory: SubcategoryItem, newName: string) => Promise<boolean | void>;
    onReorderTabs?: (section: CategorySection, orderedIds: (number | string)[]) => Promise<boolean | void>;
    onToggleActive?: (subcategory: SubcategoryItem, isActive: boolean) => Promise<boolean | void>;
}

const badgeStyles: Record<string, string> = {
    biotechnology: "bg-teal-50 text-[#04A1B7] border border-teal-200/70",
    psychotropics: "bg-amber-50 text-amber-700 border border-amber-200/70",
};

const fallbackBadge = "bg-gray-100 text-gray-600 border border-gray-200";

interface SortableSubcategoryRowProps {
    item: SubcategoryItem;
    index: number;
    total: number;
    isReordering: boolean;
    onMove: (index: number, direction: "up" | "down") => void;
    onRename: (subItem: SubcategoryItem, newName: string) => Promise<boolean | void>;
    onToggleActive: (subItem: SubcategoryItem, isActive: boolean) => void;
    onRequestDelete: (subItem: SubcategoryItem) => void;
}

function SortableSubcategoryRow({
    item,
    index,
    total,
    isReordering,
    onMove,
    onRename,
    onToggleActive,
    onRequestDelete,
}: SortableSubcategoryRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(item.name);
    const [isSavingRename, setIsSavingRename] = useState(false);

    useEffect(() => {
        setDraftName(item.name);
    }, [item.name]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleSave = async () => {
        const trimmed = draftName.trim();
        if (!trimmed) {
            toast.error("Subcategory name cannot be empty.");
            return;
        }
        if (trimmed === item.name) {
            setIsEditing(false);
            return;
        }
        setIsSavingRename(true);
        try {
            await onRename(item, trimmed);
            setIsEditing(false);
        } catch {
            // caller handles notification
        } finally {
            setIsSavingRename(false);
        }
    };

    const assignedCount = item.products_count ?? 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3 sm:px-4 bg-white transition-shadow ${
                isDragging ? "shadow-lg border-[#04A1B7] z-10" : "border-gray-200 hover:border-gray-300"
            }`}
        >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    aria-label={`Drag to reorder ${item.name}`}
                    className="p-1.5 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing shrink-0 touch-none"
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-gray-100 text-xs font-semibold text-gray-600 shrink-0">
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
                                    void handleSave();
                                } else if (e.key === "Escape") {
                                    setDraftName(item.name);
                                    setIsEditing(false);
                                }
                            }}
                            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#04A1B7]/30"
                            autoFocus
                        />
                        <button
                            type="button"
                            disabled={isSavingRename}
                            onClick={() => void handleSave()}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer shrink-0 transition-colors"
                            title="Save name (Enter)"
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
                                setDraftName(item.name);
                                setIsEditing(false);
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer shrink-0 transition-colors"
                            title="Cancel (Esc)"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <span className="font-medium text-sm text-gray-900 truncate">
                            {item.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {assignedCount} {assignedCount === 1 ? "product" : "products"}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 shrink-0">
                <div className="min-w-[94px]">
                    <StatusToggle
                        checked={item.is_active !== false}
                        activeLabel="Active"
                        inactiveLabel="Hidden"
                        ariaLabel={`Toggle ${item.name} active status`}
                        onChange={(isActive) => onToggleActive(item, isActive)}
                    />
                </div>

                <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                    <button
                        type="button"
                        disabled={index === 0 || isReordering}
                        onClick={() => onMove(index, "up")}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Move up"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        disabled={index === total - 1 || isReordering}
                        onClick={() => onMove(index, "down")}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Move down"
                    >
                        <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setDraftName(item.name);
                            setIsEditing(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 cursor-pointer transition-colors"
                        title="Rename subcategory"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onRequestDelete(item)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
                        title="Delete subcategory"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ViewSectionDetailsModal({
    open,
    onOpenChange,
    section,
    onAddTab,
    onDeleteTab,
    onSaveInlineTab,
    onReorderTabs,
    onToggleActive,
}: ViewSectionDetailsModalProps) {
    const [quickAddInput, setQuickAddInput] = useState("");
    const [items, setItems] = useState<SubcategoryItem[]>([]);
    const [isReordering, setIsReordering] = useState(false);
    const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

    // Track optimistic pending active overrides so server refetch doesn't revert local status
    const pendingStatusRef = useRef<Record<string, boolean>>({});
    const prevSectionIdRef = useRef<string | number | null>(null);

    const parseSubsections = (rawList: (string | SubcategoryItem)[]): SubcategoryItem[] => {
        return (rawList || []).map((sub, idx) => {
            if (typeof sub === "object") {
                return {
                    ...sub,
                    is_active: sub.is_active !== undefined ? sub.is_active : true,
                    sort_order: sub.sort_order ?? idx + 1,
                };
            }
            return {
                id: sub,
                name: String(sub),
                is_active: true,
                sort_order: idx + 1,
            };
        });
    };

    useEffect(() => {
        if (!open || !section) {
            if (!open) {
                prevSectionIdRef.current = null;
                pendingStatusRef.current = {};
            }
            return;
        }

        const isNewSection = prevSectionIdRef.current !== section.id;
        prevSectionIdRef.current = section.id;

        const incoming = parseSubsections(section.subsections);

        if (isNewSection) {
            pendingStatusRef.current = {};
            setItems(incoming);
            return;
        }

        // Section modal is already open:
        // Update items without flipping active state back during background queries
        setItems((currentItems) => {
            const currentIds = new Set(currentItems.map((it) => String(it.id)));
            const hasStructuralChange =
                currentItems.length !== incoming.length ||
                incoming.some((it) => !currentIds.has(String(it.id)));

            if (hasStructuralChange) {
                return incoming.map((inc) => {
                    const pending = pendingStatusRef.current[String(inc.id)];
                    return {
                        ...inc,
                        is_active: pending !== undefined ? pending : inc.is_active,
                    };
                });
            }

            // Clean up resolved pending overrides when incoming matches target
            incoming.forEach((inc) => {
                const idKey = String(inc.id);
                if (
                    pendingStatusRef.current[idKey] !== undefined &&
                    inc.is_active === pendingStatusRef.current[idKey]
                ) {
                    delete pendingStatusRef.current[idKey];
                }
            });

            // Keep user's drag order & pending status; update background counters if changed
            return currentItems.map((curr) => {
                const serverMatch = incoming.find((inc) => String(inc.id) === String(curr.id));
                const pending = pendingStatusRef.current[String(curr.id)];
                return {
                    ...curr,
                    products_count: serverMatch?.products_count ?? curr.products_count,
                    is_active: pending !== undefined ? pending : (serverMatch?.is_active ?? curr.is_active),
                };
            });
        });
    }, [section, open]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleQuickAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickAddInput.trim()) return;
        onAddTab?.(quickAddInput.trim());
        setQuickAddInput("");
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((it) => String(it.id) === String(active.id));
        const newIndex = items.findIndex((it) => String(it.id) === String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;

        const next = arrayMove(items, oldIndex, newIndex);
        setItems(next);

        if (onReorderTabs) {
            setIsReordering(true);
            try {
                await onReorderTabs(section, next.map((it) => it.id));
            } finally {
                setIsReordering(false);
            }
        }
    };

    const handleMove = async (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const next = arrayMove(items, index, targetIndex);
        setItems(next);

        if (onReorderTabs) {
            setIsReordering(true);
            try {
                await onReorderTabs(section, next.map((it) => it.id));
            } finally {
                setIsReordering(false);
            }
        }
    };

    const handleToggleActive = async (subItem: SubcategoryItem, isActive: boolean) => {
        const idKey = String(subItem.id);
        if (togglingIds.has(idKey)) return;

        // 1. Immediately record optimistic override
        pendingStatusRef.current[idKey] = isActive;

        // 2. Immediately update local items for smooth UI response
        setItems((prev) =>
            prev.map((it) => (String(it.id) === idKey ? { ...it, is_active: isActive } : it))
        );

        setTogglingIds((prev) => new Set(prev).add(idKey));

        if (onToggleActive) {
            try {
                await onToggleActive(subItem, isActive);
            } catch (err) {
                // Revert optimistic update on failure
                delete pendingStatusRef.current[idKey];
                setItems((prev) =>
                    prev.map((it) => (String(it.id) === idKey ? { ...it, is_active: !isActive } : it))
                );
            } finally {
                setTogglingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(idKey);
                    return next;
                });
            }
        } else {
            setTogglingIds((prev) => {
                const next = new Set(prev);
                next.delete(idKey);
                return next;
            });
        }
    };

    if (!section) return null;

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title="Section Subcategories"
            size="xl"
        >
            <div className="flex w-full flex-col gap-4 pt-1">
                {/* Section Header Summary */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {section.networkLabel && (
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    section.network === "neuroscience"
                                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200/70"
                                        : "bg-purple-50 text-purple-700 border border-purple-200/70"
                                }`}
                            >
                                {section.networkLabel}
                            </span>
                        )}
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[section.category] ?? fallbackBadge}`}
                        >
                            {section.categoryLabel}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200/60">
                            {section.products_count ?? 0} {section.products_count === 1 ? "product" : "products"}
                        </span>
                    </div>
                    <h3 className="mt-2.5 text-base font-bold text-gray-900 leading-snug">
                        {section.title}
                    </h3>
                </div>

                {/* Inline Quick Add Subcategory */}
                <form onSubmit={handleQuickAdd} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Add a new subcategory name..."
                        value={quickAddInput}
                        onChange={(e) => setQuickAddInput(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-[#04A1B7] focus:outline-none focus:ring-1 focus:ring-[#04A1B7]"
                    />
                    <CustomButton
                        type="submit"
                        disabled={!quickAddInput.trim()}
                        className="!text-xs !py-2 shrink-0 cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Subcategory
                    </CustomButton>
                </form>

                {/* Sortable Subcategories List */}
                <div>
                    <div className="flex items-center justify-between mb-2.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            All Subcategories ({items.length})
                        </p>
                        <p className="text-xs text-gray-400">
                            Drag or use ↑ / ↓ arrows to reorder
                        </p>
                    </div>

                    {items.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                            <p className="text-xs text-gray-400">
                                No subcategories added to this section yet.
                            </p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={items.map((it) => it.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="max-h-[420px] overflow-y-auto space-y-2.5 pr-1">
                                    {items.map((item, index) => (
                                        <SortableSubcategoryRow
                                            key={item.id}
                                            item={item}
                                            index={index}
                                            total={items.length}
                                            isReordering={isReordering}
                                            onMove={handleMove}
                                            onRename={async (subItem, newName) => {
                                                if (onSaveInlineTab) {
                                                    await onSaveInlineTab(subItem, newName);
                                                }
                                            }}
                                            onToggleActive={handleToggleActive}
                                            onRequestDelete={(subItem) => {
                                                onDeleteTab?.(subItem);
                                            }}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-100">
                    <CustomButton
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </CustomButton>
                </div>
            </div>
        </CustomModal>
    );
}
