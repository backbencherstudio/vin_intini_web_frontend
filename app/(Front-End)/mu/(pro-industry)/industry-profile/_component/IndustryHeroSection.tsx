"use client";
import ProfilePhotoViewerDialog, {
  ProfilePhotoMode,
} from "@/app/(Front-End)/_components/mainPage/profile/ProfilePhotoViewerDialog";
import ProfileHeroSkeleton from "@/components/reusable/All Skleton/ProfileHeroSkeleton";
import { useGetCompanyQuery } from "@/feature/slice/companySlice";
import logoPreview from "@/public/empty_user.jpg";
import coverPreview from "@/public/images/cover imager.png";
import {
  CompanyIcon,
  GlobalIcon,
  GroupUserIcon,
  MessageIcon,
  PencileIcon,
} from "@/public/svgIcons/Icons";
import { Expand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GrLocation } from "react-icons/gr";
import { HiOutlineUsers } from "react-icons/hi2";
import { IoPricetagsOutline } from "react-icons/io5";
import RelatedIndustryFollowButton from "../../_component/RelatedIndustryFollowButton";
import IndustryMessageModal from "./IndustryMessageModal";
function IndustryHeroSection({ userId }: { userId?: string }) {
  const UId = userId;
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [photoViewerMode, setPhotoViewerMode] =
    useState<ProfilePhotoMode | null>(null);
  const { data, isLoading } = useGetCompanyQuery(UId, {
    skip: !UId,
  });
  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProfileHeroSkeleton />
      </div>
    );
  }
  const industryData = data?.data;
  const displayName = industryData?.name || "MindUnite Industry";

  return (
    <div>
      <section>
        <div className="relative h-36 sm:h-44 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
          <button
            type="button"
            onClick={() => setPhotoViewerMode("cover")}
            aria-label="View cover photo"
            className="group relative block w-full h-full rounded-md overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor"
          >
            <Image
              src={industryData?.cover_image || coverPreview}
              unoptimized={Boolean(industryData?.cover_image)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              alt={`${displayName} cover photo`}
              width={1200}
              height={400}
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/15" />
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
              <Expand className="h-3.5 w-3.5" />
              View cover
            </span>
          </button>

          {/* Floating Logo Box */}
          <div className="flex px-3 sm:px-4 justify-between items-start gap-2 w-full">
            <div className="-mt-10 sm:-mt-12 relative z-10 border-2 sm:border-[3px] border-white h-20 w-20 sm:h-24 sm:w-24 bg-bgLightColor rounded-full shadow-sm flex items-center justify-center shrink-0">
              <button
                type="button"
                onClick={() => setPhotoViewerMode("profile")}
                aria-label="View company logo"
                className="group relative w-full h-full rounded-full overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor"
              >
                <Image
                  src={industryData?.logo || logoPreview}
                  unoptimized={Boolean(industryData?.logo)}
                  className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-90"
                  alt={`${displayName} logo`}
                  width={96}
                  height={96}
                />
              </button>
            </div>
            {industryData?.is_owner ? (
              <div className="flex gap-6 mt-4">
                <Link
                  href={`/mu/create-company-page/${UId}`}
                  aria-label="notify-open"
                  className="cursor-pointer"
                >
                  <PencileIcon />
                </Link>
              </div>
            ) : (
              <div className="min-h-10 flex flex-wrap items-center gap-2 sm:gap-2.5 mt-2">
                <RelatedIndustryFollowButton
                  industryId={UId}
                  initialFollowing={Boolean(industryData?.is_following)}
                />
                {Boolean(industryData?.has_conversation) && (
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-md bg-primaryColor hover:bg-primaryColor/90 text-white text-xs md:text-sm font-medium transition cursor-pointer shadow-xs"
                  >
                    <MessageIcon className="w-4 h-4 fill-white" />
                    <span>Message</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <IndustryMessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          industryId={UId!}
          industryData={industryData}
        />
        {photoViewerMode !== null && (
          <ProfilePhotoViewerDialog
            open={photoViewerMode !== null}
            onOpenChange={(isOpen) => {
              if (!isOpen) setPhotoViewerMode(null);
            }}
            mode={photoViewerMode}
            onModeChange={setPhotoViewerMode}
            userName={displayName}
            profileSrc={industryData?.logo || logoPreview}
            coverSrc={industryData?.cover_image || coverPreview}
            hasCustomProfile={Boolean(industryData?.logo)}
            hasCustomCover={Boolean(industryData?.cover_image)}
            profileLabel="Company Logo"
            coverLabel="Cover Photo"
          />
        )}
        <div className="mt-13 sm:mt-15 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
                {displayName}
              </h4>

              <div className="flex items-center gap-2.5 my-2 text-grayColor1 ">
                <GlobalIcon className="w-4 h-4" />
                <Link href={industryData?.website || ""} target="_blank" rel="noopener noreferrer" className="text-sm underline hover:text-primaryColor  line-clamp-3">
                  {industryData?.website || ""}
                </Link>
              </div>
              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <IoPricetagsOutline className="w-4 h-4" />
                <p className="text-sm   line-clamp-3">
                  {industryData?.tagline || ""}
                </p>
              </div>
              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <CompanyIcon className="w-4 h-4" />
                <p className="text-sm  uppercase line-clamp-3">
                  {industryData?.industry || ""}
                </p>
              </div>
              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <GrLocation className="w-4 h-4" />
                <p className="text-sm   line-clamp-3">
                  {industryData?.address || ""}
                </p>
              </div>
              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <GroupUserIcon />
                <p className="text-sm   line-clamp-3">
                  {industryData?.company_size || 0} Employees
                </p>
              </div>
              <div className="flex items-center gap-2.5 my-2 text-grayColor1">
                <HiOutlineUsers className="h-4 w-4" />
                <p className="text-sm line-clamp-3">
                  {Number(
                    industryData?.followers_count ??
                      industryData?.total_followers ??
                      0,
                  ).toLocaleString()} Followers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default IndustryHeroSection;
