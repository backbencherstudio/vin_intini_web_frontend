"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import { useGetMyCreatedGroupsQuery } from "@/feature/slice/group/groupSlice";
import { GroupDetailType } from "@/lib/type";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { Plus } from "lucide-react";
import { useState } from "react";
import GroupCard from "./GroupCard";
import CreateGroupForm from "./GroupCreateModal";
import { useSearchParams } from "next/navigation";

function CreateMyGroupList() {
   const params = useSearchParams();
  
    const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const { data, isLoading, isFetching, isError } = useGetMyCreatedGroupsQuery(searchQuery);
  const [isCreating, setIsCreating] = useState(false);
  const createdGroups = data?.data || [];
  return (
    <div>
      {isLoading || isFetching ? (
        Array.from({ length: 6 }).map((_, index) => (
          <GroupSkleton key={index} />
        ))
      ) : createdGroups.length > 0 ? (
        createdGroups.map((group: GroupDetailType) => (
          <GroupCard key={group?.id} group={group} />
        ))
      ) : (
        <div className="flex flex-col items-center gap-4 mt-10 w-full h-full border border-primaryColor border-dashed rounded-md py-10">
          <div className="p-2 bg-primaryColor rounded-sm">
            <GroupUserIcon className="w-7 h-7 text-whiteColor " />
          </div>
          <p className="text-center text-grayColor1 ">
            You haven't created any groups yet.
          </p>

          <button
            className={`${BUTTON_STYLES.primary} flex items-center py-2! gap-1.5`}
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4" /> Create Group
          </button>
        </div>
      )}

      {isCreating && (
        <CreateGroupForm open={isCreating} setOpen={setIsCreating} />
      )}
    </div>
  );
}

export default CreateMyGroupList;
