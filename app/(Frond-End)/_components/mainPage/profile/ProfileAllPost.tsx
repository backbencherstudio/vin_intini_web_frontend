"use client";

import { useGetProfileTimelineQuery } from "@/feature/slice/post/postSlice";
import { UserProfileType } from "@/lib/type";
import { skipToken } from "@reduxjs/toolkit/query";
import PostCard from "../post/PostCard";
import PostCardSkleton from "../post/PostCardSkleton";

function ProfileAllPost({ userProfile }: { userProfile: UserProfileType }) {
  const { data: timeline, isLoading: isTimelineLoading } =
    useGetProfileTimelineQuery(userProfile?.user?.id ?? skipToken);

  const postItems = timeline?.data || [];
  return (
    <section className=" grid-cols-1 md:grid-cols-2 grid gap-4">
      {isTimelineLoading
        ? Array.from({ length: 2 }).map((_, index) => (
            <PostCardSkleton key={index} />
          ))
        : postItems.map((post) => <PostCard key={post.id} post={post} />)}
    </section>
  );
}

export default ProfileAllPost;
