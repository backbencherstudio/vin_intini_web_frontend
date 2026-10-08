"use client";

import { useGetMyJobApplicationsQuery } from "@/feature/slice/jobs/userJobSlice";
import { useState } from "react";
import SaveJobcard from "./SaveJobcard";
import { SaveJobcardSkeleton } from "./SaveJobcardSkeleton";

const FILTER_TABS = [
  { id: "all", label: "All Applications" },
  { id: "interview", label: "Interview" },
  { id: "assessment", label: "Assessment" },
  { id: "offering", label: "Offering" },
  { id: "acceptance", label: "Acceptence" },
  { id: "reject", label: "Reject" },
];

function MyJobApplicationsApply() {
  const [activeTab, setActiveTab] = useState("all");
  const { data, isLoading, isError, refetch } = useGetMyJobApplicationsQuery(
    {},
  );

  const applications: any[] = data?.data || [];

  // Filter applications based on selected tab
  const filteredApplications = applications.filter((app: any) => {
    if (activeTab === "all") return true;
    const status = String(app?.status || "")
      .toLowerCase()
      .trim();

    if (activeTab === "interview") {
      return status.includes("interview");
    }
    if (activeTab === "assessment") {
      return status.includes("assessment");
    }
    if (activeTab === "offering") {
      return status.includes("offer");
    }
    if (activeTab === "acceptance") {
      return status.includes("accept") || status === "hired";
    }
    if (activeTab === "reject") {
      return status.includes("reject");
    }
    return status === activeTab;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Filter Tabs */}
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 cursor-pointer rounded-full text-sm font-medium whitespace-nowrap transition-colors select-none ${
                isActive
                  ? "bg-primaryColor text-white shadow-xs"
                  : "bg-white border border-borderColor text-descriptionColor hover:bg-bgColor"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <SaveJobcardSkeleton />
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-borderColor p-12 text-center">
          <p className="text-sm sm:text-base text-red-500 font-medium mb-2">
            Failed to load job applications.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm text-primaryColor font-medium hover:underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-borderColor/80 p-12 text-center">
          <p className="text-base font-semibold text-headerColor mb-1">
            No Applications Found
          </p>
          <p className="text-sm text-descriptionColor">
            {activeTab === "all"
              ? "You haven't submitted any job applications yet."
              : `No applications found under the "${FILTER_TABS.find((t) => t.id === activeTab)?.label}" status.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApplications.map((item: any, idx: number) => (
            <SaveJobcard
              key={item?.id || item?.application_id || idx}
              job={item}
              showSaveButton={false}
              status={item?.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyJobApplicationsApply;
