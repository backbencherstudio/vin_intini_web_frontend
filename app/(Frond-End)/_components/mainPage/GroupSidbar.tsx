"use client";
import { GroupCardSkeleton } from "@/components/reusable/All Skleton/GroupCardSkeleton";
import ButtonReuseable from "@/components/reusable/CustomButton";
import { useGetSuggestionGroupsQuery } from "@/feature/slice/group/groupSlice";
import { GroupType } from "@/lib/type";
import groupImage from "@/public/images/company-logo-1.png";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

function GroupSidbar() {
  const { data, isLoading, isError } = useGetSuggestionGroupsQuery("");

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
        {data?.data.map((group: GroupType) => (
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
              className={`py-0.5! px-4! border rounded-full!  ${!group.id ? "border-primaryColor! bg-primaryColor! text-whiteColor!" : "border-headerColor!  text-headerColor! bg-whiteColor! hover:border-primaryColor! hover:text-primaryColor! hover:bg-primaryColor/10!"} mt-4!`}
              title={!group.id ? "Joined" : "Join"}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}

export default GroupSidbar;
