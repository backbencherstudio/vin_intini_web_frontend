"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useRemoveRequestMutation,
  useRequestAcceptMutation,
  useSendRequestMutation,
} from "@/feature/slice/connect/connectSlice";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/feature/slice/connect/followSlice";
import { useStartConversationMutation } from "@/feature/slice/message/messageSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import {
  CrossUserIcon,
  FollowUserIcon,
  MessageIcon,
  PlusUserIcon,
  UnfollowUserIcon,
} from "@/public/svgIcons/Icons";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDone } from "react-icons/md";

function ProfileConnectionAction({ profileData, userId }: any) {
  const { data: myProfile } = useGetUserProfileQuery("profile");
  const isProIndustry =
    myProfile?.user?.tier === "pro_industry" || Boolean(myProfile?.industry);

  const [startConversation, { isLoading: isStartingConversation }] =
    useStartConversationMutation();

  const router = useRouter();
  const [sendRequest, { isLoading }] = useSendRequestMutation();
  const [removeConnection, { isLoading: isRemovingConnection }] =
    useRemoveRequestMutation();
  const [requestAccept, { isLoading: isAcceptingRequest }] =
    useRequestAcceptMutation();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [requestSentId, setRequestSentId] = useState();

  // Optimistic follow status to prevent UI flickering or stale state
  const [localIsFollowing, setLocalIsFollowing] = useState<boolean | null>(null);

  const isFollowing =
    localIsFollowing !== null
      ? localIsFollowing
      : Boolean(profileData?.connection_status?.is_following);

  useEffect(() => {
    if (profileData?.connection_status?.is_following !== undefined) {
      setLocalIsFollowing(Boolean(profileData?.connection_status?.is_following));
    }
  }, [profileData?.connection_status?.is_following]);

  const connectionActions = [
    { value: "remove", label: "Remove", icon: <CrossUserIcon /> },
    { value: "follow", label: "Follow", icon: <FollowUserIcon /> },
    { value: "unfollow", label: "Unfollow", icon: <UnfollowUserIcon /> },
  ];

  const filterFollowUnfollow = connectionActions.filter((action) =>
    isFollowing ? action.value !== "follow" : action.value !== "unfollow",
  );

  const handleConnect = async (id: any) => {
    const payload = {
      user_id: profileData?.id,
    };

    try {
      const result = await sendRequest({ payload }).unwrap();
      setRequestSentId(id);
      toast.success(result.message || "Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request.");
    }
  };

  const handleMessageCreate = async () => {
    try {
      const response = await startConversation(profileData?.id).unwrap();
      router.push(`/mu/message/${response.data.id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to start conversation.");
    }
  };

  const handleConnectionAction = async (action: string) => {
    const targetUserId = userId || profileData?.id;
    try {
      if (action === "remove") {
        await removeConnection({ id: targetUserId }).unwrap();
        toast.success("Connection removed successfully!");
      } else if (action === "accept") {
        await requestAccept({
          id: profileData?.connection_status?.pending_request_id,
        }).unwrap();
        toast.success("Connection request accepted!");
      } else if (action === "follow") {
        setLocalIsFollowing(true);
        await followUser({ userId: targetUserId }).unwrap();
        toast.success("Followed successfully!");
      } else if (action === "unfollow") {
        setLocalIsFollowing(false);
        await unfollowUser({ userId: targetUserId }).unwrap();
        toast.success("Unfollowed successfully!");
      }
    } catch (error: any) {
      setLocalIsFollowing(Boolean(profileData?.connection_status?.is_following));
      toast.error(error?.data?.message || "Action failed. Try again.");
    }
  };

  return (
    <div>
      {!profileData?.is_own_profile && (
        <div className="flex items-center gap-4">
          {profileData?.connection_status?.action_label === "Connected" && (
            <div className="flex items-center gap-4">
              <ButtonReuseable
                onClick={handleMessageCreate}
                icon={
                  <MessageIcon className="w-4.5 h-4.5 mt-1 text-whiteColor" />
                }
                title="Message"
                className="cursor-pointer py-2! text-whiteColor rounded-md bg-primaryColor hover:bg-primaryColor/90 transition-all duration-200 disabled:cursor-not-allowed hover:shadow-lg disabled:opacity-70 disabled:bg-bgColor"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10.25 items-center justify-between gap-2.5 rounded-md border border-borderColor bg-white px-3.5 py-2 text-sm font-medium text-headerColor transition-colors hover:bg-gray-50 focus:outline-hidden cursor-pointer shadow-2xs"
                  >
                    <span>Connected</span>
                    <ChevronDown className="h-4 w-4 text-grayColor1 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 bg-white p-1 border border-borderColor shadow-md"
                >
                  {filterFollowUnfollow.map((action) => (
                    <DropdownMenuItem
                      key={action.value}
                      onClick={() => handleConnectionAction(action.value)}
                      className="flex items-center gap-2 px-2.5 py-2 text-sm text-headerColor cursor-pointer hover:bg-[#EEF2F6] rounded-sm transition-colors"
                    >
                      <span className="shrink-0">{action.icon}</span>
                      <span>{action.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {profileData?.connection_status?.state === "pending_sent" && (
            <div className="flex items-center gap-4">
              <ButtonReuseable
                title={"Request Sent"}
                icon={<PlusUserIcon />}
                disabled={false}
                loading={false}
                className="bg-bgColor! text-descriptionColor! py-2!"
              />
              <ButtonReuseable
                title={"Cancel"}
                sendingMsg={"Cancel"}
                loading={isRemovingConnection}
                onClick={() => handleConnectionAction("remove")}
                className=" bg-whiteColor!   text-blackColor! border py-2!"
              />
              {isProIndustry && (
                <ButtonReuseable
                  onClick={handleMessageCreate}
                  icon={
                    <MessageIcon className="w-4.5 h-4.5 mt-1 text-whiteColor" />
                  }
                  title="Direct Message"
                  className="cursor-pointer py-2! text-whiteColor rounded-md bg-primaryColor hover:bg-primaryColor/90 transition-all duration-200 shadow-xs"
                />
              )}
            </div>
          )}
          {profileData?.connection_status?.state === "pending_received" && (
            <div className="flex items-center gap-4">
              <ButtonReuseable
                icon={<MdDone />}
                title={profileData?.connection_status?.action_label || "Accept"}
                onClick={() => handleConnectionAction("accept")}
                className="bg-primaryColor! py-2!"
              />
              <ButtonReuseable
                title="Ignore"
                onClick={() => handleConnectionAction("remove")}
                className="bg-bgColor! text-descriptionColor! py-2!"
              />
              {isProIndustry && (
                <ButtonReuseable
                  onClick={handleMessageCreate}
                  icon={
                    <MessageIcon className="w-4.5 h-4.5 mt-1 text-whiteColor" />
                  }
                  title="Direct Message"
                  className="cursor-pointer py-2! text-whiteColor rounded-md bg-primaryColor hover:bg-primaryColor/90 transition-all duration-200 shadow-xs"
                />
              )}
            </div>
          )}
          {profileData?.connection_status?.state === "not_connected" && (
            <div className="flex items-center gap-2">
              <ButtonReuseable
                title={profileData?.connection_status?.action_label || "Connect"}
                icon={<PlusUserIcon />}
                onClick={() => handleConnect(userId)}
                className="bg-primaryColor! py-2!"
              />
              {isProIndustry && (
                <ButtonReuseable
                  onClick={handleMessageCreate}
                  icon={
                    <MessageIcon className="w-4.5 h-4.5 mt-1 text-whiteColor" />
                  }
                  title="Direct Message"
                  className="cursor-pointer py-2! text-whiteColor rounded-md bg-primaryColor hover:bg-primaryColor/90 transition-all duration-200 shadow-xs"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileConnectionAction;
