"use client";

import React, { useState, useMemo } from "react";
import {
  useGetAdminCitiesQuery,
  useGetAdminStatesForCitiesQuery,
  type CityItem,
} from "@/feature/slice/admin/city/cityApi";
import AdminPagination from "@/components/reusable/dashboard/AdminPagination";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import AddCityModal from "./AddCityModal";
import EditCityModal from "./EditCityModal";
import DeleteCityModal from "./DeleteCityModal";
import {
  Search,
  Plus,
  MapPin,
  Pencil,
  Trash2,
  Briefcase,
  X,
  Filter,
  CheckCircle2,
  Lock,
  RotateCcw,
} from "lucide-react";

export default function CityDataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedStateId, setSelectedStateId] = useState<string | number>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "jobs_count" | "state" | "created_at">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeCity, setActiveCity] = useState<CityItem | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Query States List (51 fixed US states)
  const { data: statesResponse, isLoading: statesLoading } =
    useGetAdminStatesForCitiesQuery();
  const states = statesResponse?.data || [];

  // Query Cities with pagination and filters
  const { data: citiesResponse, isLoading: citiesLoading, isFetching } =
    useGetAdminCitiesQuery({
      page,
      per_page: pageSize,
      state_id: selectedStateId === "all" ? undefined : selectedStateId,
      search: debouncedSearch || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

  const cities = citiesResponse?.data || [];
  const meta = citiesResponse?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: pageSize,
    total: 0,
  };

  const stateFilterOptions = useMemo(() => {
    const opts: { label: string; value: string | number }[] = [
      { label: "All States (51 States)", value: "all" },
    ];
    states.forEach((s) => {
      opts.push({
        label: `${s.name} (${s.code})${s.cities_count !== undefined ? ` • ${s.cities_count} cities` : ""}`,
        value: s.id,
      });
    });
    return opts;
  }, [states]);

  const sortOptions = [
    { label: "City Name (A-Z)", value: "name_asc" },
    { label: "City Name (Z-A)", value: "name_desc" },
    { label: "Most Linked Jobs", value: "jobs_desc" },
    { label: "State (A-Z)", value: "state_asc" },
    { label: "Recently Added", value: "created_desc" },
  ];

  const handleSortChange = (val: string | number) => {
    const str = String(val);
    if (str === "name_asc") {
      setSortBy("name");
      setSortOrder("asc");
    } else if (str === "name_desc") {
      setSortBy("name");
      setSortOrder("desc");
    } else if (str === "jobs_desc") {
      setSortBy("jobs_count");
      setSortOrder("desc");
    } else if (str === "state_asc") {
      setSortBy("state");
      setSortOrder("asc");
    } else if (str === "created_desc") {
      setSortBy("created_at");
      setSortOrder("desc");
    }
    setPage(1);
  };

  const currentSortValue =
    sortBy === "jobs_count"
      ? "jobs_desc"
      : sortBy === "state"
      ? "state_asc"
      : sortBy === "created_at"
      ? "created_desc"
      : sortOrder === "desc"
      ? "name_desc"
      : "name_asc";

  const handleOpenEdit = (city: CityItem) => {
    setActiveCity(city);
    setEditModalOpen(true);
  };

  const handleOpenDelete = (city: CityItem) => {
    setActiveCity(city);
    setDeleteModalOpen(true);
  };

  const handleSwitchToEdit = (city: CityItem) => {
    setActiveCity(city);
    setEditModalOpen(true);
  };

  const hasActiveFilters = Boolean(
    searchInput.trim() ||
    (selectedStateId !== "all" && selectedStateId !== "") ||
    sortBy !== "name" ||
    sortOrder !== "asc"
  );

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedStateId("all");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Filters, Search & Add City */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#04A1B7] focus:ring-2 focus:ring-[#04A1B7]/15"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* State Filter */}
          <div className="w-full sm:w-[260px]">
            <CustomSelect
              options={stateFilterOptions}
              value={selectedStateId}
              onChange={(val) => {
                setSelectedStateId(val);
                setPage(1);
              }}
              placeholder="Filter by State"
              disabled={statesLoading}
            />
          </div>

          {/* Sort Selector */}
          <div className="w-full sm:w-[200px]">
            <CustomSelect
              options={sortOptions}
              value={currentSortValue}
              onChange={handleSortChange}
              placeholder="Sort order"
            />
          </div>
        </div>

        {/* Action Buttons: Reset & + Add City */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            title={hasActiveFilters ? "Reset all filters to default" : "No filters active"}
            className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
              hasActiveFilters
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-2xs cursor-pointer"
                : "border-gray-200 bg-gray-50 text-gray-400 opacity-60 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <CustomButton
            variant="primary"
            onClick={() => setAddModalOpen(true)}
            className="w-full sm:w-auto shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add City
          </CustomButton>
        </div>
      </div>

      {/* Cities Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
              <tr>
                <th className="px-5 py-3.5 w-16">No.</th>
                <th className="px-5 py-3.5">City Name</th>
                <th className="px-5 py-3.5">US State</th>
                <th className="px-5 py-3.5 text-center">Linked Jobs</th>
                <th className="px-5 py-3.5 text-center">Candidate Prefs</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {citiesLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="h-4 w-6 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-36 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-28 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="mx-auto h-4 w-16 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="mx-auto h-4 w-12 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="ml-auto h-7 w-20 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : cities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-900">
                      No cities found
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {searchInput || selectedStateId !== "all"
                        ? "Try adjusting your search query or state filter."
                        : "Click '+ Add City' to create your first custom city."}
                    </p>
                    {(searchInput || selectedStateId !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("");
                          setSelectedStateId("all");
                        }}
                        className="mt-3 inline-flex items-center text-xs font-medium text-[#04A1B7] hover:underline"
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                cities.map((city, index) => {
                  const rowIndex = (meta.current_page - 1) * meta.per_page + index + 1;
                  const jobsCount = city.industry_job_posts_count ?? 0;
                  const prefsCount = city.user_job_preferences_count ?? 0;
                  const isInUse = jobsCount > 0 || prefsCount > 0;

                  return (
                    <tr
                      key={city.id}
                      className="transition-colors hover:bg-gray-50/75"
                    >
                      {/* Index */}
                      <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">
                        {rowIndex}
                      </td>

                      {/* City Name */}
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-[#04A1B7]" />
                          <span>{city.name}</span>
                        </div>
                      </td>

                      {/* State */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 border border-gray-200/60">
                          <span>{city.state?.name || "Unknown State"}</span>
                          {city.state?.code && (
                            <span className="font-semibold text-gray-500">
                              ({city.state.code})
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Linked Jobs */}
                      <td className="px-5 py-3.5 text-center">
                        {jobsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-[#038A9D] border border-teal-200/70">
                            <Briefcase className="h-3 w-3" />
                            {jobsCount} job{jobsCount === 1 ? "" : "s"}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Candidate Preferences */}
                      <td className="px-5 py-3.5 text-center">
                        {prefsCount > 0 ? (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200/70">
                            {prefsCount} pref{prefsCount === 1 ? "" : "s"}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(city)}
                            title="Edit City"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-[#04A1B7] hover:bg-[#04A1B7]/10 hover:text-[#04A1B7]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDelete(city)}
                            title={
                              isInUse
                                ? "Protected from deletion (Linked to active jobs)"
                                : "Delete City"
                            }
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                              isInUse
                                ? "border-amber-200 bg-amber-50/50 text-amber-600 hover:bg-amber-100"
                                : "border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                            }`}
                          >
                            {isInUse ? (
                              <Lock className="h-3.5 w-3.5" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="border-t border-gray-200 px-5 py-3.5">
          <AdminPagination
            pagination={{
              current_page: meta.current_page,
              total: meta.total,
              total_page: meta.last_page,
              limit: meta.per_page,
            }}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <AddCityModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        states={states}
        defaultStateId={selectedStateId !== "all" ? selectedStateId : undefined}
      />

      <EditCityModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        city={activeCity}
        states={states}
      />

      <DeleteCityModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        city={activeCity}
        onSwitchToEdit={handleSwitchToEdit}
      />
    </div>
  );
}
