"use client";

import {
  useGetRecommendedJobsQuery,
  useGetUserJobPreferenceQuery,
} from "@/feature/slice/jobs/userJobSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { useUrlQueryParams } from "@/hooks/useUrlQueryParams";
import {
  Briefcase,
  SlidersHorizontal,
} from "lucide-react";
import React, { useState } from "react";
import { JobCard } from "./JobCard";
import { JobCardSection } from "./JobCardSection";
import { JobCardSkeleton } from "./JobCardSkeleton";
import JobPreferenceModal from "./JobPreferenceModal";
import { JobSearchBar } from "./JobSearchBar";

export default function RecommendedJobsPage() {
  const limit = 10;
  const { params, updateParam } = useUrlQueryParams();
  const activeFilter = params?.employment_type || "all";
  const searchParam = params?.search || "";
  const queryLimit = params?.limit ? Number(params.limit) : limit;

  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);

  const { data: prefResponse, refetch: refetchPreference } =
    useGetUserJobPreferenceQuery();

  const {
    data: jobsResponse,
    combinedData: jobs,
    isInitialLoading,
    isFetchingMore,
    lastElementRef,
    refetch: refetchJobs,
  } = useCursorQuery(useGetRecommendedJobsQuery, params, {
    limit: queryLimit,
  });

  const preference = prefResponse?.data || jobsResponse?.preference;
  const hasPreference = Boolean(
    prefResponse?.has_preference ?? jobsResponse?.has_preference,
  );

  const activePreferencePills: { label: string; value: string }[] = [];
  if (preference) {
    if (preference.job_title) {
      activePreferencePills.push({
        label: "Title",
        value: preference.job_title,
      });
    }
    if (preference.position) {
      activePreferencePills.push({
        label: "Position",
        value: preference.position,
      });
    }
    if (preference.work_mode) {
      const modeLabel =
        preference.work_mode === "on_site"
          ? "On-site"
          : preference.work_mode === "hybrid"
            ? "Hybrid"
            : "Remote";
      activePreferencePills.push({
        label: "Work Mode",
        value: modeLabel,
      });
    }
    if (preference.employment_type) {
      const typeLabel =
        preference.employment_type === "full_time"
          ? "Full-time"
          : preference.employment_type === "part_time"
            ? "Part-time"
            : preference.employment_type === "short_term"
              ? "Short-term"
              : preference.employment_type === "contract"
                ? "Contract"
                : "Internship";
      activePreferencePills.push({
        label: "Type",
        value: typeLabel,
      });
    }
    if (preference.level) {
      activePreferencePills.push({
        label: "Level",
        value: preference.level,
      });
    }
    if (preference.network_type) {
      activePreferencePills.push({
        label: "Network",
        value:
          preference.network_type.charAt(0).toUpperCase() +
          preference.network_type.slice(1),
      });
    }
    if (preference.category) {
      activePreferencePills.push({
        label: "Category",
        value: preference.category,
      });
    }
    if (preference.experience) {
      activePreferencePills.push({
        label: "Experience",
        value: preference.experience,
      });
    }
    if (preference.salary_min || preference.salary_max) {
      const min = preference.salary_min
        ? `$${Number(preference.salary_min).toLocaleString()}`
        : "";
      const max = preference.salary_max
        ? `$${Number(preference.salary_max).toLocaleString()}`
        : "";
      const salaryText =
        min && max ? `${min} - ${max}` : min ? `From ${min}` : `Up to ${max}`;
      activePreferencePills.push({
        label: "Salary",
        value: salaryText,
      });
    }
    if (preference.state?.name) {
      activePreferencePills.push({
        label: "State",
        value: preference.state.name,
      });
    }
    if (preference.city?.name) {
      activePreferencePills.push({
        label: "City",
        value: preference.city.name,
      });
    }
  }

  const jobsType =
    activeFilter === "all"
      ? "Recommended Jobs"
      : activeFilter === "full_time"
        ? "Full-Time Recommendations"
        : activeFilter === "part_time"
          ? "Part-Time Recommendations"
          : activeFilter === "short_term"
            ? "Short-Term Recommendations"
            : activeFilter === "internship"
              ? "Internship Recommendations"
              : "Contract Recommendations";

  return (
    <main className="w-full">
      {/* Top Header */}
      <header className="mb-6 flex items-start md:items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor">
            Recommended Jobs
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Jobs recommended based on your preferences and profile.
          </p>
        </div>
      </header>

      {/* Search & Tabs */}
      <JobSearchBar
        activeFilter={activeFilter}
        searchParam={searchParam}
        onFilterChange={(val) => updateParam("employment_type", val, "all")}
        onSearchChange={(val) => updateParam("search", val)}
        onPreferencesClick={() => setIsPreferenceModalOpen(true)}
      />

      {/* Job Cards Feed */}
      {isInitialLoading ? (
        <div className="divide-y space-y-4 divide-gray-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : jobs?.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-grayColor1">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold text-headerColor">
            No matching jobs found
          </h2>
          <p className="mt-1 text-sm text-descriptionColor max-w-md mx-auto">
            {hasPreference
              ? "We couldn't find jobs matching all your current preferences. Try adjusting or broadening your preferences."
              : "No jobs matching your filter criteria at this time."}
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsPreferenceModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:bg-primaryColor/90 transition"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{hasPreference ? "Adjust Preferences" : "Set Preferences"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <JobCardSection
            title={jobsType}
            subtitle={
              hasPreference
                ? "Ranked by match with your career preferences"
                : "Recommended jobs available on the platform"
            }
          />

          <div className="space-y-3">
            {jobs?.map((job, index) => (
              <div
                key={job.id}
                ref={index === jobs.length - 1 ? lastElementRef : null}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Bottom loader while fetching next cursor page */}
          {isFetchingMore && (
            <div className="space-y-3 pt-1">
              <JobCardSkeleton />
            </div>
          )}
        </div>
      )}

      {/* Preference Edit Modal */}
      <JobPreferenceModal
        isOpen={isPreferenceModalOpen}
        onClose={() => setIsPreferenceModalOpen(false)}
        onSaved={() => {
          refetchPreference();
          refetchJobs();
        }}
      />
    </main>
  );
}

