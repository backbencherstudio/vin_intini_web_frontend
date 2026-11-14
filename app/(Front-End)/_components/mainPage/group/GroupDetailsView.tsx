"use client";

import GroupAboutSection from "@/app/(Front-End)/_components/mainPage/group/GroupAboutSection";
import GroupHeroSection from "@/app/(Front-End)/_components/mainPage/group/GroupHeroSection";
import GroupMemberList from "@/app/(Front-End)/_components/mainPage/group/GroupMemberList";
import GroupPostCreateSection from "@/app/(Front-End)/_components/mainPage/group/GroupPostCreate";
import GroupPostList from "@/app/(Front-End)/_components/mainPage/group/GroupPostList";
import { useState } from "react";

interface GroupDetailsViewProps {
  groupId: string;
}

export default function GroupDetailsView({ groupId }: GroupDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<"post" | "about">("post");

  return (
    <div>
      <GroupHeroSection
        groupId={groupId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="md:hidden mt-4">
        <GroupMemberList groupId={groupId} />
      </div>
      {activeTab === "post" ? (
        <div className="mt-6 space-y-6">
          <GroupPostCreateSection groupId={groupId} />
          <GroupPostList groupId={groupId} />
        </div>
      ) : (
        <div className="mt-6">
          <GroupAboutSection groupId={groupId} />
        </div>
      )}
    </div>
  );
}

