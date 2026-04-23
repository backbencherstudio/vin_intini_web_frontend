import ResuableMenu from "@/components/reusable/ResuableMenu";
import React from "react";

function FollowingLayout({ children }: { children: React.ReactNode }) {
  const candidateJobMenus = [
    {
      id: 1,
      title: "Following",
      href: "/mu/2/following",
    },
    {
      id: 2,
      title: "Followers",
      href: "/mu/2/following/followers",
    },
  ];
  return (
    <div>
      <ResuableMenu
        initialPath="/mu/2/following"
        menuData={candidateJobMenus}
      />
      {children}
    </div>
  );
}

export default FollowingLayout;
