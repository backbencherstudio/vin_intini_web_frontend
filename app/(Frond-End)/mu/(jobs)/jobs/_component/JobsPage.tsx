"use client";

import React, { useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { INITIAL_JOB_DATA } from "./jobdata";
import { JobSearchBar } from "./JobSearchBar";
import { JobCardSection } from "./JobCardSection";

export default function JobsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get("filter") || "all";
  const searchParam = searchParams.get("search") || "";

  // Update query params in the URL
  const updateUrlParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Memoized Filtered List
  const filteredJobs = useMemo(() => {
    return INITIAL_JOB_DATA.filter((job) => {
      const matchesFilter =
        activeFilter === "all" || job.jobType === activeFilter;
      const matchesSearch =
        !searchParam ||
        job.title.toLowerCase().includes(searchParam.toLowerCase()) ||
        job.company.toLowerCase().includes(searchParam.toLowerCase()) ||
        job.location.toLowerCase().includes(searchParam.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchParam]);

  const fullTimeJobs = useMemo(
    () => filteredJobs.filter((job) => job.jobType === "full-time"),
    [filteredJobs]
  );

  const remoteJobs = useMemo(
    () => filteredJobs.filter((job) => job.jobType === "remote"),
    [filteredJobs]
  );

  const otherJobs = useMemo(
    () =>
      filteredJobs.filter(
        (job) => job.jobType !== "full-time" && job.jobType !== "remote"
      ),
    [filteredJobs]
  );

  return (
    <main className="w-full  space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1F2C]">
          All Jobs
        </h1>
        <p className="text-sm text-[#4A4C56] mt-1">
          All jobs that will perfectly match your profile.
        </p>
      </header>

      <JobSearchBar
        activeFilter={activeFilter}
        searchParam={searchParam}
        onFilterChange={(val) => updateUrlParam("filter", val)}
        onSearchChange={(val) => updateUrlParam("search", val)}
      />

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
          No jobs found matching your criteria.
        </div>
      ) : (
        <div className="space-y-6">
          {(activeFilter === "all" || activeFilter === "full-time") && (
            <JobCardSection
              title="Full Time Jobs"
              subtitle="Because you expressed interest in remote work"
              jobs={fullTimeJobs}
            />
          )}

          {(activeFilter === "all" || activeFilter === "remote") && (
            <JobCardSection
              title="Remote opportunities"
              subtitle="Because you expressed interest in remote work"
              jobs={remoteJobs}
            />
          )}

          {otherJobs.length > 0 && (
            <JobCardSection
              title="Available Jobs"
              subtitle="Opportunities tailored for you"
              jobs={otherJobs}
            />
          )}
        </div>
      )}
    </main>
  );
}