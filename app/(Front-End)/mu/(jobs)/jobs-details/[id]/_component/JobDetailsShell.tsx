"use client";

import JobDetailsHeader from "@/app/(Front-End)/mu/(pro-industry)/_component/jobs/JobDetailsHeader";
import JobsDetailsPage from "@/app/(Front-End)/mu/(pro-industry)/_component/jobs/JobsDetailsPage";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import TopJobsRightbar from "../../../jobs/_component/TopJobsRightbar";

export default function JobDetailsShell({ id }: { id: string }) {
  const { data: userProfile } = useGetUserProfileQuery("user");
  const isIndustryUser = Boolean(
    userProfile?.subscription?.plan_type === "industry" ||
      userProfile?.industry?.company?.id ||
      userProfile?.industry?.has_company,
  );

  return (
    <div className="lg:grid lg:grid-cols-11 sm:pb-8 pb-6 gap-4 xl:gap-6 mb-10">
      {!isIndustryUser && (
        <div className="hidden lg:block col-span-3 xl:col-span-3 lg:sticky lg:top-24 self-start">
          <TopJobsRightbar excludeId={id} />
        </div>
      )}
      <div
        className={
          isIndustryUser
            ? "col-span-11"
            : "xl:col-span-8 lg:border-l lg:pl-4 xl:pl-6 border-borderColor lg:col-span-8 col-span-12"
        }
      >
        <JobDetailsHeader />
        <JobsDetailsPage id={id} />
      </div>
    </div>
  );
}
