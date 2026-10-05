"use client";

import { useGetUserAllJobsQuery } from "@/feature/slice/jobs/userJobSlice";
import { useUrlQueryParams } from "@/hooks/useUrlQueryParams";
import { JobCardSection } from "./JobCardSection";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { JobSearchBar } from "./JobSearchBar";

export default function JobsPage() {
  const limit = 10;
  const { params, updateParam } = useUrlQueryParams();
  const activeFilter = params?.filter || "all";
  const searchParam = params?.search || "";

  const { data, isLoading, isError } = useGetUserAllJobsQuery(params);
  const jobs = data?.data || [];

  const jobsType =
    activeFilter === "all"
      ? "All"
      : activeFilter === "full-time"
        ? "Full Time"
        : activeFilter === "part-time"
          ? "Part Time"
          : activeFilter === "short-term"
            ? "Short Term"
            : "Remote";
  return (
    <main className="w-full  ">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1F2C]">
          {jobsType} Jobs
        </h1>
        <p className="text-sm text-[#4A4C56] mt-1">
          {jobsType} jobs that will perfectly match your profile.
        </p>
      </header>

      <JobSearchBar
        activeFilter={activeFilter}
        searchParam={searchParam}
        onFilterChange={(val) => updateParam("filter", val, "all")}
        onSearchChange={(val) => updateParam("search", val)}
      />

      {isLoading ? (
        <div className="divide-y space-y-4 divide-gray-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : jobs?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
          No jobs found matching your criteria.
        </div>
      ) : (
        <div className="space-y-6">
          <JobCardSection
            title={`${jobsType} Time Jobs`}
            subtitle="Because you expressed interest in remote work"
            jobs={jobs}
          />
        </div>
      )}
    </main>
  );
}
