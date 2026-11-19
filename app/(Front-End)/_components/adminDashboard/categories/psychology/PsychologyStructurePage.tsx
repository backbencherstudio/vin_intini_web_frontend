"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import FilterTabs from "@/components/reusable/dashboard/FilterTabs";
import Loading from "@/components/reusable/Loader";
import AdminPagination from "@/components/reusable/dashboard/AdminPagination";
import {
    Search,
    X,
    RotateCcw,
    Layers,
    FlaskConical,
    Pill,
    Tags,
    EyeOff,
} from "lucide-react";
import { CategorySection } from "../CategorySectionCard";
import CategoryAddSectionAction from "../CategoryAddSectionAction";
import CategorySectionList from "../CategorySectionList";
import {
    useCreatePsychologySectionMutation,
    useGetPsychologySectionsQuery,
    useUpdatePsychologySectionMutation,
} from "@/feature/slice/admin/categories";

interface PsychologyStructurePageProps {
    activeTab?: string;
}

const industryOptions = [
    { label: "Biotechnology", value: "biotechnology" },
    { label: "Psychotropics", value: "psychotropics" },
];

export default function PsychologyStructurePage({
    activeTab = "all",
}: PsychologyStructurePageProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
            setPage(1);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Reset pagination when active tab changes
    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    const typeFilter = activeTab === "all" ? "" : activeTab;
    const { data, isLoading, isFetching, isError } = useGetPsychologySectionsQuery({
        query: {
            type: typeFilter,
            search: debouncedSearch || undefined,
            per_page: pageSize,
            page,
        },
    });

    const [createPsychologySection] = useCreatePsychologySectionMutation();
    const [updatePsychologySection] = useUpdatePsychologySectionMutation();

    const summary = data?.summary || data?.data?.summary || {
        total_sections: 0,
        biotechnology_sections: 0,
        psychotropics_sections: 0,
        total_subcategories: 0,
    };

    const pagination = data?.data?.pagination;
    const totalSections = pagination?.total ?? 0;
    const totalPages = pagination?.last_page ?? 1;

    const handleCreateSection = async (formData: {
        industryType: string;
        sectionHeading: string;
    }) => {
        try {
            await createPsychologySection({
                industry_type: formData.industryType,
                name: formData.sectionHeading,
            }).unwrap();
            toast.success("Psychology section created successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create section");
        }
    };

    const handleUpdateSection = async (
        section: CategorySection,
        formData: { industryType: string; sectionHeading: string }
    ) => {
        try {
            await updatePsychologySection({
                id: section.id,
                body: {
                    industry_type: formData.industryType,
                    name: formData.sectionHeading,
                },
            }).unwrap();
            toast.success("Psychology section updated successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update section");
        }
    };

    const sections: CategorySection[] = useMemo(() => {
        return (data?.data?.sections || []).map((sec) => ({
            id: sec.id,
            network: "psychology",
            networkLabel: "Psychology Network",
            category: sec.industry_type,
            categoryLabel:
                sec.industry_type === "biotechnology"
                    ? "Biotechnology"
                    : sec.industry_type === "psychotropics"
                    ? "Psychotropics"
                    : sec.industry_type,
            title: sec.name,
            is_active: sec.is_active,
            sort_order: sec.sort_order,
            products_count: sec.products_count,
            categories_count: sec.categories_count,
            subsections: (sec.categories || []).map((c) => ({
                id: c.id,
                name: c.category_name,
                is_active: c.is_active,
                sort_order: c.sort_order,
                products_count: c.products_count,
            })),
            hasMore: (sec.categories || []).length > 3,
        }));
    }, [data?.data?.sections]);

    const hasActiveFilters = Boolean(
        searchInput.trim() || (activeTab && activeTab !== "all")
    );

    const handleResetFilters = () => {
        setSearchInput("");
        setDebouncedSearch("");
        router.push(pathname);
        setPage(1);
    };

    const tabs = [
        { id: "all", label: "All" },
        { id: "biotechnology", label: "Biotechnology" },
        { id: "psychotropics", label: "Psychotropics" },
    ];

    return (
        <section className="space-y-6">
            {/* Page Header */}
            <div className="pb-5 border-b border-[#E0E0E0]">
                <CustomTitleDescription
                    title="Psychology Network Structure"
                    description="Manage your psychology industry sections, subcategories, and linked products."
                    action={
                        <CategoryAddSectionAction
                            network="psychology"
                            networkLabel="Psychology Network"
                            activeTab={activeTab}
                            industryOptions={industryOptions}
                            onSubmit={handleCreateSection}
                        />
                    }
                />
            </div>

            {/* 5 Summary KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {/* Total Sections */}
                <div
                    onClick={() => router.push(pathname)}
                    className={`cursor-pointer rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
                        activeTab === "all"
                            ? "border-[#04A1B7] bg-teal-50/30 ring-2 ring-[#04A1B7]/25"
                            : "border-gray-200 bg-white"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Total Sections
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {isLoading ? (
                                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-200" />
                                ) : (
                                    summary.total_sections.toLocaleString()
                                )}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">Psychology Network</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#04A1B7]">
                            <Layers className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Biotechnology Sections */}
                <div
                    onClick={() => router.push(`${pathname}?tab=biotechnology`)}
                    className={`cursor-pointer rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
                        activeTab === "biotechnology"
                            ? "border-teal-400 bg-teal-50/40 ring-2 ring-teal-300"
                            : "border-gray-200 bg-white"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Biotechnology
                            </p>
                            <p className="mt-2 text-2xl font-bold text-[#04A1B7]">
                                {isLoading ? (
                                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-200" />
                                ) : (
                                    summary.biotechnology_sections.toLocaleString()
                                )}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">Sections</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#04A1B7]">
                            <FlaskConical className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Psychotropics Sections */}
                <div
                    onClick={() => router.push(`${pathname}?tab=psychotropics`)}
                    className={`cursor-pointer rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
                        activeTab === "psychotropics"
                            ? "border-amber-400 bg-amber-50/40 ring-2 ring-amber-300"
                            : "border-gray-200 bg-white"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Psychotropics
                            </p>
                            <p className="mt-2 text-2xl font-bold text-amber-600">
                                {isLoading ? (
                                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-200" />
                                ) : (
                                    summary.psychotropics_sections.toLocaleString()
                                )}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">Sections</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Pill className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Hidden or Inactive Section */}
                <div
                    onClick={() => router.push(activeTab === "hidden" ? pathname : `${pathname}?tab=hidden`)}
                    className={`cursor-pointer rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
                        activeTab === "hidden"
                            ? "border-rose-400 bg-rose-50/40 ring-2 ring-rose-300"
                            : "border-gray-200 bg-white"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Inactive Sections
                            </p>
                            <p className="mt-2 text-2xl font-bold text-rose-600">
                                {isLoading ? (
                                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-200" />
                                ) : (
                                    (summary.inactive_sections ?? sections.filter((s) => s.is_active === false).length).toLocaleString()
                                )}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">Hidden or Inactive sections</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                            <EyeOff className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Total Subcategories */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Total Subcategories
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {isLoading ? (
                                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-200" />
                                ) : (
                                    summary.total_subcategories.toLocaleString()
                                )}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">Categories across all sections</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Tags className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search Input */}
                    <div className="relative min-w-[280px] flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by section or subcategory name..."
                            className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-9 text-xs text-gray-800 placeholder-gray-400 transition-colors focus:border-[#04A1B7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#04A1B7]"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput("");
                                    setDebouncedSearch("");
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <FilterTabs tabs={tabs} paramKey="tab" className="my-0" />

                    {/* Permanent Reset Button */}
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        disabled={!hasActiveFilters}
                        title={hasActiveFilters ? "Reset all filters and search" : "No filters active"}
                        className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all shrink-0 ${
                            hasActiveFilters
                                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-2xs cursor-pointer"
                                : "border-gray-200 bg-gray-50 text-gray-400 opacity-60 cursor-not-allowed"
                        }`}
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="py-16">
                    <Loading text="Loading psychology sections..." />
                </div>
            ) : isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                    Failed to load psychology sections. Please check your network and try again.
                </div>
            ) : sections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <Layers className="h-6 w-6" />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-gray-900">
                        No psychology sections found
                    </h4>
                    <p className="mt-1 text-xs text-gray-500">
                        {hasActiveFilters
                            ? "Try adjusting your search query or switching tabs."
                            : "No sections have been created for this category yet."}
                    </p>
                    {hasActiveFilters ? (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="mt-3 inline-flex items-center text-xs font-semibold text-[#04A1B7] hover:underline cursor-pointer"
                        >
                            Reset filters
                        </button>
                    ) : null}
                </div>
            ) : (
                <>
                    <CategorySectionList
                        network="psychology"
                        networkLabel="Psychology Network"
                        sections={sections}
                        activeTab={activeTab}
                        onEditSection={handleUpdateSection}
                        industryOptions={industryOptions}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 border-t border-gray-200 pt-4">
                            <AdminPagination
                                pagination={{
                                    current_page: pagination?.current_page || page,
                                    total: totalSections,
                                    total_page: totalPages,
                                    limit: pagination?.per_page || pageSize,
                                }}
                                onPageChange={(p) => setPage(p)}
                                onPageSizeChange={(s) => {
                                    setPageSize(s);
                                    setPage(1);
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
