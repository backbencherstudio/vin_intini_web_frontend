"use client";

import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { useGetGroupListQuery } from "@/feature/slice/post/postSlice";
import {
  setPostVisibility,
  setSelectedGroupIds,
} from "@/feature/slice/postCompose/postComposeSlice";
import groupImage from "@/public/images/company-logo-1.png";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ArrowLeft, Check, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function PostGroupListModal({
  setPostType,
}: {
  setPostType: (type: string) => void;
  postData?: any;
}) {
  const { selectedGroupIds = [] } = useSelector(
    (state: any) => state.postCompose,
  );
  const [localSelectedGroupIds, setLocalSelectedGroupIds] =
    useState<number[]>(selectedGroupIds);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetGroupListQuery("groupList");

  useEffect(() => {
    setLocalSelectedGroupIds(selectedGroupIds || []);
  }, [selectedGroupIds]);

  const groups = data?.data || [];
  const handleToggleGroup = (id: number) => {
    setLocalSelectedGroupIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((groupId) => groupId !== id);
      }
      return [...previous, id];
    });
  };

  const handleSelectGroups = () => {
    dispatch(setSelectedGroupIds(localSelectedGroupIds));
    if (localSelectedGroupIds.length === 0) {
      dispatch(setPostVisibility("public"));
    } else {
      dispatch(setPostVisibility("group"));
    }
    setPostType("Post_write");
  };

  const handleBack = () => {
    if (selectedGroupIds.length === 0) {
      dispatch(setPostVisibility("public"));
    }
    setPostType("post_access");
  };

  return (
    <section className="flex flex-col max-h-[85dvh] py-4">
      <div className="flex items-center gap-2 border-b border-borderColor px-4 pb-3 pr-12">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to post settings"
          className="rounded-full p-1.5 text-descriptionColor hover:bg-gray-100 transition cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-headerColor">
            Select Groups
          </h3>
          <p className="text-xs text-grayColor1">
            Choose one or more groups to share your post
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2">
          {isLoading ? (
            <div>
              {Array.from({ length: 5 }).map((_, index) => (
                <GroupSkleton key={`gorup-${index}`} />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="py-10 text-center text-sm text-grayColor1">
              You haven&apos;t joined any groups yet.
            </div>
          ) : (
            groups.map((group: any) => {
              const isSelected = localSelectedGroupIds.includes(group.id);

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => handleToggleGroup(group.id)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border p-2.5 text-left transition ${
                    isSelected
                      ? "border-primaryColor/50 bg-primaryColor/5"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-borderColor/60 bg-bgColor text-[#70757f]">
                      {!group.logo_url ? (
                        <ImageIcon size={22} strokeWidth={1.8} />
                      ) : (
                        <Image
                          src={group.logo_url || groupImage}
                          alt={group.name || "Group"}
                          width={72}
                          height={72}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm sm:text-base font-semibold text-headerColor">
                        {group.name}
                      </h4>
                      {group.subtitle && (
                        <div className="mt-0.5 flex items-center gap-1.5 text-descriptionColor">
                          <GroupUserIcon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate text-xs">
                            {group.subtitle}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      isSelected
                        ? "border-primaryColor bg-primaryColor text-white"
                        : "border-grayColor1"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-borderColor px-4 pt-3.5 gap-3">
        <span className="text-xs font-medium text-grayColor1">
          {localSelectedGroupIds.length > 0
            ? `${localSelectedGroupIds.length} group${localSelectedGroupIds.length > 1 ? "s" : ""} selected`
            : "No group selected"}
        </span>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full bg-bgLightColor cursor-pointer px-4 py-1.5 text-sm font-medium text-descriptionColor hover:bg-grayColor2 transition"
          >
            Back
          </button>
          <button
            type="button"
            disabled={localSelectedGroupIds.length === 0}
            onClick={handleSelectGroups}
            className="rounded-full bg-buttonColor cursor-pointer px-5 py-1.5 text-sm font-semibold text-whiteColor hover:bg-buttonHover disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 transition"
          >
            Done
          </button>
        </div>
      </div>
    </section>
  );
}

export default PostGroupListModal;
