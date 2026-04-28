import GroupMemberList from "@/app/(Frond-End)/_components/mainPage/group/GroupMemberList";
import GroupSidbar from "@/app/(Frond-End)/_components/mainPage/GroupSidbar";
import React from "react";

function GroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="md:grid grid-cols-12 gap-6">
        <div className="md:col-span-8 col-span-12 space-y-6">
          <div>{children}</div>
        </div>
        <div className="col-span-4 hidden md:block border-l border-[#D2D2D5] pl-4 lg:pl-6 h-full">
          <GroupMemberList />
          <GroupSidbar />
        </div>
      </div>
    </div>
  );
}

export default GroupLayout;
