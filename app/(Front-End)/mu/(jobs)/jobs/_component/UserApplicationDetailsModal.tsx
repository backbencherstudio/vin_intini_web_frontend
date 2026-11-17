"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
  Briefcase,
  Sparkles,
} from "lucide-react";
import RootDialog from "@/components/reusable/RootDialog";
import { getApplicationStatusConfig } from "@/lib/utils";
import { FaLinkedin } from "react-icons/fa";

interface UserApplicationDetailsModalProps {
  application: any | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function UserApplicationDetailsModal({
  application,
  open,
  setOpen,
}: UserApplicationDetailsModalProps) {
  if (!application) return null;

  const job = application?.job ?? application;
  const company = job?.industry ?? job?.company;
  const companyName = company?.name || "Company";
  const jobTitle = job?.job_title || job?.title || "Position";
  const jobId = job?.id || application?.job_id;

  const statusConfig = getApplicationStatusConfig(application?.status);

  // Parse skills safely
  const parsedSkills: string[] = (() => {
    if (!application?.skills) return [];
    if (Array.isArray(application.skills)) return application.skills;
    try {
      const parsed = JSON.parse(application.skills);
      return Array.isArray(parsed) ? parsed : [String(application.skills)];
    } catch {
      return String(application.skills)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  })();

  // Format applied date cleanly as "Nov 15, 2026"
  const formattedDate = (() => {
    const raw = application?.created_at || application?.applied_at;
    if (!raw) return "N/A";
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return String(raw);
      return format(d, "MMM dd, yyyy");
    } catch {
      return String(raw);
    }
  })();

  // Clean application ID (e.g. "APP-737716" -> "737716")
  const displayAppId = (() => {
    const raw =
      application?.application_id ||
      (application?.id ? String(application.id) : null);
    if (!raw) return null;
    return String(raw).replace(/^#?APP-?/i, "").replace(/^#/, "").trim();
  })();

  // Clean job ID (e.g. "123456" -> "#123456")
  const displayJobCode = (() => {
    const raw =
      job?.job_id ||
      application?.job?.job_id ||
      job?.id ||
      application?.job_id;
    if (!raw) return null;
    const clean = String(raw).replace(/^#/, "").trim();
    return clean ? `#${clean}` : null;
  })();

  const formatSalary = (val?: any) => {
    if (!val) return null;
    const num = Number(val);
    if (isNaN(num)) return String(val);
    return `$${num.toLocaleString()}`;
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="max-w-3xl! p-0 overflow-hidden"
      ariaLabel="Application Details"
      ariaDescription="Review the details of your submitted job application"
    >
      <div className="flex flex-col max-h-[88vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-borderColor/80 px-6 py-4 bg-bgColor/50 shrink-0 pr-12">
          <div>
            <h3 className="text-lg font-bold text-headerColor">
              Application Details
            </h3>
            <p className="text-xs text-descriptionColor">
              Review the information and documents you submitted for this position.
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 overscroll-contain [overscroll-behavior:contain]">
          {/* Job & Company Overview Card */}
          <div className="rounded-2xl border border-borderColor/80 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-bgColor border border-borderColor/60 flex items-center justify-center shrink-0 overflow-hidden">
                  {company?.logo ? (
                    <Image
                      src={company.logo}
                      alt={companyName}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cyan-50 text-primaryColor font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/mu/jobs-details/${jobId}`}
                    target="_blank"
                    className="text-base sm:text-lg font-bold text-headerColor hover:text-primaryColor transition-colors flex items-center gap-1.5 truncate group"
                  >
                    <span>{jobTitle}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-grayColor1 group-hover:text-primaryColor shrink-0" />
                  </Link>
                  <p className="text-xs sm:text-sm text-grayColor1 mt-0.5 truncate">
                    {companyName}
                    {(job?.city || job?.state) && (
                      <span className="text-gray-400">
                        {" "}• {[job?.city, job?.state].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {job?.employment_type && (
                      <span className="bg-bgColor text-grayColor1 text-[11px] font-medium px-2 py-0.5 rounded-full capitalize">
                        {job.employment_type.replace(/_/g, " ")}
                      </span>
                    )}
                    {job?.work_mode && (
                      <span className="bg-bgColor text-grayColor1 text-[11px] font-medium px-2 py-0.5 rounded-full capitalize">
                        {job.work_mode.replace(/_/g, " ")}
                      </span>
                    )}
                    {job?.position && (
                      <span className="bg-bgColor text-grayColor1 text-[11px] font-medium px-2 py-0.5 rounded-full">
                        {job.position}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Applied Date */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <span
                  className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold border ${statusConfig.className}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConfig.dotClassName}`}
                  />
                  {statusConfig.label}
                </span>
                <span className="text-xs text-grayColor1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-grayColor1" />
                  <span>Applied {formattedDate}</span>
                </span>
                {displayAppId && (
                  <span className="text-xs text-headerColor font-medium">
                    Application ID: <span className="font-bold text-black">#{displayAppId}</span>
                  </span>
                )}
                {displayJobCode && (
                  <span className="text-xs text-headerColor font-medium">
                    Job ID: <span className="font-bold text-black">{displayJobCode}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submitted Information Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primaryColor" />
              <span>Personal & Contact Information Submitted</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Full Name */}
              <div className="rounded-xl border border-borderColor/70 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <User className="h-3.5 w-3.5 text-primaryColor" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">Full Name</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-headerColor truncate">
                  {application?.full_name || "Not specified"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-borderColor/70 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Mail className="h-3.5 w-3.5 text-primaryColor" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">Email Address</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-headerColor truncate" title={application?.email}>
                  {application?.email || "Not specified"}
                </p>
              </div>

              {/* Phone */}
              <div className="rounded-xl border border-borderColor/70 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Phone className="h-3.5 w-3.5 text-primaryColor" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">Phone Number</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-headerColor truncate">
                  {application?.phone_number || "Not provided"}
                </p>
              </div>

              {/* Current Position */}
              <div className="rounded-xl border border-borderColor/70 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Briefcase className="h-3.5 w-3.5 text-primaryColor" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">Current Position</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-headerColor truncate">
                  {application?.current_position || "Not specified"}
                </p>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-borderColor/70 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-primaryColor" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">Candidate Location</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-headerColor truncate">
                  {application?.location || "Not specified"}
                </p>
              </div>

              {/* Expected Salary */}
              <div className="rounded-xl border border-borderColor/70 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-primaryColor" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">Expected Salary</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-headerColor truncate">
                  {formatSalary(application?.expected_salary) || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Social / Portfolio Links */}
          {(application?.linkedin_url || application?.portfolio_url) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primaryColor" />
                <span>Links & Online Profiles</span>
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                {application?.linkedin_url && (
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-borderColor/80 bg-white text-xs font-semibold text-headerColor hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 transition-colors shadow-2xs"
                  >
                    <FaLinkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                )}
                {application?.portfolio_url && (
                  <a
                    href={application.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-borderColor/80 bg-white text-xs font-semibold text-headerColor hover:border-primaryColor hover:text-primaryColor hover:bg-primaryColor/5 transition-colors shadow-2xs"
                  >
                    <Globe className="w-4 h-4 text-primaryColor" />
                    <span>Portfolio Website</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Resume Banner */}
          {application?.resume_url && (
            <div className="rounded-2xl border border-primaryColor/30 bg-primaryColor/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primaryColor/10 text-primaryColor flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-headerColor">
                    Submitted Resume / CV Document
                  </p>
                  <p className="text-[11px] text-descriptionColor">
                    The resume file you provided with this application.
                  </p>
                </div>
              </div>
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primaryColor text-white text-xs font-semibold hover:bg-primaryColor/90 transition shadow-xs cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View / Download Resume</span>
              </a>
            </div>
          )}

          {/* Skills */}
          {parsedSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primaryColor" />
                <span>Skills & Proficiencies</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {parsedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full border border-borderColor/80 bg-bgColor text-headerColor text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {application?.experiences && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primaryColor" />
                <span>Experience Summary</span>
              </h4>
              <div className="rounded-xl border border-borderColor/80 bg-white p-4 text-xs sm:text-sm text-headerColor leading-relaxed whitespace-pre-line shadow-2xs">
                {application.experiences}
              </div>
            </div>
          )}

          {/* Cover Letter */}
          {application?.cover_letter && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primaryColor" />
                <span>Cover Letter</span>
              </h4>
              <div className="rounded-xl border border-borderColor/80 bg-white p-4 text-xs sm:text-sm text-headerColor leading-relaxed whitespace-pre-line shadow-2xs">
                {application.cover_letter}
              </div>
            </div>
          )}

          {/* About Candidate */}
          {application?.about_yourself && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primaryColor" />
                <span>About Yourself</span>
              </h4>
              <div className="rounded-xl border border-borderColor/80 bg-white p-4 text-xs sm:text-sm text-headerColor leading-relaxed whitespace-pre-line shadow-2xs">
                {application.about_yourself}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-borderColor/80 px-6 py-3.5 bg-bgColor/40 flex items-center justify-between gap-3 shrink-0">
          <Link
            href={`/mu/jobs-details/${jobId}`}
            className="text-xs font-semibold text-primaryColor hover:underline flex items-center gap-1"
          >
            <span>View Job Posting</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-5 py-2 rounded-xl bg-headerColor text-white text-xs font-semibold hover:bg-headerColor/90 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </RootDialog>
  );
}
