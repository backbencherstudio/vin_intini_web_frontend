"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import StatusToggle from "@/components/reusable/dashboard/StatusToggle";
import { ArrowDown, ArrowUp, Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import CategorySectionActions from "./CategorySectionActions";

export interface SubcategoryItem {
    id: number | string;
    name: string;
    is_active?: boolean;
    sort_order?: number;
    products_count?: number;
}

export interface CategorySection {
    id: string | number;
    network?: string;
    networkLabel?: string;
    category: string;
    categoryLabel: string;
    title: string;
    is_active?: boolean;
    sort_order?: number;
    subsections: (string | SubcategoryItem)[];
    hasMore?: boolean;
    products_count?: number;
    categories_count?: number;
}

interface CategorySectionCardProps {
    section: CategorySection;
    index?: number;
    totalSections?: number;
    onEdit?: (section: CategorySection) => void;
    onDelete?: (section: CategorySection) => void;
    onToggleActiveSection?: (section: CategorySection, isActive: boolean) => Promise<boolean | void> | void;
    onMoveSection?: (section: CategorySection, direction: "up" | "down") => void;
    onCreateTab?: (section: CategorySection) => void;
    onSeeMore?: (section: CategorySection) => void;
    onEditTab?: (section: CategorySection, subcategory: string | SubcategoryItem) => void;
    onDeleteTab?: (section: CategorySection, subcategory: string | SubcategoryItem) => void;
    onSaveInlineTab?: (section: CategorySection, subcategory: SubcategoryItem, newName: string) => Promise<boolean | void>;
    onMoveTab?: (section: CategorySection, index: number, direction: "up" | "down") => void;
    onToggleActiveTab?: (section: CategorySection, subcategory: SubcategoryItem, isActive: boolean) => void;
}

const networkStyles: Record<string, string> = {
    psychology: "bg-purple-50 text-purple-700 border border-purple-200/70",
    neuroscience: "bg-indigo-50 text-indigo-700 border border-indigo-200/70",
};

const badgeStyles: Record<string, string> = {
    biotechnology: "bg-teal-50 text-[#04A1B7] border border-teal-200/70",
    psychotropics: "bg-amber-50 text-amber-700 border border-amber-200/70",
};

const fallbackBadge = "bg-gray-100 text-gray-600 border border-gray-200";

export default function CategorySectionCard({
    section,
    index,
    totalSections,
    onEdit,
    onDelete,
    onToggleActiveSection,
    onMoveSection,
    onCreateTab,
    onSeeMore,
    onEditTab,
    onDeleteTab,
    onSaveInlineTab,
    onMoveTab,
    onToggleActiveTab,
}: CategorySectionCardProps) {
    const [editingSubId, setEditingSubId] = useState<string | number | null>(null);
    const [editingSubName, setEditingSubName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [statusOverrides, setStatusOverrides] = useState<Record<string, boolean>>({});
    const [sectionActiveOverride, setSectionActiveOverride] = useState<boolean | null>(null);

    useEffect(() => {
        setSectionActiveOverride(null);
    }, [section.is_active]);

    const isSectionActive = sectionActiveOverride !== null ? sectionActiveOverride : section.is_active !== false;

    const handleSectionToggle = async (isActive: boolean) => {
        setSectionActiveOverride(isActive);
        if (onToggleActiveSection) {
            try {
                await onToggleActiveSection(section, isActive);
            } catch {
                setSectionActiveOverride(null);
            }
        }
    };

    useEffect(() => {
        setStatusOverrides((prev) => {
            let changed = false;
            const next = { ...prev };
            (section.subsections || []).forEach((sub) => {
                if (typeof sub === "object") {
                    const idKey = String(sub.id);
                    if (next[idKey] !== undefined && sub.is_active === next[idKey]) {
                        delete next[idKey];
                        changed = true;
                    }
                }
            });
            return changed ? next : prev;
        });
    }, [section.subsections]);

    const handleCardToggle = async (subItem: SubcategoryItem, isActive: boolean) => {
        const idKey = String(subItem.id);
        setStatusOverrides((prev) => ({ ...prev, [idKey]: isActive }));
        if (onToggleActiveTab) {
            try {
                await onToggleActiveTab(section, subItem, isActive);
            } catch {
                setStatusOverrides((prev) => {
                    const next = { ...prev };
                    delete next[idKey];
                    return next;
                });
            }
        }
    };

    const handleStartEdit = (item: string | SubcategoryItem) => {
        const info = getSubcategoryInfo(item);
        setEditingSubId(info.id);
        setEditingSubName(info.name);
    };

    const handleCancelEdit = () => {
        setEditingSubId(null);
        setEditingSubName("");
    };

    const handleSaveInline = async (item: string | SubcategoryItem) => {
        const info = getSubcategoryInfo(item);
        const trimmed = editingSubName.trim();
        if (!trimmed) {
            toast.error("Subcategory name cannot be empty");
            return;
        }
        if (trimmed === info.name) {
            handleCancelEdit();
            return;
        }
        if (onSaveInlineTab) {
            setIsSaving(true);
            try {
                const subItem: SubcategoryItem =
                    typeof item === "object" ? item : { id: item, name: item };
                await onSaveInlineTab(section, subItem, trimmed);
                handleCancelEdit();
            } catch {
                // error notification handled by caller
            } finally {
                setIsSaving(false);
            }
        } else if (onEditTab) {
            onEditTab(section, item);
        }
    };

    const getSubcategoryInfo = (item: string | SubcategoryItem) => {
        if (typeof item === "string") {
            return {
                key: item,
                id: item,
                name: item,
                is_active: true,
                products_count: undefined,
            };
        }
        const override = statusOverrides[String(item.id)];
        return {
            key: String(item.id),
            id: item.id,
            name: item.name,
            is_active: override !== undefined ? override : item.is_active !== false,
            sort_order: item.sort_order,
            products_count: item.products_count,
        };
    };

    return (
        <article
            className={`flex min-h-[340px] flex-col rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
                !isSectionActive
                    ? "border-dashed border-gray-300 bg-gray-50/70 opacity-90"
                    : "border-gray-200 bg-white"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {/* 1. Network Badge */}
                        {section.networkLabel && (
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                    networkStyles[section.network || ""] ?? "bg-purple-50 text-purple-700 border border-purple-200/70"
                                }`}
                            >
                                {section.networkLabel}
                            </span>
                        )}

                        {/* 2. Industry Badge */}
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                badgeStyles[section.category] ?? fallbackBadge
                            }`}
                        >
                            {section.categoryLabel}
                        </span>

                        {/* 3. Products Count Badge */}
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200/60">
                            {section.products_count ?? 0} {section.products_count === 1 ? "product" : "products"}
                        </span>

                        {/* 4. Hidden indicator if inactive */}
                        {!isSectionActive && (
                            <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600 border border-rose-200">
                                Hidden
                            </span>
                        )}
                    </div>

                    <h3
                        className={`mt-2.5 text-base font-bold leading-snug line-clamp-2 transition-colors ${
                            !isSectionActive ? "text-gray-500 line-through decoration-gray-400" : "text-gray-900"
                        }`}
                        title={section.title}
                    >
                        {section.title}
                    </h3>
                </div>

                {/* Section Header Action Controls */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Active / Hidden Status Toggle */}
                    {onToggleActiveSection && (
                        <div className="scale-90 origin-right">
                            <StatusToggle
                                checked={isSectionActive}
                                activeLabel="Active"
                                inactiveLabel="Hidden"
                                ariaLabel={`Toggle ${section.title} active status`}
                                onChange={handleSectionToggle}
                            />
                        </div>
                    )}

                    <CategorySectionActions
                        section={section}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </div>

            <div className="mt-auto pt-5">
                <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Subcategories ({section.subsections.length})
                    </p>
                </div>

                {section.subsections.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center">
                        <p className="text-xs text-gray-400">No subcategories yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {section.subsections.slice(0, 3).map((item, index) => {
                            const info = getSubcategoryInfo(item);
                            const isEditing = String(editingSubId) === String(info.id);

                            if (isEditing) {
                                return (
                                    <div
                                        key={info.key}
                                        className="flex w-full items-center justify-between gap-1.5 rounded-xl border border-buttonColor/60 bg-white p-1.5 text-xs text-gray-800 shadow-sm ring-2 ring-buttonColor/15"
                                    >
                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1 rounded-md bg-gray-100 text-[11px] font-semibold text-gray-600 shrink-0">
                                                #{index + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={editingSubName}
                                                onChange={(e) => setEditingSubName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleSaveInline(item);
                                                    } else if (e.key === "Escape") {
                                                        e.preventDefault();
                                                        handleCancelEdit();
                                                    }
                                                }}
                                                autoFocus
                                                disabled={isSaving}
                                                placeholder="Subcategory name..."
                                                className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-900 focus:border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
                                            />
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                title="Save changes (Enter)"
                                                disabled={isSaving || !editingSubName.trim()}
                                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                                                onClick={() => handleSaveInline(item)}
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <Check className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                title="Cancel (Esc)"
                                                disabled={isSaving}
                                                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
                                                onClick={handleCancelEdit}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={info.key}
                                    className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-xs transition-all hover:shadow-2xs ${
                                        info.is_active === false
                                            ? "border-gray-200 bg-gray-50/70 text-gray-500 opacity-80"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0 pr-1.5 flex-1">
                                        <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1 rounded-md bg-gray-100 text-[10px] font-semibold text-gray-600 shrink-0">
                                            #{index + 1}
                                        </span>
                                        <span className="truncate font-medium text-gray-900">{info.name}</span>
                                        {info.products_count !== undefined && info.products_count > 0 && (
                                            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.2 text-[10px] font-medium text-blue-700 border border-blue-100">
                                                {info.products_count} {info.products_count === 1 ? "product" : "products"}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {onToggleActiveTab && (
                                            <div className="scale-90 origin-right">
                                                <StatusToggle
                                                    checked={info.is_active !== false}
                                                    activeLabel="Active"
                                                    inactiveLabel="Hidden"
                                                    ariaLabel={`Toggle ${info.name} active status`}
                                                    onChange={(isActive) => {
                                                        const subItem: SubcategoryItem =
                                                            typeof item === "object"
                                                                ? item
                                                                : { id: item, name: item, is_active: info.is_active };
                                                        handleCardToggle(subItem, isActive);
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-0.5 border-l border-gray-200 pl-1.5">
                                            {onMoveTab && (
                                                <>
                                                    <button
                                                        type="button"
                                                        disabled={index === 0}
                                                        title="Move up"
                                                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                        onClick={() => onMoveTab(section, index, "up")}
                                                    >
                                                        <ArrowUp className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={index === section.subsections.length - 1}
                                                        title="Move down"
                                                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                        onClick={() => onMoveTab(section, index, "down")}
                                                    >
                                                        <ArrowDown className="h-3 w-3" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                title={`Edit ${info.name}`}
                                                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                                                onClick={() => {
                                                    if (onSaveInlineTab) {
                                                        handleStartEdit(item);
                                                    } else {
                                                        onEditTab?.(section, item);
                                                    }
                                                }}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </button>
                                            <button
                                                type="button"
                                                title={`Remove ${info.name}`}
                                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                                onClick={() => onDeleteTab?.(section, item)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {section.subsections.length > 3 && (
                    <button
                        type="button"
                        className="mt-2.5 inline-flex items-center text-xs font-semibold text-[#04A1B7] hover:underline cursor-pointer"
                        onClick={() => onSeeMore?.(section)}
                    >
                        See More (+{section.subsections.length - 3})
                    </button>
                )}

                <CustomButton
                    variant="outline"
                    fullWidth
                    className="mt-4 border-gray-200 text-gray-700 hover:bg-teal-50/50 hover:text-[#04A1B7] hover:border-teal-200 text-xs font-semibold cursor-pointer"
                    onClick={() => onCreateTab?.(section)}
                >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Subcategory
                </CustomButton>
            </div>
        </article>
    );
}
