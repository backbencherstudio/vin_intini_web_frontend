"use client";

import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { JobItem } from "./jobdata";
import { JobCard } from "./JobCard";


interface JobCardSectionProps {
  title: string;
  subtitle: string;
  jobs: JobItem[];
}

export const JobCardSection: React.FC<JobCardSectionProps> = ({
  title,
  subtitle,
  jobs,
}) => {
  if (!jobs.length) return null;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-[#1D1F2C]">{title}</h2>
        <p className="text-xs text-[#777986] mt-0.5">{subtitle}</p>
      </div>

      <div className="divide-y divide-gray-100">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <div className="pt-2 text-center border-t border-gray-50">
        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00A896] hover:underline">
          <span>Show All</span>
          <BsArrowRight className="text-sm" />
        </button>
      </div>
    </section>
  );
};