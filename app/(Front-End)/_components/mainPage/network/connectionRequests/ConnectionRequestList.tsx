"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import {
  useGetConnectionsQuery,
  useGetSentConnectionsQuery,
} from "@/feature/slice/connect/connectSlice";
import { useCursorQuery } from "@/hooks/useCursorPagination";
import { ConnectionRequestType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ConnectionNotFound from "./ConnectionNotFound";
import ConnectionRequestCard from "./ConnectionRequestCard";

type FeedProps = {
  isNetwork?: boolean;
  searchQuery: string;
};

function RequestFeedView({
  type,
  isNetwork,
  items,
  isInitialLoading,
  isFetchingMore,
  hasMore,
  isError,
  observerRef,
}: {
  type: "received" | "sent";
  isNetwork?: boolean;
  items: ConnectionRequestType[];
  isInitialLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  isError: boolean;
  observerRef: (node: HTMLElement | null) => void;
}) {
  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div className="w-full">
        {isInitialLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : items.length > 0
            ? items.map((item: ConnectionRequestType) => (
                <ConnectionRequestCard
                  key={item.id}
                  item={item}
                  isSent={type === "sent"}
                />
              ))
            : isNetwork && (
                <ConnectionNotFound
                  title={
                    type === "sent"
                      ? "No Sent Requests"
                      : "No Pending Requests"
                  }
                  description={
                    type === "sent"
                      ? "You haven't sent any pending connection requests."
                      : "You have no pending requests right now. If you want to connect with new people, explore suggestions below!"
                  }
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

function ReceivedRequestsFeed({ isNetwork, searchQuery }: FeedProps) {
  const queryParams = useMemo(
    () => (searchQuery ? { search: searchQuery } : {}),
    [searchQuery],
  );
  const {
    items,
    isInitialLoading,
    isFetchingMore,
    hasMore,
    isError,
    observerRef,
  } = useCursorQuery<ConnectionRequestType>(
    useGetConnectionsQuery,
    queryParams,
    {
      limit: 20,
      observerOptions: { rootMargin: "1000px" },
    },
  );

  return (
    <RequestFeedView
      type="received"
      isNetwork={isNetwork}
      items={items}
      isInitialLoading={isInitialLoading}
      isFetchingMore={isFetchingMore}
      hasMore={hasMore}
      isError={isError}
      observerRef={observerRef}
    />
  );
}

function SentRequestsFeed({ isNetwork, searchQuery }: FeedProps) {
  const queryParams = useMemo(
    () => (searchQuery ? { search: searchQuery } : {}),
    [searchQuery],
  );
  const {
    items,
    isInitialLoading,
    isFetchingMore,
    hasMore,
    isError,
    observerRef,
  } = useCursorQuery<ConnectionRequestType>(
    useGetSentConnectionsQuery,
    queryParams,
    {
      limit: 20,
      observerOptions: { rootMargin: "1000px" },
    },
  );

  return (
    <RequestFeedView
      type="sent"
      isNetwork={isNetwork}
      items={items}
      isInitialLoading={isInitialLoading}
      isFetchingMore={isFetchingMore}
      hasMore={hasMore}
      isError={isError}
      observerRef={observerRef}
    />
  );
}

function ConnectionRequestList({
  isNetwork,
  type = "received",
}: {
  isNetwork?: boolean;
  type?: "received" | "sent";
}) {
  const params = useSearchParams();
  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();

  return type === "sent" ? (
    <SentRequestsFeed isNetwork={isNetwork} searchQuery={searchQuery} />
  ) : (
    <ReceivedRequestsFeed isNetwork={isNetwork} searchQuery={searchQuery} />
  );
}

export default ConnectionRequestList;
