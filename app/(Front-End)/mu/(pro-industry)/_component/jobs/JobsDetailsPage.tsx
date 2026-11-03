"use client";

import { useGetJobDetailsQuery } from "@/feature/slice/jobs/jobSlice";
import { JobDetails } from "@/lib/type";
import {
  EmailIcon,
  GlobalIcon,
  PhoneIcon,
  ScheduleIcon,
} from "@/public/svgIcons/Icons";
import Link from "next/link";
import DetailsSkeleton from "./JobsSIngleSkleton";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-4 text-descriptionColor text-sm py-1.5 border-b border-gray-100 last:border-0">
      <h4 className="text-grayColor1">{label}</h4>
      <p className="text-right capitalize font-semibold text-headerColor">
        {value.split("_").join(" ")}
      </p>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-borderColor/70 bg-gray-50/60 px-3.5 py-3">
      <span className="text-primaryColor shrink-0">{icon}</span>
      <div className="min-w-0 text-sm text-descriptionColor">
        <p className="text-xs text-grayColor1">{label}</p>
        {href ? (
          <Link
            href={href}
            target="_blank"
            className="break-all font-semibold text-primaryColor hover:underline"
          >
            {value}
          </Link>
        ) : (
          <span className="break-all font-semibold text-headerColor">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

function JobsDetailsPage({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetJobDetailsQuery(id, { skip: !id });

  if (isLoading) return <DetailsSkeleton />;

  const job = (data?.data ?? data) as JobDetails | undefined;

  if (isError || !job)
    return (
      <div className="container py-12 text-center text-sm text-descriptionColor">
        Unable to load this job details.
      </div>
    );

  return (
    <div className="pb-5 md:pb-8">
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-borderColor bg-white p-5 md:p-6 shadow-xs lg:col-span-3">
          <h2 className="mb-4 border-b border-borderColor pb-3 text-lg md:text-xl font-bold text-headerColor">
            Job Description
          </h2>
          <p
            dangerouslySetInnerHTML={{ __html: job.job_description }}
            className="whitespace-pre-line text-sm leading-relaxed text-descriptionColor"
          />

          <div className="mt-6 grid grid-cols-1 gap-5 text-sm text-descriptionColor md:grid-cols-2 pt-4 border-t border-gray-100">
            <div>
              <h3 className="mb-2 font-semibold text-headerColor">
                Position Details
              </h3>
              <p className="py-0.5">
                Career Level: <strong className="text-headerColor">{job.level}</strong>
              </p>
              <p className="py-0.5">
                Experience: <strong className="text-headerColor">{job.experience}</strong>
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-headerColor">
                Employment
              </h3>
              <p className="py-0.5">
                Network: <strong className="text-headerColor">{job.network_type}</strong>
              </p>
              <p className="py-0.5">
                Offering: <strong className="text-headerColor">{job.employment_offering}</strong>
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="mb-3 text-sm font-bold text-headerColor">
              Position Tags &amp; Skills:
            </h3>
            <div className="flex flex-wrap gap-2">
              {(job.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primaryColor/15 bg-primaryColor/5 px-3 py-1 text-xs font-medium text-primaryColor"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-2xl border border-borderColor bg-white p-5 shadow-xs">
            <h2 className="mb-3 border-b border-borderColor pb-3 text-base md:text-lg font-bold text-headerColor">
              Position Overview
            </h2>
            <div className="space-y-1">
              <InfoRow label="Work Mode" value={job.work_mode} />
              <InfoRow label="Employment Type" value={job.employment_type} />
              <InfoRow label="Career Level" value={job.level} />
              <InfoRow label="Experience Required" value={job.experience} />
              <InfoRow
                label="Employment Offering"
                value={job.employment_offering}
              />
            </div>
          </section>
          <section className="rounded-2xl border border-borderColor bg-white p-5 shadow-xs">
            <h2 className="mb-3 border-b border-borderColor pb-3 text-base md:text-lg font-bold text-headerColor">
              Posting Schedule
            </h2>
            <div className="space-y-2.5">
              <ContactRow
                icon={<ScheduleIcon className="h-5 w-5" />}
                label="Start Date"
                value={job.announcement_start_date}
              />
              <ContactRow
                icon={<ScheduleIcon className="h-5 w-5" />}
                label="End Date"
                value={job.announcement_end_date}
              />
            </div>
          </section>
          <section className="rounded-2xl border border-borderColor bg-white p-5 shadow-xs">
            <h2 className="mb-3 border-b border-borderColor pb-3 text-base md:text-lg font-bold text-headerColor">
              Contact Us
            </h2>
            <div className="space-y-2.5">
              <ContactRow
                icon={<EmailIcon className="h-5 w-5" />}
                label="Email Address"
                value={job.email}
                href={`mailto:${job.email}`}
              />
              <ContactRow
                icon={<PhoneIcon className="h-5 w-5" />}
                label="Phone Number"
                value={job.phone_number}
                href={`tel:${job.phone_number}`}
              />
              <ContactRow
                icon={<GlobalIcon className="h-5 w-5" />}
                label="Website"
                value={job.website}
                href={job.website}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default JobsDetailsPage;
