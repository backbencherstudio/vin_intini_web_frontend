"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { useGetMyJoinedGroupsQuery } from "@/feature/slice/group/groupSlice";
import { GroupDetailType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import GroupCard from "./GroupCard";

function GroupList() {
  const params = useSearchParams();

  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const { data, isLoading, isFetching, isError } =
    useGetMyJoinedGroupsQuery(searchQuery);
  return (
    <div>
      {isLoading || isFetching ? (
        Array.from({ length: 6 }).map((_, index) => (
          <GroupSkleton key={index} />
        ))
      ) : data?.data.length > 0 ? (
        data?.data.map((group: GroupDetailType) => (
          <GroupCard key={group.id} group={group} />
        ))
      ) : (
        <div>No groups found</div>
      )}
    </div>
  );
}

export default GroupList;
