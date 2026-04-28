"use client";
import GroupSkleton from "@/components/reusable/All Skleton/GroupSkleton";
import { useEffect, useState } from "react";
import GroupCard from "./GroupCard";

type GroupItem = {
  id: number;
  name: string;
  membersLabel: string;
  isJoined?: boolean;
  isFirst?: boolean;
};

function GroupList() {
  const groups: GroupItem[] = [
    {
      id: 1,
      name: "Figma Product Community",
      membersLabel: "Group members count",
      isFirst: true,
    },
    {
      id: 2,
      name: "Figma Product Community",
      membersLabel: "Group members count",
      isJoined: true,
    },
    {
      id: 3,
      name: "Figma Product Community",
      membersLabel: "Group members count",
    },
    {
      id: 4,
      name: "Figma Product Community",
      membersLabel: "Group members count",
    },
    {
      id: 5,
      name: "Figma Product Community",
      membersLabel: "Group members count",
    },
  ];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <div>
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <GroupSkleton key={index} />
          ))
        : groups.map((post) => <GroupCard key={post.id} group={post} />)}
    </div>
  );
}

export default GroupList;
