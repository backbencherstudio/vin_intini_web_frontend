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
import { Globe, Loader2, Lock, Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
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
      <div className=" h-40 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
        {isLoading ? (
          <Skeleton className="w-full h-full bg-gray-200" />
        ) : (
          <Image
            src={groupData?.cover_photo_url || coverPreview}
            className="w-full h-full object-cover rounded-md"
            alt="Cover"
            width={1200}
            height={400}
            style={{
              objectPosition: `${positionX}% ${positionY}%`,
            }}
          />
        )}

        {/* Floating Logo Box */}
        <div className="flex px-4 justify-between w-full">
          <div className="-mt-11  h-20 w-20 bg-bgLightColor rounded-md flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="w-full h-full bg-gray-200" />
            ) : (
              <Image
                src={groupData?.logo_url || logoPreview}
                className="w-full h-full object-cover rounded-md"
                alt="Logo"
                width={80}
                height={80}
              />
            )}
          </div>
          {data?.data?.is_current_user_member && (
            <div className="flex gap-6 ">
              <button
                aria-label="notify-open"
                onClick={() => setIsNotify(true)}
                className="cursor-pointer"
              >
                <NotificationIcon />
              </button>
              {!IsAdmin ? (
                <button
                  aria-label="leave-group"
                  title="Leave Group"
                  onClick={() => setILeaved(true)}
                  className="cursor-pointer text-red-500 flex items-center justify-center"
                >
                  <LogoutIcon className="text-red-500" />
                </button>
              ) : (
                <button
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
      <div className="mt-12 border-b border-borderColor pb-5">
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
