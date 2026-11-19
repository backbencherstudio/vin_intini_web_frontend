"use client";

import { useEffect, useMemo, useState } from "react";
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
import type { CategorySection } from "./CategorySectionCard";

interface ReorderSectionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sections: CategorySection[];
    initialTab?: "biotechnology" | "psychotropics" | string;
    onReorder: (orderedIds: (number | string)[]) => Promise<boolean | void>;
    onToggleActive?: (section: CategorySection, isActive: boolean) => Promise<boolean | void>;
}

const badgeStyles: Record<string, string> = {
    biotechnology: "bg-teal-50 text-[#04A1B7] border border-teal-200/70",
    psychotropics: "bg-amber-50 text-amber-700 border border-amber-200/70",
};

interface SortableSectionRowProps {
    section: CategorySection;
    index: number;
    total: number;
    isReordering: boolean;
    onMove: (index: number, direction: "up" | "down") => void;
    onToggleActive?: (section: CategorySection, isActive: boolean) => void;
}

function SortableSectionRow({
    section,
    index,
    total,
    isReordering,
    onMove,
    onToggleActive,
}: SortableSectionRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: transform
            ? `translate3d(0px, ${transform.y}px, 0px)`
            : undefined,
        transition,
    };

    const isActive = section.is_active !== false;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex w-full items-center justify-between gap-2.5 rounded-xl border p-2.5 text-xs transition-colors ${
                isDragging
                    ? "opacity-60 bg-blue-50/70 border-buttonColor/60 shadow-lg z-30"
                    : isActive
                    ? "border-gray-200 bg-white hover:border-gray-300 shadow-2xs"
                    : "border-dashed border-gray-200 bg-gray-50/70 text-gray-400 opacity-80"
            }`}
        >
            <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Drag Handle */}
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    disabled={isReordering}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing touch-none select-none disabled:opacity-50 shrink-0"
                    title="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                {/* Rank Badge */}
                <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-gray-100 text-[11px] font-bold text-gray-700 border border-gray-200 shrink-0">
                    #{index + 1}
                </span>

                {/* Section Title & Badges */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                        className={`truncate font-semibold text-sm ${
                            isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                        title={section.title}
                    >
                        {section.title}
                    </span>

                    <span
                        className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                            badgeStyles[section.category] ?? "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {section.categoryLabel}
                    </span>

                    <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200/60 shrink-0">
                        {section.products_count ?? 0} {section.products_count === 1 ? "product" : "products"}
                    </span>
                </div>
            </div>

            {/* Controls: Active Toggle & Move Arrows */}
            <div className="flex items-center gap-2 shrink-0">
                {onToggleActive && (
                    <div className="scale-90 origin-right">
                        <StatusToggle
                            checked={isActive}
                            activeLabel="Active"
                            inactiveLabel="Hidden"
                            ariaLabel={`Toggle ${section.title} active status`}
                            onChange={(checked) => onToggleActive(section, checked)}
                        />
                    </div>
                )}

                <div className="flex items-center gap-0.5 border-l border-gray-200 pl-1.5">
                    <button
                        type="button"
                        disabled={index === 0 || isReordering}
                        title="Move up"
                        className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                        onClick={() => onMove(index, "up")}
                    >
                        <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        disabled={index === total - 1 || isReordering}
                        title="Move down"
                        className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                        onClick={() => onMove(index, "down")}
                    >
                        <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ReorderSectionsModal({
    open,
    onOpenChange,
    sections,
    initialTab = "biotechnology",
    onReorder,
    onToggleActive,
}: ReorderSectionsModalProps) {
    const [selectedTab, setSelectedTab] = useState<"biotechnology" | "psychotropics">(
        initialTab === "psychotropics" ? "psychotropics" : "biotechnology"
    );
    const [localSections, setLocalSections] = useState<CategorySection[]>([]);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedTab(initialTab === "psychotropics" ? "psychotropics" : "biotechnology");
        }
    }, [open, initialTab]);

    const biotechSections = useMemo(
        () => sections.filter((s) => s.category === "biotechnology"),
        [sections]
    );

    const psychotropicsSections = useMemo(
        () => sections.filter((s) => s.category === "psychotropics"),
        [sections]
    );

    const currentTabSections = useMemo(
        () => (selectedTab === "biotechnology" ? biotechSections : psychotropicsSections),
        [selectedTab, biotechSections, psychotropicsSections]
    );

    useEffect(() => {
        if (!open) return;
        setLocalSections(currentTabSections);
    }, [open, currentTabSections]);

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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = localSections.findIndex((s) => s.id === active.id);
        const newIndex = localSections.findIndex((s) => s.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(localSections, oldIndex, newIndex);
        setLocalSections(reordered);

        setIsReordering(true);
        try {
            await onReorder(reordered.map((s) => s.id));
        } catch {
            setLocalSections(currentTabSections);
        } finally {
            setIsReordering(false);
        }
    };

    const handleMove = async (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= localSections.length) return;

        const reordered = arrayMove(localSections, index, targetIndex);
        setLocalSections(reordered);

        setIsReordering(true);
        try {
            await onReorder(reordered.map((s) => s.id));
        } catch {
            setLocalSections(currentTabSections);
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title="Reorder Industry Sections"
            size="lg"
        >
            <div className="flex flex-col flex-1 min-h-0 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">
                        Drag items or use the arrows to set section display order on the public frontend.
                    </p>

                    <div className="flex items-center gap-2">
                        {/* 2 Filter Buttons: Biotechnology & Psychotropics */}
                        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50/80 p-0.5">
                            <button
                                type="button"
                                onClick={() => setSelectedTab("biotechnology")}
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                                    selectedTab === "biotechnology"
                                        ? "bg-[#04A1B7] text-white shadow-xs"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                                }`}
                            >
                                <span>Biotechnology</span>
                                <span
                                    className={`inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-bold ${
                                        selectedTab === "biotechnology"
                                            ? "bg-white/25 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    {biotechSections.length}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedTab("psychotropics")}
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                                    selectedTab === "psychotropics"
                                        ? "bg-amber-600 text-white shadow-xs"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                                }`}
                            >
                                <span>Psychotropics</span>
                                <span
                                    className={`inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full text-[10px] font-bold ${
                                        selectedTab === "psychotropics"
                                            ? "bg-white/25 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    {psychotropicsSections.length}
                                </span>
                            </button>
                        </div>

                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full shrink-0">
                            {localSections.length} {localSections.length === 1 ? "Section" : "Sections"}
                        </span>
                    </div>
                </div>

                {/* Section List */}
                <div className="flex-1 max-h-[60vh] overflow-y-auto py-3 space-y-2 min-h-0 pr-1">
                    {localSections.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-400">
                            No {selectedTab === "biotechnology" ? "Biotechnology" : "Psychotropics"} sections found to reorder.
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={localSections.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {localSections.map((sec, idx) => (
                                        <SortableSectionRow
                                            key={sec.id}
                                            section={sec}
                                            index={idx}
                                            total={localSections.length}
                                            isReordering={isReordering}
                                            onMove={handleMove}
                                            onToggleActive={onToggleActive}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        {isReordering ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-buttonColor" />
                                Saving order...
                            </>
                        ) : (
                            <>
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                Order auto-saved to public frontend
                            </>
                        )}
                    </span>
                    <CustomButton
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </CustomButton>
                </div>
            </div>
        </CustomModal>
    );
}
