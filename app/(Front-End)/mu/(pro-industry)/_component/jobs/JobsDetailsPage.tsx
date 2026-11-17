"use client";

import { useGetJobDetailsQuery } from "@/feature/slice/jobs/jobSlice";
import { JobDetails } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  EmailIcon,
  GlobalIcon,
  PhoneIcon,
  ScheduleIcon,
} from "@/public/svgIcons/Icons";
import {
  Activity,
  CalendarCheck,
  CalendarClock,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import DetailsSkeleton from "./JobsSIngleSkleton";
import {
  differenceInCalendarDays,
  format,
  isBefore,
  startOfDay,
} from "date-fns";
import { getSafeExternalUrl, sanitizeJobHtml } from "@/lib/jobSecurityHelpers";
import { getEffectiveJobStatus } from "@/lib/jobStatusHelper";
import { getStatusStyle } from "@/components/reusable/CommonStatusDropdown";

function parseDateSafe(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  try {
    const raw = String(dateStr).split("T")[0];
    const [y, m, d] = raw.split("-").map(Number);
    if (y && m && d) {
      return startOfDay(new Date(y, m - 1, d));
    }
  } catch {
    // fallback
  }
  return null;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between items-center gap-4 text-descriptionColor text-sm py-1.5 border-b border-gray-100 last:border-0">
      <h4 className="text-grayColor1">{label}</h4>
      <p className="text-right capitalize font-semibold text-headerColor">
        {value ? String(value).split("_").join(" ") : "N/A"}
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

  const effectiveStatus = getEffectiveJobStatus(
    job.status,
    job.announcement_start_date,
    job.announcement_end_date
  );
  const statusStyle = getStatusStyle(effectiveStatus);

  const statusBadgeLabel =
    effectiveStatus === "published"
      ? "Active"
      : effectiveStatus === "archive"
        ? "Archived"
        : effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1);

  const statusSubtitle =
    effectiveStatus === "published"
      ? "Currently accepting applications"
      : effectiveStatus === "scheduled"
        ? "Scheduled for future release"
        : effectiveStatus === "expired"
          ? "Deadline has passed"
          : effectiveStatus === "paused"
            ? "Applications temporarily paused"
            : effectiveStatus === "closed"
              ? "Position filled or closed"
              : effectiveStatus === "archive"
                ? "This position is archived"
                : effectiveStatus === "rejected"
                  ? "Listing unlisted"
                  : "Draft listing";

  const today = startOfDay(new Date());
  const startDate = parseDateSafe(job.announcement_start_date);
  const endDate = parseDateSafe(job.announcement_end_date);

  // Start Date calculations
  let startLabel = "Start Date";
  let startDisplay = "Immediate";
  let startSubtext = "Live upon publishing";

  if (startDate) {
    startDisplay = format(startDate, "MMM dd, yyyy");
    if (isBefore(today, startDate)) {
      startLabel = "Scheduled Release";
      const daysUntil = differenceInCalendarDays(startDate, today);
      startSubtext =
        daysUntil === 1
          ? "Goes live tomorrow"
          : `Goes live in ${daysUntil} days`;
    } else {
      startLabel = "Start Date";
      startSubtext = "Published";
    }
  }

  // Application Deadline calculations
  let deadlineDisplay = "Open Until Filled";
  let deadlineSubtext = "No fixed deadline (Continuous hiring)";
  let deadlineSubtextColor = "text-grayColor1";

  if (endDate) {
    deadlineDisplay = format(endDate, "MMM dd, yyyy");
    const diff = differenceInCalendarDays(endDate, today);

    if (diff < 0) {
      deadlineSubtext = "Deadline has passed";
      deadlineSubtextColor = "text-rose-600 font-medium";
    } else if (diff === 0) {
      deadlineSubtext = "Closes today";
      deadlineSubtextColor = "text-amber-600 font-semibold";
    } else if (diff === 1) {
      deadlineSubtext = "1 day remaining";
      deadlineSubtextColor = "text-amber-600 font-semibold";
    } else if (diff <= 7) {
      deadlineSubtext = `${diff} days remaining`;
      deadlineSubtextColor = "text-amber-600 font-semibold";
    } else {
      deadlineSubtext = `${diff} days remaining`;
      deadlineSubtextColor = "text-emerald-700 font-medium";
    }
  }

  return (
    <div className="pb-5 md:pb-8">
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-borderColor bg-white p-5 md:p-6 shadow-xs lg:col-span-3">
          <h2 className="mb-4 border-b border-borderColor pb-3 text-lg md:text-xl font-bold text-headerColor">
            Job Description
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html:
                sanitizeJobHtml(job.job_description) ||
                "<p class='text-gray-400 italic text-sm'>No job description provided yet (Draft position).</p>",
            }}
            className="whitespace-pre-line text-sm leading-relaxed text-descriptionColor"
          />

          {job.tags && job.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="mb-3 text-sm font-bold text-headerColor">
                Position Tags &amp; Skills:
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-primaryColor/15 bg-primaryColor/5 px-3 py-1 text-xs font-medium text-primaryColor"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-2xl border border-borderColor bg-white p-5 shadow-xs">
            <h2 className="mb-3 border-b border-borderColor pb-3 text-base md:text-lg font-bold text-headerColor">
              Position Overview
            </h2>
            <div className="space-y-1">
              <InfoRow label="Network" value={job.network_type} />
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
            <h2 className="mb-3.5 border-b border-borderColor pb-3 text-base md:text-lg font-bold text-headerColor">
              Schedule &amp; Application Deadline
            </h2>
            <div className="space-y-3">
              {/* Start Date / Scheduled Release */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-borderColor/70 bg-gray-50/60 p-3.5 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-grayColor1 font-medium">
                      {startLabel}
                    </p>
                    <p className="font-bold text-headerColor text-sm truncate">
                      {startDisplay}
                    </p>
                    {startSubtext && (
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {startSubtext}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Application Deadline */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-borderColor/70 bg-gray-50/60 p-3.5 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-grayColor1 font-medium">
                      Application Deadline
                    </p>
                    <p className="font-bold text-headerColor text-sm truncate">
                      {deadlineDisplay}
                    </p>
                    {deadlineSubtext && (
                      <p
                        className={cn(
                          "text-[11px] mt-0.5",
                          deadlineSubtextColor
                        )}
                      >
                        {deadlineSubtext}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Listing Status */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-borderColor/70 bg-gray-50/60 p-3.5 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primaryColor/10 text-primaryColor border border-primaryColor/20">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-grayColor1 font-medium">
                      Listing Status
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                      {statusSubtitle}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 select-none shadow-2xs",
                    statusStyle.bg,
                    statusStyle.text,
                    statusStyle.border
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      statusStyle.dot
                    )}
                  />
                  <span>{statusBadgeLabel}</span>
                </span>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-borderColor bg-white p-5 shadow-xs">
            <h2 className="mb-3 border-b border-borderColor pb-3 text-base md:text-lg font-bold text-headerColor">
              Contact Us
            </h2>
            <div className="space-y-2.5">
              {job.email ? (
                <ContactRow
                  icon={<EmailIcon className="h-5 w-5" />}
                  label="Email Address"
                  value={job.email}
                  href={`mailto:${job.email}`}
                />
              ) : null}
              {job.phone_number ? (
                <ContactRow
                  icon={<PhoneIcon className="h-5 w-5" />}
                  label="Phone Number"
                  value={job.phone_number}
                  href={`tel:${job.phone_number}`}
                />
              ) : null}
              {job.website ? (
                <ContactRow
                  icon={<GlobalIcon className="h-5 w-5" />}
                  label="Website"
                  value={job.website}
                  href={getSafeExternalUrl(job.website) || undefined}
                />
              ) : null}
              {!job.email && !job.phone_number && !job.website && (
                <p className="text-xs text-gray-400 italic py-2">
                  No contact details provided yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default JobsDetailsPage;
