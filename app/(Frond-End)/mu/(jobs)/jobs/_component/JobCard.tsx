"use client";

import React, { memo } from "react";
import Image from "next/image";
import { FiBookmark } from "react-icons/fi";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { JobItem } from "./jobdata";

export const JobCard = memo(({ job }: { job: JobItem }) => {
  return (
    <div className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
          <Image
            src={job.logo}
            alt={job.title}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-[#1D1F2C] text-sm sm:text-base leading-snug hover:text-primaryColor cursor-pointer">
              {job.title}
            </h3>
            {job.isVerified && (
              <HiOutlineCheckBadge className="text-primaryColor text-base shrink-0" />
            )}
          </div>

          <p className="text-xs text-gray-400">{job.company}</p>

          <p className="text-xs text-gray-500 flex items-center gap-1 flex-wrap pt-0.5">
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.postedTime}</span>
            {job.easyApply && (
              <>
                <span>•</span>
                <span>Easy Apply</span>
              </>
            )}
          </p>

          <p className="text-xs text-primaryColor font-medium pt-1">
            Your profile matches this job
          </p>

          <div className="pt-2">
            <button className="px-5 py-1.5 border border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white rounded-full text-xs font-semibold transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E6F7F5] text-primaryColor">
          {job.workplaceType}
        </span>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
          <span>{job.appliedCount} applied</span>
          <button
            type="button"
            aria-label={`Save ${job.title}`}
            className="flex items-center gap-1 hover:text-primaryColor transition-colors"
          >
            <FiBookmark className="text-sm" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
});

JobCard.displayName = "JobCard";