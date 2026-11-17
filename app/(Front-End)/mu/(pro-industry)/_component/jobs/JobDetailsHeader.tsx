"use client";

import { formatNumberIntoK, cn } from "@/lib/utils";
import { useGetJobDetailsQuery } from "@/feature/slice/jobs/jobSlice";
import { useSaveUserJobMutation } from "@/feature/slice/jobs/userJobSlice";
import { JobDetails } from "@/lib/type";
import {
  DotIcon,
  EditeIcon,
  JobsIcon,
  LocationIcon,
} from "@/public/svgIcons/Icons";
import {
  Archive,
  ArrowRight,
  Banknote,
  Bookmark,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ClockAlert,
  FileText,
  Lock,
  PauseCircle,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import JobApplyAaction from "../../../(jobs)/jobs/_component/JobApplyAaction";
import DetailsSkeleton from "./JobsSIngleSkleton";
import JobStatusChange from "./JobStatusChange";

function JobDetailsHeader() {
  const params = useParams();
  const id = params.id as string | number;

  const pathName = usePathname();
  const { data, isLoading } = useGetJobDetailsQuery(id, { skip: !id });
  const [saveUserJob, { isLoading: isSavingJob }] = useSaveUserJobMutation();

  const job = (data?.data ?? data) as JobDetails | undefined;
  const [isSaved, setIsSaved] = useState<boolean>(Boolean(job?.is_saved));

  useEffect(() => {
    if (job?.is_saved !== undefined) {
      setIsSaved(Boolean(job.is_saved));
    }
  }, [job?.is_saved]);

  const handleToggleSave = async () => {
    if (!id || isSavingJob) return;
    try {
      await saveUserJob(id).unwrap();
      const nextSaved = !isSaved;
      setIsSaved(nextSaved);
      toast.success(
        nextSaved ? "Job added to your saved jobs!" : "Job removed from saved jobs!"
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update saved job");
    }
  };

  if (isLoading) return <DetailsSkeleton />;
  if (!job) return null;

  const location = [job.city?.name, job.state?.name].filter(Boolean).join(", ");
  const isNegotiable =
    job.salary_type?.toLowerCase() === "negotiable" ||
    (!job.salary_min && !job.salary_max);

  const salary = isNegotiable
    ? "Negotiable"
    : job.salary_min && job.salary_max
      ? `$${formatNumberIntoK({ value: job.salary_min })} - $${formatNumberIntoK({ value: job.salary_max })}`
      : job.salary_min
        ? `$${formatNumberIntoK({ value: job.salary_min })}`
        : "Negotiable";

  const normStatus = job.status?.toLowerCase();
  const companyName = job?.industry?.name || job?.industry_name;
  return (
    <div>
      <section className="rounded-2xl border border-borderColor bg-white p-5 md:p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start md:items-center gap-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-borderColor bg-white">
              <Image
                src={job?.industry?.logo || "/logo.png"}
                alt={job?.industry?.name || "Company"}
                fill
                sizes="56px"
                className="object-contain p-1.5"
              />
            </div>
            <div className="xl:max-w-145 md:max-w-90 lg:max-w-85">
              <h1 className="text-xl md:text-2xl font-bold text-headerColor leading-tight">
                {(() => {
                  const words = (job.job_title || "").trim().split(" ");
                  if (words.length <= 1) {
                    return (
                      <span className="inline-flex items-center gap-1.5">
                        <span>{job.job_title}</span>
                        <HiOutlineCheckBadge
                          aria-label="Verified company"
                          className="shrink-0 text-lg md:text-xl text-primaryColor"
                        />
                      </span>
                    );
                  }
                  const lastWord = words.pop();
                  const firstPart = words.join(" ");
                  return (
                    <>
                      {firstPart}{" "}
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <span>{lastWord}</span>
                        <HiOutlineCheckBadge
                          aria-label="Verified company"
                          className="shrink-0 text-lg md:text-xl text-primaryColor"
                        />
                      </span>
                    </>
                  );
                })()}
              </h1>
              <p className="mt-1 text-sm md:text-base text-descriptionColor">
                Position -{" "}
                <span className="font-semibold text-headerColor">
                  {job.position || "Not specified"}
                </span>
              </p>
              {companyName && (
                <p className="mt-0.5 text-xs md:text-sm text-descriptionColor">
                  {companyName}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end w-full md:w-auto items-center gap-2">
            <p className="rounded-full border border-primaryColor/15 bg-primaryColor/10 px-4 py-1 text-xs font-semibold capitalize text-primaryColor">
              {job.network_type}
            </p>
            {pathName.includes("mu/jobs-details") ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleSave}
                  disabled={isSavingJob}
                  title={isSaved ? "Remove from saved jobs" : "Save this job"}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer disabled:opacity-50",
                    isSaved
                      ? "border-primaryColor bg-primaryColor/10 text-primaryColor"
                      : "border-gray-200 bg-white text-gray-700 hover:border-primaryColor hover:text-primaryColor hover:bg-gray-50"
                  )}
                >
                  <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-primaryColor")} />
                  <span className="hidden sm:inline">{isSaved ? "Saved" : "Save Job"}</span>
                </button>
                <button
                  aria-label="More options"
                  className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition text-gray-500"
                >
                  <DotIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <JobStatusChange
                  value={job.status}
                  row={{
                    id: id,
                    status: job.status,
                    announcement_start_date: job.announcement_start_date,
                    announcement_end_date: job.announcement_end_date,
                    job_title: job.job_title,
                  }}
                />
                {job.status?.toLowerCase() !== "rejected" && (
                  <Link
                    href={`/mu/job-listing/${id}/edite`}
                    className="cursor-pointer px-4 py-1.5 rounded-full gap-2 bg-primaryColor text-white flex justify-center items-center text-sm font-medium hover:bg-primaryColor/90 transition shadow-xs"
                  >
                    <EditeIcon className="w-4 h-4" /> Edit
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Applied Status Confirmation Banner (If candidate already applied) */}
        {pathName.includes("mu/jobs-details") && Boolean(job?.is_applied) && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs text-emerald-950 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-emerald-950">
                      You Have Applied for This Position
                    </h4>
                    <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      Applied
                    </span>
                    {normStatus !== "published" && (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 capitalize">
                        Listing {normStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-800 text-xs mt-1 leading-relaxed">
                    {normStatus !== "published"
                      ? "This job listing is now closed to new applicants, but your application was successfully submitted and remains under review with the employer."
                      : "Your application was submitted successfully and is currently under review by the hiring team."}
                  </p>
                </div>
              </div>
              <Link
                href="/mu/jobs/my-applications"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition shadow-2xs shrink-0 self-start sm:self-auto"
              >
                View My Applications <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Public Status Notice Banners for Non-Active Jobs (Only if candidate has NOT applied) */}
        {pathName.includes("mu/jobs-details") && !job?.is_applied && normStatus !== "published" && (
          normStatus === "rejected" ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs text-red-900 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
                <span className="font-semibold text-red-800 text-sm">
                  Job Post Rejected by MindUnite Administrator
                </span>
              </div>
            </div>
          ) : (normStatus === "archive" || normStatus === "archived") ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 text-xs text-slate-800 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                    <Archive className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        This Position Has Been Archived
                      </h4>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                        Archived
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      The employer has archived this listing and is no longer accepting new applications.
                    </p>
                  </div>
                </div>
                <Link
                  href="/mu/jobs"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-xs transition shadow-2xs shrink-0 self-start sm:self-auto"
                >
                  Browse Similar Jobs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : normStatus === "closed" ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50/90 p-4 text-xs text-gray-800 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-700">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">
                        Position Closed
                      </h4>
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                        Closed
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                      This position has been filled or closed by the recruiter. Applications are now closed.
                    </p>
                  </div>
                </div>
                <Link
                  href="/mu/jobs"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold text-xs transition shadow-2xs shrink-0 self-start sm:self-auto"
                >
                  Browse Similar Jobs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : normStatus === "paused" ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <PauseCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-amber-900">
                        Applications Temporarily Paused
                      </h4>
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                        Paused
                      </span>
                    </div>
                    <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                      The hiring team has paused incoming applications while reviewing candidates. Please check back later.
                    </p>
                  </div>
                </div>
                <Link
                  href="/mu/jobs"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 font-semibold text-xs transition shadow-2xs shrink-0 self-start sm:self-auto"
                >
                  Browse Other Jobs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : normStatus === "expired" ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs text-red-900 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                    <ClockAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-red-900">
                        Application Deadline Has Passed
                      </h4>
                      <span className="rounded-full bg-red-200 px-2 py-0.5 text-[10px] font-bold text-red-800 uppercase tracking-wide">
                        Expired
                      </span>
                    </div>
                    <p className="text-red-700 text-xs mt-1 leading-relaxed">
                      {job.announcement_end_date
                        ? `The application deadline for this position was ${job.announcement_end_date}. No further applications are being accepted.`
                        : "The application deadline for this position has passed."}
                    </p>
                  </div>
                </div>
                <Link
                  href="/mu/jobs"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-red-300 text-red-800 hover:bg-red-100 font-semibold text-xs transition shadow-2xs shrink-0 self-start sm:self-auto"
                >
                  Browse Similar Jobs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : normStatus === "scheduled" ? (
            <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/90 p-4 text-xs text-indigo-900 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-indigo-900">
                      Upcoming Position
                    </h4>
                    <span className="rounded-full bg-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                      Scheduled
                    </span>
                  </div>
                  <p className="text-indigo-700 text-xs mt-1 leading-relaxed">
                    {job.announcement_start_date
                      ? `This position is scheduled to officially open on ${job.announcement_start_date}. Applications will open once it goes live.`
                      : "This position is scheduled for future release."}
                  </p>
                </div>
              </div>
            </div>
          ) : null
        )}

        {/* Industry Recruiter Internal Rejection Banner */}
        {!pathName.includes("mu/jobs-details") && normStatus === "rejected" && (
          pathName.includes("mu/jobs-details") ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-xs text-red-900 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
                <span className="font-semibold text-red-800 text-sm">
                  Job Post Rejected by MindUnite Administrator
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs text-red-900 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-red-900 text-sm">
                      Job Posting Rejected by MindUnite Administrator
                    </span>
                    <span className="rounded-full border border-red-300 bg-white px-2 py-0.5 text-[10px] font-bold text-red-800 uppercase tracking-wide">
                      Rejected Listing
                    </span>
                  </div>
                  <div className="rounded-xl border border-red-200/80 bg-white/80 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-red-800">
                      Rejection Reason:
                    </p>
                    <p className="text-red-950 text-xs leading-relaxed font-semibold mt-1 whitespace-pre-line">
                      &ldquo;{job.rejection_reason || "Violation of platform listing guidelines or policy."}&rdquo;
                    </p>
                    {job.reviewed_at && (
                      <p className="text-[10px] text-red-600 mt-1.5 font-medium">
                        Reviewed on: {new Date(job.reviewed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] text-red-700 leading-relaxed">
                    This job listing has been unlisted from public feeds and search. Status cannot be modified by the industry partner.
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {/* Industry Recruiter Draft Notice Banner */}
        {!pathName.includes("mu/jobs-details") && normStatus === "draft" && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-[#FEF6E6]/90 p-4 text-xs text-amber-950 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-[#d97706]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-amber-950">
                      Draft Job Position
                    </h4>
                    <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-[#b45309] uppercase tracking-wide">
                      Draft
                    </span>
                  </div>
                  <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                    This job posting is saved as an incomplete draft and is not visible publicly. Complete all steps and publish when ready.
                  </p>
                </div>
              </div>
              <Link
                href={`/mu/job-listing/${id}/edite`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primaryColor text-white hover:bg-primaryColor/90 font-semibold text-xs transition shadow-2xs shrink-0 self-start sm:self-auto"
              >
                Complete &amp; Publish <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-descriptionColor pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <LocationIcon className="h-3.5 w-3.5" />
            {location || "Location unavailable"}
          </span>
          <span className="flex items-center gap-1.5">
            <JobsIcon className="h-3.5 w-3.5" />
            <span className="capitalize">
              {job.work_mode
                ? job.work_mode.split("_").join(" ")
                : "Work mode not specified"}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            <span className="capitalize">
              {job.employment_type
                ? job.employment_type.split("_").join(" ")
                : "Employment type not specified"}
            </span>
          </span>
          <span className="flex items-center gap-1.5 font-medium text-headerColor">
            <Banknote className="h-3.5 w-3.5 text-grayColor1" />
            <span>
              {isNegotiable
                ? "Negotiable"
                : `${salary}${job?.salary_type ? `/${job.salary_type}` : ""}`}
            </span>
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
          {pathName.includes("mu/jobs-details") ? (
            <div>
              <JobApplyAaction
                jobData={{
                  industry_name: job?.industry?.name,
                  industry_id: job?.industry?.id,
                  jobTitle: job?.job_title,
                  jobId: id,
                  job_apply: job?.is_applied,
                  status: job?.status,
                }}
              />
            </div>
          ) : pathName.includes("applicants") ? (
            <Link
              href={`/mu/job-listing/${id}/job-details`}
              className="rounded-full bg-primaryColor px-5 py-2 text-sm font-medium text-white transition hover:bg-primaryColor/90 shadow-xs"
            >
              View Details
            </Link>
          ) : (
            <Link
              href={`/mu/job-listing/${id}/applicants`}
              className="rounded-full bg-primaryColor px-5 py-2 text-sm font-medium text-white transition hover:bg-primaryColor/90 shadow-xs"
            >
              View Applicants ({job.applications_count ?? 0})
            </Link>
          )}

          <span className="text-xs sm:text-sm font-medium text-grayColor1 bg-gray-50 border border-borderColor px-3 py-1 rounded-lg">
            JOB ID <span className="font-semibold text-headerColor">#{job.job_id}</span>
          </span>
        </div>
      </section>
    </div>
  );
}

export default JobDetailsHeader;
