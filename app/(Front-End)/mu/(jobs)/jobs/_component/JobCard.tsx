"use client";

import { useSaveUserJobMutation } from "@/feature/slice/jobs/userJobSlice";
import { userJobType } from "@/lib/type";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import toast from "react-hot-toast";
import { FiBookmark } from "react-icons/fi";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import JobApplyAaction from "./JobApplyAaction";

export const JobCard = memo(({ job }: { job: userJobType }) => {
  const [saveUserJob, { isLoading }] = useSaveUserJobMutation();
  const handleSaveJob = async (id: number) => {
    try {
      const response = await saveUserJob(id).unwrap();

      toast.success(response?.message || "Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Could not save this job. Please try again.");
    }
  };

  const workMode = (job?.work_mode || "").replaceAll("_", " ");
  const details = [job?.location, job?.created_at_human].filter(Boolean);

  return (
    <article className="flex w-full gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm sm:gap-4 sm:p-5">
      <div className="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-white sm:h-12 sm:w-12">
        <Image
          src={job?.industry?.logo || "/logo.png"}
          alt={job?.industry?.name || "Company"}
          fill
          sizes="48px"
          className="object-contain p-1"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <Link
                href={`/mu/jobs-details/${job?.id}`}
                className="line-clamp-2 text-sm font-semibold leading-5 text-headerColor transition-colors hover:text-primaryColor sm:text-base"
              >
                {job?.job_title}
              </Link>
              <HiOutlineCheckBadge
                aria-label="Verified company"
                className="shrink-0 text-base text-primaryColor"
              />
            </div>
            <p className="mt-1 truncate text-sm text-descriptionColor">
              {job?.industry?.name || "Company"}
              {job?.job_id && (
                <span className="text-grayColor1"> · Job ID: {job.job_id}</span>
              )}
            </p>
          </div>

          {workMode && (
            <span className="shrink-0 rounded-full border border-primaryColor/15 bg-primaryColor/10 px-2.5 py-1 text-xs font-medium capitalize text-primaryColor sm:px-3 sm:text-sm">
              {workMode}
            </span>
          )}
        </div>

        {details.length > 0 && (
          <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-grayColor1 sm:text-sm">
            {details.map((detail, index) => (
              <span key={`${detail}-${index}`} className="inline-flex items-center gap-1.5">
                {index > 0 && <span aria-hidden="true">·</span>}
                {detail}
              </span>
            ))}
            {job?.is_applied && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                Easy Apply
              </span>
            )}
          </p>
        )}

        {(() => {
          const displayCriteria = Array.isArray(job?.matched_criteria)
            ? job.matched_criteria.filter(
                (criterion) =>
                  !criterion.toLowerCase().startsWith("title") &&
                  !criterion.toLowerCase().startsWith("position"),
              )
            : [];

          if (displayCriteria.length === 0) return null;

          return (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {displayCriteria.slice(0, 4).map((criterion, idx) => (
                <span
                  key={`${criterion}-${idx}`}
                  className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-normal text-headerColor"
                >
                  {criterion}
                </span>
              ))}
            </div>
          );
        })()}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-gray-100 pt-3">
          <JobApplyAaction
            jobData={{
              industry_name: job?.industry?.name,
              industry_id: job?.industry?.id,
              jobTitle: job?.job_title,
              jobId: job?.id,
              job_apply: job?.is_applied,
              status: job?.status,
              is_own_industry: job?.industry?.is_own_industry,
            }}
          />

          <div className="ml-auto flex items-center gap-4 text-xs sm:text-sm">
            <p className="whitespace-nowrap text-descriptionColor">
              {job?.applications_count ?? 0} applied
            </p>
            <button
              type="button"
              onClick={() => handleSaveJob(job.id)}
              disabled={isLoading}
              aria-busy={isLoading}
              aria-pressed={Boolean(job?.is_saved)}
              aria-label={`${job?.is_saved ? "Unsave" : "Save"} ${job.job_title}`}
              className={`flex min-w-12 flex-col items-center justify-center gap-0.5 text-grayColor1 transition-colors hover:text-primaryColor disabled:cursor-not-allowed disabled:opacity-50 ${
                job?.is_saved ? "text-primaryColor" : ""
              }`}
            >
              {job?.is_saved ? (
                <Bookmark className="h-5 w-5 fill-primaryColor text-primaryColor" />
              ) : (
                <FiBookmark className="h-5 w-5" />
              )}
              <span>{job?.is_saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

JobCard.displayName = "JobCard";
