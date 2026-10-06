"use client";

import React from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useGetAllSavedJobsQuery } from "@/feature/slice/jobs/userJobSlice";
import SaveJobcard, {
  SaveJobcardSkeleton,
} from "../_component/SaveJobcard";

export default function SavedJobsPage() {
  const { data, isLoading, isError } = useGetAllSavedJobsQuery("");
  const savedJobs = data?.data || data || [];

  return (
    <main className="w-full">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-headerColor">
          Saved Jobs
        </h1>
        <p className="text-sm text-grayColor1 mt-1">
          Jobs you have saved for later review and application.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SaveJobcardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
          Failed to load saved jobs. Please try again later.
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-headerColor">
            No saved jobs yet
          </h3>
          <p className="text-sm text-grayColor1 mt-1 mb-5">
            You haven't saved any jobs yet. When you find jobs you're interested
            in, save them to apply later.
          </p>
          <Link
            href="/mu/jobs"
            className="inline-block bg-primaryColor text-white text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition"
          >
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((item: any, index: number) => (
            <SaveJobcard key={item?.id || index} job={item} />
          ))}
        </div>
      )}
    </main>
  );
}