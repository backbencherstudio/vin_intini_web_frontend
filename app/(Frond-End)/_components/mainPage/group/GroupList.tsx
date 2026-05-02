"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { useGetMyJoinedGroupsQuery } from "@/feature/slice/group/groupSlice";
import { GroupDetailType } from "@/lib/type";
import GroupCard from "./GroupCard";

function GroupList() {
  const { data, isLoading, isError } = useGetMyJoinedGroupsQuery("");
  return (
    <div>
      {isLoading ? (
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
