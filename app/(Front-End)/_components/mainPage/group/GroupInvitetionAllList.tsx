"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetAllInviteGroupQuery } from "@/feature/slice/group/groupSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import GroupInvitationCard from "./GroupInvitationCard";

function GroupInvitetionAllList() {
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
  } = useCursorQuery<any>(useGetAllInviteGroupQuery, queryParams, {
    limit: 20,
    getItemId: (item: any) =>
      item?.invitation_id ?? item?.group?.id ?? item?.id,
    observerOptions: {
      rootMargin: "1500px",
    },
  });

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div>
        {isInitialLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ConnectionRequestSkleton key={`invite-skeleton-${index}`} />
          ))
        ) : combinedData.length > 0 ? (
          combinedData.map((item: any, index: number) => (
            <GroupInvitationCard
              key={item?.invitation_id || item?.id || `invite-${index}`}
              item={item}
            />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No Group Invitation Found
          </div>
        )}
      </div>

      {isFetchingMore && (
        <div className="mt-4">
          <ConnectionRequestSkleton />
        </div>
      )}

      {hasMore && !isFetchingMore && (
        <div ref={observerRef} className="h-4 w-full" />
      )}
    </div>
  );
}

export default GroupInvitetionAllList;
