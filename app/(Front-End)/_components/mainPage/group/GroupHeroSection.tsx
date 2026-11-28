"use client";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useGetViewByIdGroupQuery,
  useJoinGroupMutation,
} from "@/feature/slice/group/groupSlice";
import logoPreview from "@/public/images/company-logo-1.png";
import coverPreview from "@/public/images/cover imager.png";
import {
  GroupUserIcon,
  LogoutIcon,
  NotificationIcon,
} from "@/public/svgIcons/Icons";

import Error from "@/components/reusable/Error";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { Expand, Globe, Loader2, Lock, Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import ProfilePhotoViewerDialog, {
  ProfilePhotoMode,
} from "../profile/ProfilePhotoViewerDialog";
import CreateGroupForm from "./GroupCreateModal";
import GroupLeaveDialog from "./GroupLeaveDialog";
import GroupNotifySetting from "./GroupNotifySetting";

interface GroupHeroSectionProps {
  groupId: string;
  activeTab?: "post" | "about";
  setActiveTab?: (tab: "post" | "about") => void;
}

function GroupHeroSection({
  groupId,
  activeTab = "post",
  setActiveTab,
}: GroupHeroSectionProps) {
  const [isleaved, setILeaved] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const [positionY, setPositionY] = useState(35);
  const [positionX, setPositionX] = useState(50);
  const [isEdite, setIsEdite] = useState(false);
  const [photoViewerMode, setPhotoViewerMode] =
    useState<ProfilePhotoMode | null>(null);
  const { data, isLoading, isError } = useGetViewByIdGroupQuery({
    id: groupId,
  });
  const [joinGroupMutation, { isLoading: isJoining }] = useJoinGroupMutation();
  const { data: myData } = useGetUserProfileQuery("me");
  const groupData = data?.data?.group;

  const isMember = Boolean(data?.data?.is_current_user_member);
  const IsAdmin =
    Boolean(data?.data?.is_current_user_admin) ||
    groupData?.creator?.id === myData?.user?.id;
  const isPrivate = groupData?.type === "private";
  const displayName = groupData?.name || "Group Name";

  const handleJoinGroup = async () => {
    if (!groupId || isJoining || isPrivate) return;
    try {
      const res = await joinGroupMutation({
        group_id: Number(groupId),
      }).unwrap();
      toast.success(
        res?.message || res?.data?.message || "Joined group successfully!",
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to join group.",
      );
    }
  };

  if (isError) {
    return <Error />;
  }

  return (
    <section>
      <div className="relative h-36 sm:h-44 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
        {isLoading ? (
          <Skeleton className="w-full h-full bg-gray-200 rounded-md" />
        ) : (
          <button
            type="button"
            onClick={() => setPhotoViewerMode("cover")}
            aria-label="View cover photo"
            className="group relative block w-full h-full rounded-md overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor"
          >
            <Image
              src={groupData?.cover_photo_url || coverPreview}
              unoptimized={Boolean(groupData?.cover_photo_url)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              alt={`${displayName} cover photo`}
              width={1200}
              height={400}
              style={{
                objectPosition: `${positionX}% ${positionY}%`,
              }}
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/15" />
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
              <Expand className="h-3.5 w-3.5" />
              View cover
            </span>
          </button>
        )}

        {/* Floating Logo Box */}
        <div className="flex px-3 sm:px-4 justify-between items-start gap-2 w-full">
          <div className="-mt-10 sm:-mt-12 relative z-10 border-2 sm:border-[3px] border-white h-20 w-20 sm:h-24 sm:w-24 bg-bgLightColor rounded-md shadow-sm flex items-center justify-center shrink-0">
            {isLoading ? (
              <Skeleton className="w-full h-full bg-gray-200 rounded-md" />
            ) : (
              <button
                type="button"
                onClick={() => setPhotoViewerMode("profile")}
                aria-label="View group logo"
                className="group relative w-full h-full rounded-md overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor"
              >
                <Image
                  src={groupData?.logo_url || logoPreview}
                  unoptimized={Boolean(groupData?.logo_url)}
                  className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-90"
                  alt={`${displayName} logo`}
                  width={96}
                  height={96}
                />
              </button>
            )}
          </div>
          {data?.data?.is_current_user_member && (
            <div className="flex items-center gap-4 sm:gap-6 pt-2">
              <button
                type="button"
                aria-label="notify-open"
                onClick={() => setIsNotify(true)}
                className="cursor-pointer"
              >
                <NotificationIcon />
              </button>
              {!IsAdmin ? (
                <button
                  type="button"
                  aria-label="leave-group"
                  title="Leave Group"
                  onClick={() => setILeaved(true)}
                  className="cursor-pointer text-red-500 flex items-center justify-center"
                >
                  <LogoutIcon className="text-red-500" />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="edit-group"
                  title="Edit Group"
                  onClick={() => setIsEdite(true)}
                  className="cursor-pointer text-descriptionColor hover:text-primaryColor transition-colors flex items-center justify-center"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-13 sm:mt-15 border-b border-borderColor pb-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full bg-gray-200" />
            <Skeleton className="h-4 w-[70%] bg-gray-200" />
            <Skeleton className="h-4 w-[35%] bg-gray-200" />
            <Skeleton className="h-4 w-[25%] bg-gray-200" />
            <Skeleton className="h-9 w-32 rounded-full bg-gray-200 mt-2" />
          </div>
        ) : (
          <>
            <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
              {groupData?.name || "Group Name"}
            </h4>
            <p className="text-sm md:text-base text-descriptionColor leading-[160%] line-clamp-2">
              {groupData?.description || "No description available."}
            </p>
            <div className="flex items-center gap-2.5 mt-2 text-grayColor1">
              <GroupUserIcon />
              <p className="text-sm">
                {groupData?.members_count || 0} members
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1.5 text-grayColor1 text-sm">
              {isPrivate ? (
                <Lock className="w-4 h-4 text-grayColor1" />
              ) : (
                <Globe className="w-4 h-4 text-grayColor1" />
              )}
              <span>{isPrivate ? "Private Group" : "Public Group"}</span>
            </div>

            {/* Navigation Tabs (Post & About) and Group Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {/* Post & About Tabs */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab?.("post")}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold cursor-pointer ${
                    activeTab === "post"
                      ? "bg-primaryColor text-white"
                      : "bg-white border border-borderColor text-descriptionColor hover:text-headerColor hover:bg-slate-50"
                  }`}
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab?.("about")}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold cursor-pointer ${
                    activeTab === "about"
                      ? "bg-primaryColor text-white"
                      : "bg-white border border-borderColor text-descriptionColor hover:text-headerColor hover:bg-slate-50"
                  }`}
                >
                  About
                </button>
              </div>

              {/* Join Group for non-members */}
              {!isMember && (
                isPrivate ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <button
                      type="button"
                      disabled
                      title="This is a private group. Joining requires an invitation from a member."
                      className="inline-flex items-center justify-center gap-2 px-5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-400 text-sm font-medium cursor-not-allowed shadow-none w-fit"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Join Group</span>
                    </button>

                    <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md px-2.5 py-1 w-fit">
                      Private group &bull; Joining is only possible via invitation.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleJoinGroup}
                    disabled={isJoining}
                    className="inline-flex items-center justify-center gap-2 px-6 py-1.5 rounded-full bg-primaryColor hover:bg-[#008c99] text-white text-sm font-semibold shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed w-fit"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <span>Join Group</span>
                    )}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
      {photoViewerMode !== null && !isLoading && (
        <ProfilePhotoViewerDialog
          open={photoViewerMode !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setPhotoViewerMode(null);
          }}
          mode={photoViewerMode}
          onModeChange={setPhotoViewerMode}
          userName={displayName}
          profileSrc={groupData?.logo_url || logoPreview}
          coverSrc={groupData?.cover_photo_url || coverPreview}
          hasCustomProfile={Boolean(groupData?.logo_url)}
          hasCustomCover={Boolean(groupData?.cover_photo_url)}
          profileLabel="Group Logo"
          coverLabel="Cover Photo"
        />
      )}
      {isEdite && (
        <CreateGroupForm
          open={isEdite}
          setOpen={setIsEdite}
          groupData={groupData}
        />
      )}
      <RootDialog
        open={isleaved || isNotify}
        setOpen={isleaved ? setILeaved : setIsNotify}
        className=" max-w-150!"
      >
        {isleaved ? (
          <GroupLeaveDialog
            groupId={groupId}
            setIsNotify={setILeaved}
            redirectOnLeave={false}
          />
        ) : (
          <GroupNotifySetting
            groupId={groupId}
            groupNotification={data?.data?.notification_status}
            setIsNotify={setIsNotify}
          />
        )}
      </RootDialog>
    </section>
  );
}

export default GroupHeroSection;
