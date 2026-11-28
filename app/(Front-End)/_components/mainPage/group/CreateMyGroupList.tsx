"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import { useGetMyCreatedGroupsQuery } from "@/feature/slice/group/groupSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { GroupDetailType } from "@/lib/type";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import GroupCard from "./GroupCard";
import CreateGroupForm from "./GroupCreateModal";

function CreateMyGroupList() {
  const params = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();

  const queryParams = useMemo(
    () => (searchQuery ? { search: searchQuery } : {}),
    [searchQuery],
  );

  const {
    items: combinedData,
    isInitialLoading,
    isFetchingMore,
    hasMore,
    isError,
    observerRef,
  } = useCursorQuery<GroupDetailType>(
    useGetMyCreatedGroupsQuery,
    queryParams,
    {
      limit: 20,
      observerOptions: {
        rootMargin: "1500px",
      },
    },
  );

  if (isError) {
    return <div>Error loading groups</div>;
  }

  return (
    <div>
      {isInitialLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <GroupSkleton key={index} />
        ))
      ) : combinedData.length > 0 ? (
        combinedData.map((group: GroupDetailType) => (
          <GroupCard key={group?.id} group={group} />
        ))
      ) : (
        <div className="flex flex-col items-center gap-4 mt-10 w-full h-full border border-primaryColor border-dashed rounded-md py-10">
          <div className="p-2 bg-primaryColor rounded-sm">
            <GroupUserIcon className="w-7 h-7 text-whiteColor " />
          </div>
          <p className="text-center text-grayColor1 ">
            You haven&apos;t created any groups yet.
          </p>

          <button
            type="button"
            className={`${BUTTON_STYLES.primary} flex items-center py-2! gap-1.5`}
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4" /> Create Group
          </button>
        </div>
      )}

      {isFetchingMore && (
        <div className="mt-4">
          <GroupSkleton />
        </div>
      )}
      {hasMore && !isFetchingMore && (
        <div ref={observerRef} className="h-4 w-full" />
      )}

      {isCreating && (
        <CreateGroupForm open={isCreating} setOpen={setIsCreating} />
      )}
    </div>
  );
}

export default CreateMyGroupList;
