import GroupMemberList from "@/app/(Front-End)/_components/mainPage/group/GroupMemberList";
import GroupSidbarWrapper from "@/app/(Front-End)/_components/mainPage/GroupSidbarWrapper";
import React from "react";

async function GroupLayout({
  params,
  children,
}: {
  params: Promise<{ groupId: string }>;
  children: React.ReactNode;
}) {
  const { groupId } = await params;

  return (
    <div className="h-full min-h-[calc(100vh-14rem)]">
      <div className="md:grid grid-cols-12 gap-6 h-full min-h-full">
        <div className="md:col-span-8 col-span-12 space-y-6">
          <div>{children}</div>
        </div>
        <div className="col-span-4 hidden md:block border-l border-[#D2D2D5] pl-4 lg:pl-6 h-full min-h-full">
          <div className="lg:sticky lg:top-25 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto space-y-4 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <GroupMemberList groupId={groupId} />
            <GroupSidbarWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupLayout;
