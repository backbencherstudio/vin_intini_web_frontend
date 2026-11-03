"use client";

import { formatNumberIntoK } from "@/lib/utils";
import { useGetJobDetailsQuery } from "@/feature/slice/jobs/jobSlice";
import { JobDetails } from "@/lib/type";
import {
  DotIcon,
  EditeIcon,
  JobsIcon,
  LocationIcon,
} from "@/public/svgIcons/Icons";
import { Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import JobApplyAaction from "../../../(jobs)/jobs/_component/JobApplyAaction";
import DetailsSkeleton from "./JobsSIngleSkleton";
import JobStatusChange from "./JobStatusChange";
function JobDetailsHeader() {
  const params = useParams();
  const id = params.id as string | number;

  const pathName = usePathname();
  const { data, isLoading, isError } = useGetJobDetailsQuery(id, { skip: !id });

  if (isLoading) return <DetailsSkeleton />;
  const job = (data?.data ?? data) as JobDetails | undefined;
  const location = [job.city?.name, job.state?.name].filter(Boolean).join(", ");
  const salary =
    job.salary_min && job.salary_max
      ? `$${formatNumberIntoK({ value: job.salary_min })} - $${formatNumberIntoK({ value: job.salary_max })}`
      : job.salary_min
        ? `$${formatNumberIntoK({ value: job.salary_min })}`
        : "";
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
                {job.job_title}
              </h1>
              <p className="mt-1 text-sm md:text-base text-descriptionColor">
                Position -{" "}
                <span className="font-semibold text-headerColor">
                  {job.position}
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-end w-full md:w-auto items-center gap-2">
            <p className="rounded-full border border-primaryColor/15 bg-primaryColor/10 px-4 py-1 text-xs font-semibold capitalize text-primaryColor">
              {job.network_type}
            </p>
            {pathName.includes("mu/jobs-details") ? (
              <div>
                <button aria-label="More options" className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition">
                  <DotIcon />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <JobStatusChange value={job.status} row={{ id: id }} />
                <Link
                  href={`/mu/job-listing/${id}/edite`}
                  className="cursor-pointer px-4 py-1.5 rounded-full gap-2 bg-primaryColor text-white flex justify-center items-center text-sm font-medium hover:bg-primaryColor/90 transition shadow-xs"
                >
                  <EditeIcon className="w-4 h-4" /> Edit
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-descriptionColor pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <LocationIcon className="h-3.5 w-3.5" />
            {location || "Location unavailable"}
          </span>
          <span className="flex items-center gap-1.5">
            <JobsIcon className="h-3.5 w-3.5" />
            <span className="capitalize">
              {job.work_mode.split("_").join(" ")}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            <span className="capitalize">
              {job.employment_type.split("_").join(" ")}
            </span>
          </span>
          <span className="flex items-center gap-1.5 font-medium text-headerColor">
            {salary}/{job?.salary_type}
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
