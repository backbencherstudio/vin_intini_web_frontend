import ResuableMenu from "@/components/reusable/ResuableMenu";
import Search from "@/components/reusable/Search";
import React from "react";

function FollowingHeader() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-3 min-h-[66px]">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Following & Followers
        </h2>

        <div className="relative w-64 lg:w-72 hidden md:block max-w-full">
          <Search placeHolder="Search people..." />
        </div>

        <div className="relative w-full md:hidden max-w-full">
          <Search placeHolder="Search people..." />
        </div>
      </div>
    </div>
  );
}

function FollowingLayout({ children }: { children: React.ReactNode }) {
  const candidateJobMenus = [
    {
      id: 1,
      title: "Following",
      href: "/mu/my-network/following",
    },
    {
      id: 2,
      title: "Followers",
      href: "/mu/my-network/following/followers",
    },
  ];
  return (
    <div className="space-y-4">
      <FollowingHeader />
      <div>
        <ResuableMenu
          initialPath="/mu/my-network/following"
          menuData={candidateJobMenus}
        />
        {children}
      </div>
    </div>
  );
}

export default FollowingLayout;
