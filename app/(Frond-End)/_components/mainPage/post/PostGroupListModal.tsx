"use client";

import { setSelectedGroupIds } from "@/feature/slice/postCompose/postComposeSlice";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type GroupItem = {
  id: number;
  name: string;
  subtitle: string;
};

const groupItems: GroupItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: "Figma Product Community",
  subtitle: "Public group",
}));

function FigmaMark() {
  return (
    <div className="relative h-10 w-10 shrink-0">
      <span className="absolute left-0 top-0 h-3.5 w-3.5 rounded-full bg-[#f24e1e]" />
      <span className="absolute left-3.5 top-0 h-3.5 w-3.5 rounded-full bg-[#ff7262]" />
      <span className="absolute left-0 top-3.5 h-3.5 w-3.5 rounded-full bg-[#a259ff]" />
      <span className="absolute left-3.5 top-3.5 h-3.5 w-3.5 rounded-full bg-[#1abcfe]" />
      <span className="absolute left-0 top-7 h-3.5 w-3.5 rounded-full bg-[#0acf83]" />
    </div>
  );
}

function PostGroupListModal({
  setPostType,
}: {
  setPostType: (type: string) => void;
}) {
  const [localSelectedGroupIds, setLocalSelectedGroupIds] = useState<number[]>([
    2, 3, 6,
  ]);
  const dispatch = useDispatch();
  const { selectedGroupIds } = useSelector((state: any) => state.postCompose);

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
    setPostType("Post_write");
  };

  return (
    <section className="bg-whiteColor">
      <div className="border-b border-borderColor px-4 py-3">
        <button
          type="button"
          onClick={() => setPostType("post_access")}
          className="text-lg leading-10 font-semibold text-descriptionColor"
        >
          Select a Group
        </button>
      </div>

      <div className="max-h-[510px] overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {groupItems.map((group) => {
            const isSelected = localSelectedGroupIds.includes(group.id);

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleToggleGroup(group.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md py-2 text-left"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-lg bg-[#f1f3f5]">
                    <FigmaMark />
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-lg leading-8 font-semibold text-descriptionColor">
                      {group.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-descriptionColor">
                      <GroupUserIcon className="h-4.5 w-4.5" />
                      <span className="text-[13px]">{group.subtitle}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? "border-buttonColor" : "border-grayColor1"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-buttonColor" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setPostType("Post_write")}
            className="rounded-md bg-bgLightColor px-4 py-2 text-descriptionColor hover:bg-grayColor2"
          >
            Back
          </button>
          <button
            onClick={handleSelectGroups}
            className="rounded-md bg-buttonColor cursor-pointer px-4 py-2 text-whiteColor hover:bg-buttonHover"
          >
            Done
          </button>
        </div>
      </div>
    </section>
  );
}

export default PostGroupListModal;
