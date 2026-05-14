"use client";

import { useGetGroupTimelineQuery } from "@/feature/slice/post/postSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostCard from "../post/PostCard";
import PostCardSkleton from "../post/PostCardSkleton";

function GroupPostList({ groupId }: { groupId?: string }) {
  const limit = 10;
  const [tempPage, setTempPage] = useState(1);

  const params = useParams();
  const resolvedGroupId = groupId ?? (params?.groupId as string | undefined);

  const groupTimelineArg = resolvedGroupId
    ? { query: `${resolvedGroupId}?page=${tempPage}&per_page=${limit}` }
    : skipToken;

  const { data, isLoading, isFetching } =
    useGetGroupTimelineQuery(groupTimelineArg);

  const { page, combinedData, lastElementRef } = useInfiniteScroll(
    data,
    isFetching,
    isLoading,
    
  );

  // Sync the hook's page state back to our query
  useEffect(() => {
    setTempPage(page);
  }, [page]);

  return (
    <section className=" grid-cols-1  grid gap-4">
      {isFetching ? (
        Array.from({ length: 2 }).map((_, index) => (
          <PostCardSkleton key={index} />
        ))
      ) : combinedData.length > 0 ? (
        combinedData.map((post, index) => (
          <div
            key={post.id}
            ref={combinedData.length === index + 1 ? lastElementRef : null}
          >
            <PostCard post={post} meta={data?.meta} />
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground">No posts available.</p>
      )}
    </section>
  );
}

export default GroupPostList;
