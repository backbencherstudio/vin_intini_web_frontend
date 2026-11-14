"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldBan,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomSelect, {
  type SelectOption,
} from "@/components/reusable/dashboard/CustomSelect";
import Pagination from "@/components/reusable/Pagination";
import type { AdminJobItem, AdminJobsMeta, AdminJobsSummary } from "@/feature/slice/admin/jobs";
import { useGetAllStatesQuery } from "@/feature/slice/settingSlice";
import { useGetStateByCityQuery } from "@/feature/slice/jobs/jobSlice";

interface AdminJobsTableProps {
  jobs: AdminJobItem[];
  meta?: AdminJobsMeta;
  summary?: AdminJobsSummary;
  isLoading?: boolean;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
  selectedWorkMode: string;
  onWorkModeChange: (mode: string) => void;
  selectedStateId: string;
  onStateChange: (stateId: string) => void;
  selectedCityId: string;
  onCityChange: (cityId: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  onViewJob: (job: AdminJobItem) => void;
  onEditJob: (job: AdminJobItem) => void;
  onRejectJob: (job: AdminJobItem) => void;
  onDeleteJob: (job: AdminJobItem) => void;
  onToggleStatus: (job: AdminJobItem, status: string) => void;
  onOpenCreateModal: () => void;
  onResetFilters: () => void;
}

const NETWORK_FILTER_OPTIONS: SelectOption[] = [
  { label: "All Networks", value: "all" },
  { label: "Psychology", value: "psychology" },
  { label: "Neuroscience", value: "neuroscience" },
];

const WORK_MODE_FILTER_OPTIONS: SelectOption[] = [
  { label: "All Work Modes", value: "all" },
  { label: "Remote", value: "remote" },
  { label: "On-site", value: "on_site" },
  { label: "Hybrid", value: "hybrid" },
];

export default function AdminJobsTable({
  jobs,
  meta,
  summary,
  isLoading = false,
  selectedStatus,
  onStatusChange,
  selectedNetwork,
  onNetworkChange,
  selectedWorkMode,
  onWorkModeChange,
  selectedStateId,
  onStateChange,
  selectedCityId,
  onCityChange,
  searchQuery,
  onSearchChange,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onViewJob,
  onEditJob,
  onRejectJob,
  onDeleteJob,
  onToggleStatus,
  onOpenCreateModal,
  onResetFilters,
}: AdminJobsTableProps) {
  // Fetch states for geography filter
  const { data: statesData, isLoading: isStateLoading } = useGetAllStatesQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const rawStates: any[] = useMemo(() => {
    if (Array.isArray(statesData?.data)) return statesData.data;
    if (Array.isArray(statesData)) return statesData;
    return [];
  }, [statesData]);

  const selectedStateObj = useMemo(() => {
    if (!selectedStateId || selectedStateId === "all") return null;
    return rawStates.find(
      (s: any) =>
        String(s.id) === String(selectedStateId) ||
        s.name === selectedStateId ||
        s.code === selectedStateId
    );
  }, [rawStates, selectedStateId]);

  const selectedStateCode = selectedStateObj?.code;

  const { data: citiesData, isLoading: isCitiesLoading } = useGetStateByCityQuery(
    selectedStateCode,
    {
      skip: !selectedStateCode || selectedStateId === "all",
      refetchOnMountOrArgChange: true,
    }
  );

  const stateOptions: SelectOption[] = useMemo(() => {
    const list = rawStates.map((s: any) => ({
      label: s.name,
      value: String(s.id),
    }));
    return [{ label: "All States", value: "all" }, ...list];
  }, [rawStates]);

  const cityOptions: SelectOption[] = useMemo(() => {
    const rawCities = Array.isArray(citiesData?.data)
      ? citiesData.data
      : Array.isArray(citiesData)
        ? citiesData
        : [];
    const list = rawCities.map((c: any) => ({
      label: c?.name || c?.city || String(c),
      value: String(c?.id ?? c?.name ?? c),
    }));
    return [{ label: "All Cities", value: "all" }, ...list];
  }, [citiesData]);

  const statusTabs = [
    { id: "all", label: "All Jobs", count: summary?.total ?? 0 },
    { id: "published", label: "Published", count: summary?.published ?? 0 },
    { id: "expired", label: "Expired", count: summary?.expired ?? 0 },
    { id: "rejected", label: "Rejected", count: summary?.rejected ?? 0 },
    { id: "draft", label: "Drafts", count: summary?.draft ?? 0 },
  ];

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    (selectedStateId && selectedStateId !== "all") ||
    (selectedCityId && selectedCityId !== "all") ||
    (selectedNetwork && selectedNetwork !== "all") ||
    (selectedWorkMode && selectedWorkMode !== "all")
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Published
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" /> Expired
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 border border-gray-200">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Status Tabs & Action Button */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#04A1B7] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <CustomButton
          type="button"
          variant="primary"
          onClick={onOpenCreateModal}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          Post Job for Industry
        </CustomButton>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title, position, category, company, or Job ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#04A1B7] focus:outline-none focus:ring-1 focus:ring-[#04A1B7]"
          />
        </div>

        {/* Dropdowns + Reset */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:items-center lg:gap-3">
          <div className="w-full lg:w-40">
            <CustomSelect
              options={stateOptions}
              value={selectedStateId}
              onChange={(val) => onStateChange(String(val))}
              placeholder={isStateLoading ? "Loading States..." : "Filter by State"}
            />
          </div>

          <div className="w-full lg:w-36">
            <CustomSelect
              options={cityOptions}
              value={selectedCityId}
              onChange={(val) => onCityChange(String(val))}
              disabled={!selectedStateId || selectedStateId === "all" || isCitiesLoading}
              placeholder={
                selectedStateId === "all"
                  ? "All Cities"
                  : isCitiesLoading
                    ? "Loading Cities..."
                    : "Filter by City"
              }
            />
          </div>

          <div className="w-full lg:w-38">
            <CustomSelect
              options={NETWORK_FILTER_OPTIONS}
              value={selectedNetwork}
              onChange={(val) => onNetworkChange(String(val))}
              placeholder="Filter by Network"
            />
          </div>

          <div className="w-full lg:w-38">
            <CustomSelect
              options={WORK_MODE_FILTER_OPTIONS}
              value={selectedWorkMode}
              onChange={(val) => onWorkModeChange(String(val))}
              placeholder="Filter by Work Mode"
            />
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            title={hasActiveFilters ? "Reset all filters" : "No filters active"}
            className={`col-span-2 sm:col-span-4 lg:col-span-1 flex h-10 items-center justify-center gap-1.5 rounded-xl border transition-all lg:w-10 lg:shrink-0 ${
              hasActiveFilters
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-2xs cursor-pointer"
                : "border-gray-200 bg-white text-gray-300 opacity-60 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-xs font-semibold lg:hidden">Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="w-12 px-3 py-3.5 text-center">SL</th>
                <th className="px-4 py-3.5">Job Information</th>
                <th className="px-4 py-3.5">Industry / Company</th>
                <th className="px-4 py-3.5">Mode & Type</th>
                <th className="px-4 py-3.5">Compensation</th>
                <th className="px-4 py-3.5 text-center">Applicants</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="w-12 px-3 py-4 text-center">
                      <div className="mx-auto h-4 w-5 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-40 rounded bg-gray-200 mb-1" />
                      <div className="h-3 w-24 rounded bg-gray-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="mx-auto h-4 w-12 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="mx-auto h-5 w-20 rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="ml-auto h-7 w-24 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <Briefcase className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">No job postings found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Try adjusting your search query, status tab, or state/city/network filters.
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:border-[#04A1B7] hover:bg-cyan-50 hover:text-[#04A1B7] cursor-pointer transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                jobs.map((job, index) => {
                  const serialNumber = (currentPage - 1) * pageSize + index + 1;
                  const isRejected = job.status === "rejected";
                  const isPublished = job.status === "published";

                  return (
                    <tr
                      key={job.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      {/* Serial Number */}
                      <td className="w-12 px-3 py-3.5 text-center font-medium text-gray-500">
                        {serialNumber}
                      </td>

                      {/* Job Title & Info */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => onViewJob(job)}
                            className="font-bold text-gray-900 hover:text-[#04A1B7] transition-colors text-left"
                          >
                            {job.job_title}
                          </button>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                            <span className="font-mono text-gray-400">#{job.job_id}</span>
                            {job.position && (
                              <>
                                <span>•</span>
                                <span>{job.position}</span>
                              </>
                            )}
                            {job.network_type && (
                              <span className="rounded bg-cyan-50 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-800 uppercase">
                                {job.network_type}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Industry Company */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {job.industry?.logo ? (
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                              <Image
                                src={job.industry.logo}
                                alt={job.industry.name || "Industry"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-500">
                              <Building2 className="h-4 w-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {job.industry?.name || "Verified Partner"}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">
                              {job.email || job.creator?.email || "No contact"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Work Mode & Type */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-800">
                          {job.work_mode?.toLowerCase() === "on_site" || job.work_mode?.toLowerCase() === "onsite"
                            ? "On-site"
                            : job.work_mode?.toLowerCase() === "hybrid"
                              ? "Hybrid"
                              : job.work_mode
                                ? job.work_mode.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                                : "Remote"}
                        </p>
                        <p className="text-[11px] text-gray-500 capitalize">
                          {job.employment_type ? job.employment_type.replace(/_/g, " ") : "Full-time"}
                        </p>
                      </td>

                      {/* Compensation */}
                      <td className="px-4 py-3.5">
                        {job.salary_min || job.salary_max ? (
                          <div className="font-medium text-gray-800">
                            ${Number(job.salary_min || 0).toLocaleString()} - ${Number(job.salary_max || 0).toLocaleString()}
                            <span className="block text-[10px] text-gray-400 uppercase">
                              {job.salary_type || "Annual"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Negotiable</span>
                        )}
                      </td>

                      {/* Applicants Button */}
                      <td className="px-4 py-3.5 text-center">
                        <Link
                          href={`/dashboard/jobs/${job.id}/applicants`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs transition-colors hover:border-[#04A1B7] hover:bg-cyan-50 hover:text-[#04A1B7]"
                        >
                          <Users className="h-3.5 w-3.5 text-gray-500" />
                          <span>{job.applications_count ?? 0}</span>
                        </Link>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5 text-center">
                        {getStatusBadge(job.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => onViewJob(job)}
                            title="View Job Details"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-[#04A1B7] hover:bg-cyan-50 hover:text-[#04A1B7] cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit job */}
                          <button
                            type="button"
                            onClick={() => onEditJob(job)}
                            title="Edit Job"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-[#04A1B7] hover:bg-cyan-50 hover:text-[#04A1B7] cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Restore if rejected */}
                          {isRejected && (
                            <button
                              type="button"
                              onClick={() => onToggleStatus(job, "published")}
                              title="Restore & Publish Job"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 cursor-pointer"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}

                          {/* Reject if not rejected */}
                          {!isRejected && (
                            <button
                              type="button"
                              onClick={() => onRejectJob(job)}
                              title="Reject Job with Reason"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                            >
                              <ShieldBan className="h-4 w-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => onDeleteJob(job)}
                            title="Delete Job"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>

      {/* Pagination */}
      {meta && meta.total > 0 && (
        <Pagination
          page={meta.current_page || currentPage}
          pageSize={meta.per_page || pageSize}
          total={meta.total || 0}
          totalPages={meta.last_page || 1}
          onPageChange={onPageChange}
          showPageSize={true}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 15, 20, 30, 50]}
        />
      )}
    </div>
  );
}

