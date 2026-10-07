"use client";
import { useGetAllSavedJobsQuery } from "@/feature/slice/jobs/userJobSlice";
import { SaveJobcardSkeleton } from "./SaveJobcardSkeleton";
import SaveJobsNotFound from "./SaveJobsNotFound";
import SaveJobcard from "./SaveJobcard";

function SaveJobsList() {
  const { data, isLoading, isError } = useGetAllSavedJobsQuery("saved-jobs");
  const savedJobs = data?.data || data || [];
  return (
    <div>
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
        <SaveJobsNotFound />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((item: any, index: number) => (
            <SaveJobcard key={item?.id || index} job={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SaveJobsList;
