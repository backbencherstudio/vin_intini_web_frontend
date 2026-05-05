"use client";

import { useGetGroupTimelineQuery } from "@/feature/slice/post/postSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import PostCard from "../post/PostCard";
import PostCardSkleton from "../post/PostCardSkleton";

function GroupPostList({ groupId }: { groupId: string }) {
  const { data: timeline, isLoading: isTimelineLoading } =
    useGetGroupTimelineQuery(groupId ?? skipToken);

  const postItems = timeline?.data || [];
  return (
    <section className=" grid-cols-1  grid gap-4">
      {isTimelineLoading
        ? Array.from({ length: 2 }).map((_, index) => (
            <PostCardSkleton key={index} />
          ))
        : postItems.length > 0 ? (
            postItems.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-center text-muted-foreground">
              No posts available.
            </p>
          )}
    </section>
  );
}

export default GroupPostList;
