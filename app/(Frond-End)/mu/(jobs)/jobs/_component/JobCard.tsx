"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { userJobType } from "@/lib/type";
import Image from "next/image";
import { memo } from "react";
import { FiBookmark } from "react-icons/fi";
import { HiOutlineCheckBadge } from "react-icons/hi2";

export const JobCard = memo(({ job }: { job: userJobType }) => {
  return (
    <div className="py-5 first:pt-0 w-full  flex gap-3 last:pb-0 ">
      <div className="relative hidden md:block w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
        <Image
          src={job?.company?.logo}
          alt={job?.company?.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className=" flex-1">
        <div className="flex items-start w-full justify-between gap-3.5">
          <div className="relative md:hidden w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
            <Image
              src={job?.company?.logo}
              alt={job?.company?.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-headerColor text-sm sm:text-base leading-snug hover:text-primaryColor cursor-pointer">
              {job?.job_title} - Job ID: {job?.job_id}
            </h3>

            <HiOutlineCheckBadge className="text-primaryColor text-base shrink-0" />
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primaryColor/20 text-primaryColor">
            {job?.work_mode}
          </span>
        </div>
        <div className="">
          <div className="space-y-1">
            <p className="text-xs text-grayColor1">{job?.company?.name}</p>

            <p className="text-sm text-grayColor1 flex items-center gap-1 flex-wrap pt-1">
              <span>{job?.location}</span>
              <span>•</span>
              <span>{job?.created_at_human}</span>
              {job?.is_applied && (
                <>
                  <span>•</span>
                  <span>Easy Apply</span>
                </>
              )}
            </p>

            {/* <p className="text-base text-primaryColor font-medium pt-1">
              Your profile matches this job
            </p> */}
          </div>

          <div className="gap-3 flex justify-between items-center mt-3 h-full ">
            <div className="">
              <ButtonReuseable
                title="Apply Now"
                className="px-5 py-2! rounded-full! hover:bg-primaryColor! hover:text-whiteColor! bg-white! text-primaryColor! border border-primaryColor  text-sm!"
              />
            </div>
            <div className="flex items-end gap-3 text-sm  ">
              <p className="text-headerColor">
                {job?.applications_count} applied
              </p>
              <button
                type="button"
                aria-label={`Save ${job.job_title}`}
                className="flex-col text-grayColor1 justify-center items-center cursor-pointer gap-1 hover:text-primaryColor transition-colors"
              >
                <FiBookmark className="w-7 h-6" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

JobCard.displayName = "JobCard";
