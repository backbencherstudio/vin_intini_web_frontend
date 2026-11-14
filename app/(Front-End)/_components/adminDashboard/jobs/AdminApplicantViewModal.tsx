"use client";

import Image from "next/image";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  FileText,
  Mail,
  Phone,
  User,
  UserCheck,
} from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect, {
  type SelectOption,
} from "@/components/reusable/dashboard/CustomSelect";
import type { ApplicantItem, ApplicantStage } from "@/feature/slice/admin/jobs";

interface AdminApplicantViewModalProps {
  applicant: ApplicantItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStage: (applicant: ApplicantItem, newStage: ApplicantStage) => void;
  isUpdatingStage?: boolean;
}

const STAGE_OPTIONS: SelectOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Interviewed", value: "interviewed" },
  { label: "Offered", value: "offered" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminApplicantViewModal({
  applicant,
  open,
  onOpenChange,
  onUpdateStage,
  isUpdatingStage = false,
}: AdminApplicantViewModalProps) {
  if (!applicant) return null;

  const parsedSkills: string[] = (() => {
    if (!applicant.skills) return [];
    if (Array.isArray(applicant.skills)) return applicant.skills;
    try {
      const parsed = JSON.parse(applicant.skills);
      return Array.isArray(parsed) ? parsed : [String(applicant.skills)];
    } catch {
      return String(applicant.skills).split(",").map((s) => s.trim()).filter(Boolean);
    }
  })();

  const parsedExperiences: any[] = (() => {
    if (!applicant.experiences) return [];
    if (Array.isArray(applicant.experiences)) return applicant.experiences;
    try {
      const parsed = JSON.parse(applicant.experiences);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Candidate Application Details"
      size="lg"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1 py-2">
        {/* Candidate Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            {applicant.applicant?.profile_image ? (
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-gray-200">
                <Image
                  src={applicant.applicant.profile_image}
                  alt={applicant.full_name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-500">
                <User className="h-7 w-7" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {applicant.full_name}
              </h3>
              <p className="text-xs text-gray-500">
                {applicant.current_position || "Applicant"}
                {applicant.applicant?.username && (
                  <span className="text-gray-400"> • @{applicant.applicant.username}</span>
                )}
              </p>
              <p className="text-[11px] font-mono text-gray-400">
                Application ID: #{applicant.application_id}
              </p>
            </div>
          </div>

          {/* Quick Stage Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Candidate Stage:</span>
            <div className="w-40">
              <CustomSelect
                options={STAGE_OPTIONS}
                value={applicant.status}
                onChange={(val) => onUpdateStage(applicant, val as ApplicantStage)}
                disabled={isUpdatingStage}
              />
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50/75 p-3">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Mail className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase">Email</span>
            </div>
            <p className="text-xs font-semibold text-gray-800 truncate">{applicant.email}</p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/75 p-3">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Phone className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase">Phone</span>
            </div>
            <p className="text-xs font-semibold text-gray-800">
              {applicant.phone_number || "Not provided"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/75 p-3">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase">Expected Salary</span>
            </div>
            <p className="text-xs font-semibold text-gray-800">
              {applicant.expected_salary
                ? `$${Number(applicant.expected_salary).toLocaleString()}`
                : "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/75 p-3">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-[11px] font-medium uppercase">Applied Date</span>
            </div>
            <p className="text-xs font-semibold text-gray-800">
              {applicant.created_at ? new Date(applicant.created_at).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>

        {/* Resume Attachment Banner */}
        {applicant.resume_url && (
          <div className="flex items-center justify-between rounded-2xl border border-cyan-200 bg-cyan-50/75 p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#04A1B7]" />
              <div>
                <p className="text-xs font-bold text-cyan-900">Resume / CV Document</p>
                <p className="text-[11px] text-cyan-700">Uploaded by candidate during application</p>
              </div>
            </div>
            <a
              href={applicant.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#04A1B7] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#038A9D]"
            >
              <Download className="h-3.5 w-3.5" />
              View / Download Resume
            </a>
          </div>
        )}

        {/* Skills */}
        {parsedSkills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Skills & Proficiencies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {parsedSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* About Candidate */}
        {applicant.about_yourself && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              About Candidate
            </h4>
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-xs leading-relaxed text-gray-700 whitespace-pre-line">
              {applicant.about_yourself}
            </div>
          </div>
        )}

        {/* Cover Letter */}
        {applicant.cover_letter && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cover Letter
            </h4>
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-xs leading-relaxed text-gray-700 whitespace-pre-line">
              {applicant.cover_letter}
            </div>
          </div>
        )}

        {/* Experiences */}
        {parsedExperiences.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Work Experience
            </h4>
            <div className="space-y-2">
              {parsedExperiences.map((exp: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-white p-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">{exp.title || "Position"}</p>
                    {exp.years && (
                      <span className="text-[11px] text-gray-500 font-medium">{exp.years} years</span>
                    )}
                  </div>
                  {exp.company && (
                    <p className="text-gray-600 font-medium mt-0.5">{exp.company}</p>
                  )}
                  {exp.description && (
                    <p className="mt-2 text-gray-500 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-gray-100 pt-4">
          <CustomButton
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Close
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}

