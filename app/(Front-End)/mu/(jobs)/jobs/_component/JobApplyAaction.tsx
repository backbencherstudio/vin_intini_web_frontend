import ButtonReuseable from "@/components/reusable/CustomButton";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { cn } from "@/lib/utils";
import {
  Archive,
  CalendarClock,
  ClockAlert,
  Lock,
  PauseCircle,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import ApplyTypeModal from "./ApplyTypeModal";
export interface ApplyActionType {
  industry_name: string;
  jobTitle: string;
  jobId: string | number;
  industry_id: string | number;
  job_apply?: boolean;
  status?: string;
  is_own_industry?: boolean;
}

interface JobApplyAactionProps {
  jobData: ApplyActionType;
}

function JobApplyAaction({ jobData }: JobApplyAactionProps) {
  const [isApplying, setIsApplying] = useState(false);
  const { data } = useGetUserProfileQuery("");
  const planName = data?.subscription?.plan_type || "basic_user";
  const isPublished = jobData.status === "published";
  const hasApplied = Boolean(jobData.job_apply);
  const isPremiumUser = planName === "premium";
  const isBasicUser = planName === "basic_user";

  const renderApplyAction = () => {
    // 1. If candidate ALREADY applied, always show clean "Applied" confirmation
    if (hasApplied) {
      return (
        <ButtonReuseable
          title="Applied"
          disabled
          icon={<IoMdDoneAll className="w-4 h-4 text-emerald-600" />}
          className="px-5 font-semibold! py-2! rounded-full! disabled:bg-emerald-50! disabled:text-emerald-700! disabled:border-emerald-300! border cursor-not-allowed! text-sm!"
        />
      );
    }

    // 2. If candidate did NOT apply and job is closed / expired / archived
    if (!isPublished) {
      const s = jobData.status?.toLowerCase();
      let icon = <Archive className="w-4 h-4 shrink-0 text-slate-600" />;
      let label = "Archived • Applications Closed";
      let badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";

      if (s === "rejected") {
        icon = <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />;
        label = "Unlisted Listing";
        badgeStyle = "bg-red-50 text-red-700 border-red-200";
      } else if (s === "paused") {
        icon = <PauseCircle className="w-4 h-4 shrink-0 text-amber-600" />;
        label = "Applications Paused";
        badgeStyle = "bg-amber-50 text-amber-800 border-amber-300";
      } else if (s === "closed") {
        icon = <Lock className="w-4 h-4 shrink-0 text-gray-500" />;
        label = "Position Closed";
        badgeStyle = "bg-gray-100 text-gray-700 border-gray-300";
      } else if (s === "scheduled") {
        icon = <CalendarClock className="w-4 h-4 shrink-0 text-indigo-600" />;
        label = "Scheduled • Opening Soon";
        badgeStyle = "bg-indigo-50 text-indigo-700 border-indigo-200";
      } else if (s === "expired") {
        icon = <ClockAlert className="w-4 h-4 shrink-0 text-rose-500" />;
        label = "Deadline Passed";
        badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
      } else if (s === "archive" || s === "archived") {
        icon = <Archive className="w-4 h-4 shrink-0 text-slate-600" />;
        label = "Archived • Applications Closed";
        badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";
      }

      return (
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border select-none transition-all shadow-2xs",
            badgeStyle
          )}
        >
          {icon}
          <span>{label}</span>
        </div>
      );
    }

    if (isPremiumUser) {
      return (
        <ButtonReuseable
          title="Apply Now"
          onClick={() => setIsApplying(true)}
          className="px-5 font-semibold! py-2! rounded-full! hover:bg-primaryColor! hover:text-whiteColor! bg-white! text-primaryColor! border border-primaryColor text-sm!"
        />
      );
    }

    if (isBasicUser) {
      return (
        <Link
          href="/mu/subscription?plan_type=premium&billing=monthly"
          className="px-5 font-semibold! py-2! rounded-full! hover:bg-primaryColor! hover:text-whiteColor! bg-white! text-primaryColor! border border-primaryColor text-sm!"
        >
          Apply Now
        </Link>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
        {renderApplyAction()}
        <Link
          className="text-sm font-semibold text-primaryColor"
          href={
            jobData?.is_own_industry
              ? `/mu/industry-profile/${jobData?.industry_id}`
              : `/mu/industry/${jobData?.industry_id}`
          }
        >
          View Company
        </Link>
      </div>
      {isApplying && (
        <ApplyTypeModal
          open={isApplying}
          jobData={jobData}
          setOpen={setIsApplying}
        />
      )}
    </div>
  );
}

export default JobApplyAaction;
