"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiBookmark } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import toast from "react-hot-toast";
import {
  useGetTopJobPicksQuery,
  useSaveUserJobMutation,
} from "@/feature/slice/jobs/userJobSlice";

interface TopJobsRightbarProps {
  excludeId?: string | number;
  limit?: number;
}

export default function TopJobsRightbar({
  excludeId,
  limit = 4,
}: TopJobsRightbarProps) {
  const { data: topJobsResponse, isLoading, isError } = useGetTopJobPicksQuery({
    limit,
    ...(excludeId ? { exclude_id: excludeId } : {}),
  });

  const [saveUserJob, { isLoading: isSaving }] = useSaveUserJobMutation();

  const jobs: any[] = topJobsResponse?.data || [];

  const handleToggleSave = async (jobId: number) => {
    try {
      const response = await saveUserJob(jobId).unwrap();
      toast.success(response?.message || "Job updated successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Could not update saved job. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-borderColor bg-white p-5 shadow-xs flex flex-col max-h-[calc(100vh-7.5rem)]">
      {/* Header */}
      <div className="border-b border-borderColor pb-4 shrink-0">
        <h2 className="text-lg font-bold text-headerColor">
          Top job picks for you
        </h2>
        <p className="mt-1 text-xs text-descriptionColor leading-relaxed">
          Based on your profile, preferences, and activity like applies, searches, and saves
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="divide-y divide-gray-100 animate-pulse overflow-y-auto flex-1 pr-1.5 -mr-1.5 custom-scrollbar">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-3.5 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-36 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 rounded-full bg-gray-200" />
                <div className="h-8 w-8 rounded-lg bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : isError || jobs.length === 0 ? (
        <div className="py-8 text-center text-xs text-descriptionColor">
          No top job picks available at this time.
        </div>
      ) : (
        /* Jobs List */
        <div className="divide-y divide-gray-100 overflow-y-auto flex-1 pr-1.5 -mr-1.5 custom-scrollbar">
          {jobs.map((job) => {
            const role = job.job_title || job.position || "Job Position";
            const company = job.industry?.name || "Company";
            const workplaceType = (job.work_mode || "").replaceAll("_", " ");
            const location = job.location || "Remote";
            const isApplied = Boolean(job.is_applied);
            const isSaved = Boolean(job.is_saved);

            return (
              <div key={job.id} className="py-5 first:pt-4 last:pb-0 space-y-3">
                {/* Header: Logo & Title */}
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-white">
                    <Image
                      src={job.industry?.logo || "/logo.png"}
                      alt={company}
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-headerColor">
                      {company}
                    </h3>
                    <Link
                      href={`/mu/jobs-details/${job.id}`}
                      className="truncate text-xs text-descriptionColor block hover:text-primaryColor hover:underline transition"
                    >
                      {role}
                    </Link>
                  </div>
                </div>

                {/* Tags & Applied Info */}
                <div className="flex items-center gap-2 text-xs">
                  {workplaceType && (
                    <span className="rounded-full bg-lightGreenColor px-2.5 py-0.5 font-medium text-primaryColor capitalize">
                      {workplaceType}
                    </span>
                  )}
                  <span className="text-grayColor1 font-medium">
                    {job.applications_count ?? 0} applied
                  </span>
                </div>

                {/* Description */}
                {job.job_description && (
                  <p className="text-xs text-descriptionColor line-clamp-2 leading-relaxed">
                    {job.job_description}
                  </p>
                )}

                {/* Location & Time meta */}
                <div className="flex items-start gap-1 text-[11px] text-grayColor1">
                  <HiOutlineLocationMarker className="mt-0.5 shrink-0 text-sm" />
                  <div className="flex flex-wrap items-center gap-1">
                    <span>{location}</span>
                    {job.created_at_human && (
                      <>
                        <span>•</span>
                        <span>{job.created_at_human}</span>
                      </>
                    )}
                    {isApplied && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-emerald-700">Applied</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {isApplied ? (
                    <Link
                      href={`/mu/jobs-details/${job.id}`}
                      className="flex-1 rounded-full bg-lightGreenColor2/15 py-2 text-center text-xs font-semibold text-primaryColor transition hover:bg-lightGreenColor2/25"
                    >
                      Applied
                    </Link>
                  ) : (
                    <Link
                      href={`/mu/jobs-details/${job.id}`}
                      className="flex-1 rounded-full bg-primaryColor py-2 text-center text-xs font-semibold text-white transition hover:bg-primaryColor/90 shadow-xs"
                    >
                      Apply
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleSave(job.id)}
                    aria-label={`Save ${role} at ${company}`}
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition ${
                      isSaved
                        ? "border-primaryColor bg-primaryColor/10 text-primaryColor"
                        : "border-gray-200 text-grayColor1 hover:border-primaryColor/40 hover:bg-primaryColor/5 hover:text-primaryColor"
                    }`}
                  >
                    <FiBookmark
                      className={`text-sm ${
                        isSaved ? "fill-primaryColor text-primaryColor" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
