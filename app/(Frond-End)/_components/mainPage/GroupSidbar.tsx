"use client";
import { GroupCardSkeleton } from "@/components/reusable/All Skleton/GroupCardSkeleton";
import ButtonReuseable from "@/components/reusable/CustomButton";
import Error from "@/components/reusable/Error";
import {
  useGetSuggestionGroupsQuery,
  useJoinGroupMutation,
} from "@/feature/slice/group/groupSlice";
import { GroupDetailType } from "@/lib/type";
import groupImage from "@/public/images/company-logo-1.png";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ImageIcon, Loader } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

function GroupSidbar() {
  const { data, isLoading, isError } = useGetSuggestionGroupsQuery("");
  const [joinGroup, { isLoading: isJoining }] = useJoinGroupMutation();
  const [isJoiningGroupId, setIsJoiningGroupId] = useState<number | null>(null);
  const groups: GroupDetailType[] = data?.data || [];
  if (isError) {
    return <Error />;
  }
  const handleJoinGroup = async (groupId: number) => {
    setIsJoiningGroupId(groupId);
    try {
      const response = await joinGroup({ group_id: groupId }).unwrap();
      toast.success(response.message || "Successfully joined the group!");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to join the group.");
    }
  };

  return (
    <aside className="rounded-md ">
      <h3 className="text-base lg:text-lg py-3 font-semibold text-headerColor">
        Groups you might be Interested
      </h3>

      <div className=" space-y-0">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <GroupCardSkeleton key={index} />
          ))}
        {groups.length > 0 &&
          groups.map((group: GroupDetailType) => (
            <div
              key={group.id}
              className="border-t border-borderColor py-4 first:pt-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex xl:h-18 xl:w-18 w-11 h-11 lg:w-14 lg:h-14 shrink-0 items-center justify-center rounded-md bg-bgColor text-[#70757f]">
                  {!group.logo_url ? (
                    <ImageIcon size={30} strokeWidth={1.8} />
                  ) : (
                    <Image
                      src={group.logo_url || groupImage}
                      alt="Group placeholder"
                      width={72}
                      height={72}
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-base lg:text-lg leading-[150%]  font-semibold text-headerColor">
                    {group.name}
                  </p>

                  <div className="mt-1.5 flex items-center gap-2 text-grayColor1">
                    <GroupUserIcon />
                    <span className="text-[13px] leading-5">
                      {group?.total_member} Group members
                    </span>
                  </div>
                </div>
              </div>

              <ButtonReuseable
                type="button"
                className={`py-0.5! px-4! border rounded-full! disabled:bg-bgColor!  disabled:py-1! disabled:text-descriptionColor! disabled:border-none! disabled:border-borderColor!  ${!group.id ? "border-primaryColor! bg-primaryColor! text-whiteColor!" : "border-headerColor!  text-headerColor! bg-whiteColor! hover:border-primaryColor!  hover:text-primaryColor! hover:bg-primaryColor/10!"} mt-4!`}
                title={!group.id ? "Joined" : "Join"}
                sendingMsg={<Loader size={20} className="animate-spin" />}
                onClick={() => handleJoinGroup(group.id)}
                disabled={isJoiningGroupId === group.id && isJoining}
                loading={isJoiningGroupId === group.id && isJoining}
              />
            </div>
          ))}
        {!isLoading && groups.length === 0 && (
          <div className="py-10 border border-dashed rounded-sm font-semibold border-primaryColor  text-center text-base text-primaryColor">
            No group suggestions available.
          </div>
        )}
      </div>
    </aside>
  );
}

export default GroupSidbar;
