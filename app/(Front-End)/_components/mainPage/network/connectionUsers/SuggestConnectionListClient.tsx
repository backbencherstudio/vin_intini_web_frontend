"use client";

import UserConnectionCardSkleton from "@/components/reusable/All Skleton/UserConnectionCardSkleton";
import { useGetSentConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { fetchWrapper } from "@/lib/fetch-wrapper";
import { ConnectionRequestType } from "@/lib/type";
import { useEffect, useMemo, useState } from "react";
import ConnectionUserCard from "./ConnectionUserCard";

interface SuggestConnectionListClientProps {
  initialResponse: any;
  limit: number;
  searchQuery?: string;
}

export default function SuggestConnectionListClient({
  initialResponse,
  limit,
  searchQuery,
}: SuggestConnectionListClientProps) {
  const [pagedResponse, setPagedResponse] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);

  const activeData = cursor && pagedResponse ? pagedResponse : (initialResponse ?? { data: [] });

  const { combinedData, hasMore, nextCursor, observerRef } =
    useCursorPagination<ConnectionRequestType>({
      data: activeData,
      isFetching,
      cursor,
      setCursor,
      resetKey: searchQuery ?? "",
      getItemId: (item: any) => item?.user?.id ?? item?.id,
      observerOptions: {
        rootMargin: "1000px",
      },
    });

  useEffect(() => {
    if (!cursor) return;

    let cancelled = false;

    const fetchNextPage = async () => {
      setIsFetching(true);
      try {
        const query = searchQuery || "";
        const res = await fetchWrapper(
          `/connections/suggestions?per_page=${limit}&cursor=${encodeURIComponent(cursor)}&search=${encodeURIComponent(query)}`,
        );
        if (!cancelled && res) {
          setPagedResponse(res);
        }
      } catch (error) {
        console.error("Error loading more suggestions:", error);
      } finally {
        if (!cancelled) {
          setIsFetching(false);
        }
      }
    };

    fetchNextPage();

    return () => {
      cancelled = true;
    };
  }, [cursor, limit, searchQuery]);

  const { data: sentConnectionsData } = useGetSentConnectionsQuery({
    query: "?limit=100",
  });

  const pendingSentUserIds = useMemo(() => {
    const ids = new Set<number>();
    sentConnectionsData?.data?.forEach((item: any) => {
      if (item?.user?.id) ids.add(item.user.id);
    });
    return ids;
  }, [sentConnectionsData]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {combinedData && combinedData.length > 0 ? (
          combinedData.map((profile: ConnectionRequestType, index: number) => (
            <ConnectionUserCard
              profile={profile}
              key={profile?.user?.id || profile?.id || `profile-${index}`}
              isPendingSent={pendingSentUserIds.has(profile?.user?.id)}
            />
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-gray-500">
            No suggestions found
          </p>
        )}
      </div>

      {isFetching && (
        <div className="grid mt-4 grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="mb-4">
              <UserConnectionCardSkleton />
            </div>
          ))}
        </div>
      )}

      {hasMore && nextCursor && !isFetching && (
        <div ref={observerRef} className="h-4 w-full" />
      )}
    </div>
  );
}
