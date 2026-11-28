"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { useGetMyJoinedGroupsQuery } from "@/feature/slice/group/groupSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { GroupDetailType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import GroupCard from "./GroupCard";

function GroupList() {
  const params = useSearchParams();
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
    useGetMyJoinedGroupsQuery,
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
          <GroupCard key={group.id} group={group} />
        ))
      ) : (
        <div className="py-6 text-center text-grayColor1 text-lg font-semibold">
          You are not a member of any groups.
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
    </div>
  );
}

export default GroupList;
