"use client";

import { useGetNewsfeedQuery } from "@/feature/slice/post/postSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"; // Adjust path
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostCardSkleton from "./PostCardSkleton";

function PostList() {
  const limit = 10;
  // We temporarily pass an empty query to initialize the hook
  const [tempPage, setTempPage] = useState(1);

  const { data, isFetching, isLoading } = useGetNewsfeedQuery({
    query: `page=${tempPage}&per_page=${limit}`,
  });

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
    <section className="space-y-4">
      {combinedData.map((post, index) => (
        <div
          key={post.id}
          ref={combinedData.length === index + 1 ? lastElementRef : null}
        >
          <PostCard post={post} />
        </div>
      ))}

      {(isLoading || isFetching) && (
        <div className="space-y-4">
          <PostCardSkleton />
          <PostCardSkleton />
        </div>
      )}
    </section>
  );
}

export default PostList;
