"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetMyFollowersQuery } from "@/feature/slice/connect/followSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { ConnectionRequestType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ConnectionNotFound from "../network/connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "../network/connectionRequests/ConnectionRequestCard";

function FollowingList({ isNetwork }: { isNetwork?: boolean }) {
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get("search") ?? "").trim().toLowerCase();

  const queryParams = useMemo(
    () => (searchQuery ? { search: searchQuery } : {}),
    [searchQuery],
  );

  const {
    data,
    total,
    items: combinedData,
    isInitialLoading,
    isFetchingMore,
    hasMore,
    isError,
    observerRef,
  } = useCursorQuery<ConnectionRequestType>(
    useGetMyFollowersQuery,
    queryParams,
    {
      limit: 20,
      observerOptions: {
        rootMargin: "1000px",
      },
    },
  );

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <p className="text-sm text-grayColor1 mt-1">
        {total || data?.total || 0} people are following you
      </p>
      <div className="mt-6">
        {isInitialLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : combinedData.length > 0
            ? combinedData.map((item: ConnectionRequestType) => (
                <ConnectionRequestCard key={item.id} item={item} />
              ))
            : isNetwork && <ConnectionNotFound />}
      </div>
      {isFetchingMore && (
        <div className="mt-4">
          <ConnectionRequestSkleton />
        </div>
      )}
      {hasMore && !isFetchingMore && (
        <div ref={observerRef} className="h-4 w-full" />
      )}
    </div>
  );
}

export default FollowingList;
