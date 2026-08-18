"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import {
  useRemoveRequestMutation,
  useSendRequestMutation,
} from "@/feature/slice/connect/connectSlice";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/feature/slice/connect/followSlice";
import { useStartConversationMutation } from "@/feature/slice/message/messageSlice";
import { MessageIcon, PlusUserIcon } from "@/public/svgIcons/Icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function ProfileConnectionAction({ profileData, userId }) {
  const { user } = profileData || {};
  console.log(profileData?.id, "user=====");

  const [selectedAction, setSelectedAction] = useState("");
  const [startConversation, { isLoading: isStartingConversation }] =
    useStartConversationMutation();

  const router = useRouter();
  const [sendRequest, { isLoading }] = useSendRequestMutation();
  const [removeConnection] = useRemoveRequestMutation();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [requestSentId, setRequestSentId] = useState();

  const connectionActions = [
    { value: "remove", label: "Remove Connection" },
    { value: "follow", label: "Follow" },
    { value: "unfollow", label: "Unfollow" },
  ];

  const handleConnect = async (id) => {
    console.log("ksdjflk;asdfkas;lfkd", id);

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
    try {
      if (action === "remove") {
        await removeConnection({ id: userId }).unwrap();
        toast.success("Connection removed successfully!");
      } else if (action === "follow") {
        await followUser({ userId }).unwrap();
        toast.success("Followed successfully!");
      } else if (action === "unfollow") {
        await unfollowUser({ userId }).unwrap();
        toast.success("Unfollowed successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Action failed. Try again.");
    } finally {
      setSelectedAction("");
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
              <SelecteInputField
                value={selectedAction}
                onValueChange={handleConnectionAction}
                options={connectionActions}
                placeholder="Connection Actions"
                className="h-10.25! min-w-45 w-full"
              />
            </div>
          )}
          {profileData?.connection_status?.action_label === "Connect" && (
            <ButtonReuseable
              title={profileData?.connection_status?.action_label || "Connect"}
              icon={<PlusUserIcon />}
              onClick={() => handleConnect(userId)}
              className="bg-primaryColor! py-2!"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileConnectionAction;
