"use client";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import Link from "next/link";
import { useState } from "react";
import ProfileAllPost from "./ProfileAllPost";
import ProfileComment from "./ProfileComment";
import { ProfileTabs } from "./ProfileTabs";

function ProfilePostList() {
  const profileFilter = [
    { id: 1, name: "Post" },
    { id: 2, name: "Comments" },
  ];
  const [activeFilter, setActiveFilter] = useState("Post");
  const handleFilterChange = (filterId: number) => {
    const selectedFilter = profileFilter.find(
      (filter) => filter.id === filterId,
    );
    if (selectedFilter) {
      setActiveFilter(selectedFilter.name);
    }
  };
  const { data: userProfile } = useGetUserProfileQuery("user");
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-headerColor">
          Activity
        </h2>

        <Link
          href={`/mu/profile/${userProfile?.user?.id}/posts`}
          className="cursor-pointer text-base font-semibold text-descriptionColor hover:text-primaryColor transition-colors"
        >
          See all posts
        </Link>
      </div>
      <div>
        <ProfileTabs
          filterCategories={profileFilter}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="mt-3">
        {activeFilter === "Post" ? (
          <div>
            <ProfileAllPost userProfile={userProfile} />
          </div>
        ) : (
          <div>
            <ProfileComment />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePostList;
