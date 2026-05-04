"use client";

import { useGetNewsfeedQuery } from "@/feature/slice/post/postSlice";

import PostCardSkleton from "./PostCardSkleton";
import PostCard from "./PostCard";

function PostList() {
  const { data, isLoading } = useGetNewsfeedQuery("newsfeed");
  const posts = data?.data || [];
 

  return (
    <section className="space-y-4">
      {isLoading
        ? Array.from({ length: 2 }).map((_, index) => (
            <PostCardSkleton key={index} />
          ))
        : posts.map((post) => <PostCard key={post.id} post={post} />)}
    </section>
  );
}

export default PostList;
