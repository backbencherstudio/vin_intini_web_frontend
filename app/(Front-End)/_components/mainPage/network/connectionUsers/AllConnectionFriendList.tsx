"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetMyConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { ConnectionRequestType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ConnectionNotFound from "../connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "../connectionRequests/ConnectionRequestCard";
import ConnectionListHeader from "./ConnectionListHeader";

function AllConnectionFriendList() {
  const params = useSearchParams();

  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const sortQuery = params.get("sort") ?? "";

  const queryParams = useMemo(
    () => ({
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(sortQuery ? { sort: sortQuery } : {}),
    }),
    [searchQuery, sortQuery],
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
    useGetMyConnectionsQuery,
    queryParams,
    {
      limit: 20,
      observerOptions: {
        rootMargin: "1000px",
      },
    },
  );

  const headerData = useMemo(
    () => ({ ...data, total: total || data?.total || 0 }),
    [data, total],
  );

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <ConnectionListHeader data={headerData} />
      <div className="max-w-full">
        {isInitialLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
          ))
        ) : combinedData.length > 0 ? (
          combinedData.map((item: ConnectionRequestType) => (
            <ConnectionRequestCard key={item.id} item={item} />
          ))
        ) : (
          <ConnectionNotFound
            title="No Connections Found"
            description="You have no connections right now. If you want to connect with someone, please check out the connection requests to get started."
          />
        )}
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

export default AllConnectionFriendList;
