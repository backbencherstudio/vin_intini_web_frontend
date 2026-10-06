"use client";

import { userJobType } from "@/lib/type";
import React from "react";
import { JobCard } from "./JobCard";

interface JobCardSectionProps {
  title: string;
  subtitle: string;
  jobs: userJobType[];
  showAllPath?: string;
  showAllParams?: Record<string, string | number | boolean | undefined>;
  showAllLabel?: string;
}

export const JobCardSection: React.FC<JobCardSectionProps> = ({
  title,
  subtitle,
  jobs,

}) => {
  return (
    <section className="rounded-2xl border border-gray-100 p-3 sm:p-4 space-y-6 ">
      <div>
        <h2 className="text-xl font-bold text-[#1D1F2C]">{title}</h2>
        <p className="text-xs text-[#777986] mt-0.5">{subtitle}</p>
      </div>

      <div className="divide-y divide-gray-100">
        {jobs?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

   
    </section>
  );
};
