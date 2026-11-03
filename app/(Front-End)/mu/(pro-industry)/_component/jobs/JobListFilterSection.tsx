"use client";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import Search from "@/components/reusable/Search";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineArchiveBoxArrowDown } from "react-icons/hi2";

function JobListFilterSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Status param from URL (defaults to "all")
  const currentStatusParam = searchParams.get("status") || "all";
  const getFilterStyle = (status: string) => {
    switch (status) {
      case "active":
      case "published":
        return "bg-[#E6F8F6] text-[#009dae] border-[#b2e7e2]";
      case "archive":
      case "archived":
        return "bg-[#FEF6E6] text-[#d97706] border-[#fde68a]";
      case "expired":
        return "bg-[#FEECEC] text-[#eb3d4d] border-[#fecaca]";
      case "rejected":
        return "bg-[#fee2e2] text-[#ef4444] border-[#fecaca]";
      default:
        return "bg-white text-headerColor border-borderColor";
    }
  };
  // Helper to update any URL search parameter
  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "current_page" && params.has("current_page")) {
      params.set("current_page", "1");
    }
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };
  const activeJobsPage = pathname === "/mu/job-listing";
  return (
    <div>
      {" "}
      <div className="flex flex-col justify-between w-full  xl:flex-row xl:items-center  gap-4 mb-6 md:mb-8">
        <div className="max-w-70 w-full">
          <h1 className="text-xl md:text-2xl font-bold text-headerColor">
            {activeJobsPage ? "" : "Archived"} Job Listings
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Manage your job postings and track performance.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap w-full xl:justify-end items-center gap-2 sm:gap-3">
          <div className="md:max-w-60 w-full">
            <Search
              placeHolder="Search jobs..."
              className="w-full h-10"
            />
          </div>

          {activeJobsPage ? (
            <Link
              href={`/mu/job-listing/archive-jobs`}
              type="button"
              className="h-10 px-3.5 rounded-lg border border-borderColor bg-white hover:bg-gray-50 text-headerColor text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98"
            >
              <HiOutlineArchiveBoxArrowDown className="w-4 h-4 text-gray-500" />
              <span>Archive</span>
            </Link>
          ) : (
            <Link
              href={`/mu/job-listing`}
              type="button"
              className="h-10 px-3.5 rounded-lg border border-borderColor bg-white hover:bg-gray-50 text-headerColor text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500" />
              <span>Active Jobs</span>
            </Link>
          )}
          {activeJobsPage && (
            <div className="w-32">
              <SelecteInputField
                value={currentStatusParam}
                onChange={(val) => updateUrlParam("status", val)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "archive", label: "Archive" },
                  { value: "expired", label: "Expired" },
                  { value: "rejected", label: "Rejected" },
                ]}
                className={`h-10! text-sm font-medium rounded-lg shadow-none border ${getFilterStyle(currentStatusParam)}`}
              />
            </div>
          )}
          <Link
            href={`/mu/post-job-position`}
            type="button"
            className="h-10 bg-primaryColor hover:bg-primaryColor/90 text-white px-3.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobListFilterSection;
