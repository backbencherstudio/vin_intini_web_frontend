"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { useGetMyJoinedGroupsQuery } from "@/feature/slice/group/groupSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GroupDetailType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GroupCard from "./GroupCard";

function GroupList() {
  const params = useSearchParams();
  const limit = 10;
  const [tempPage, setTempPage] = useState(1);
  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const { data, isLoading, isFetching, isError } = useGetMyJoinedGroupsQuery({
    query: `?search=${searchQuery}&page=${tempPage}&limit=${limit}`,
  });

  const { page, combinedData, lastElementRef } = useInfiniteScroll(
    data,
    isFetching,
    isLoading,
    searchQuery,
  );
  useEffect(() => {
    setTempPage(page);
  }, [page]);

  if (isError) {
    return <div>Error loading groups</div>;
  }
  return (
    <div>
      {isLoading && combinedData.length === 0 ? (
        Array.from({ length: 6 }).map((_, index) => (
          <GroupSkleton key={index} />
        ))
      ) : combinedData.length > 0 ? (
        combinedData.map((group: GroupDetailType, index: number) => (
          <div
            key={group.id}
            ref={combinedData.length === index + 1 ? lastElementRef : null}
          >
            <GroupCard group={group} />
          </div>
        ))
      ) : (
        <div>No groups found</div>
      )}

      {isFetching && combinedData.length > 0 && (
        <div className="mt-4">
          <GroupSkleton />
        </div>
      )}
    </div>
  );
}

export default GroupList;
