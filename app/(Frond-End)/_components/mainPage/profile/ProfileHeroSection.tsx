"use client";
import { useGetProfileByIdQuery } from "@/feature/slice/user/userSlice";
import logoPreview from "@/public/empty_user.jpg";
import coverPreview from "@/public/images/cover imager.png";
import { EditeIcon, GroupUserIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useState } from "react";
import { MdWorkOutline } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import ProfileUpdateForm from "./ProfileUpdateForm";
import ProfileHeroSkeleton from "@/components/reusable/All Skleton/ProfileHeroSkeleton";

function ProfileHeroSection({ userId }: { userId: string }) {
  const [isNotify, setIsNotify] = useState(false);
  const { data, isLoading, isError } = useGetProfileByIdQuery(userId);
  const profileData = data?.data;
  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProfileHeroSkeleton />
      </div>
    );
  }
  return (
    <section>
      <div className=" h-40 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
        <Image
          src={profileData?.cover_image_url || coverPreview}
          className="w-full h-full object-cover rounded-md"
          alt="Cover"
          width={1200}
          height={400}
        />

        {/* Floating Logo Box */}
        <div className="flex px-4 justify-between w-full">
          <div className="-mt-11  h-20 w-20 bg-bgLightColor rounded-full flex items-center justify-center">
            <Image
              src={profileData?.profile_image_url || logoPreview}
              className="w-full rounded-full h-full object-cover "
              alt="Logo"
              width={80}
              height={80}
            />
          </div>
          <div className="flex gap-6 ">
            <button
              aria-label="notify-open"
              onClick={() => setIsNotify(true)}
              className="cursor-pointer"
            >
              <EditeIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 border-b border-borderColor pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="col-span-2">
            <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
              {profileData?.first_name + " " + profileData?.last_name ||
                "Vin Intini"}
            </h4>
            <p className="text-grayColor1 text-sm">
              {profileData?.title || "Software Engineer at Betopia Group"}
            </p>
            <p className="text-grayColor1 text-sm">
              {profileData?.country || ""}
            </p>
            <div className="flex items-center gap-2.5 mt-2 text-grayColor1">
              <GroupUserIcon />
              <p className="text-sm   line-clamp-3">
                {profileData?.total_connections || 0} Connection
              </p>
            </div>
          </div>
          <div className="space-y-3 col-span-1">
            <div className="flex items-center text-descriptionColor font-semibold gap-2">
              <MdWorkOutline size={22} />
              <p>
                {profileData?.experiences?.[0]?.title ||
                  "Software Engineer at Betopia Group"}
              </p>
            </div>
            <div className="flex items-center text-descriptionColor font-semibold gap-1.5">
              <PiStudent size={24} className="" />
              <p>
                {profileData?.educations?.[0]?.institution?.name ||
                  "Dhaka University"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isNotify && <ProfileUpdateForm open={isNotify} setOpen={setIsNotify} />}
    </section>
  );
}

export default ProfileHeroSection;
