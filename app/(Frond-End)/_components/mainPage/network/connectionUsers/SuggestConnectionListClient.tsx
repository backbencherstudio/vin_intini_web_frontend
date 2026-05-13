"use client";

import LoadMorePagination from "@/components/reusable/LoadMorePagination";
import { ConnectionRequestType } from "@/lib/type";
import { fetchWrapper } from "@/src/utils/fetchWrapper";
import { useEffect, useState } from "react";
import ConnectionUserCard from "./ConnectionUserCard";

interface SuggestConnectionListClientProps {
  initialData: ConnectionRequestType[];
  limit: number;
  searchQuery?: string;
}

export default function SuggestConnectionListClient({
  initialData,
  limit,
  searchQuery,
}: SuggestConnectionListClientProps) {
  const [combinedData, setCombinedData] = useState<ConnectionRequestType[]>(
    initialData,
  );
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reset when search query changes
  useEffect(() => {
    setCombinedData(initialData);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  // Fetch next page when page changes
  useEffect(() => {
    if (page === 1) return; // Skip first page
    if (isFetching) return;

    const fetchNextPage = async () => {
      setIsFetching(true);
      try {
        const query = searchQuery || "";
        const response = await fetchWrapper(
          `/connections/suggestions?page=${page}&per_page=${limit}&search=${encodeURIComponent(query)}`,
          {
            next: { tags: ["suggestions"] },
          },
        );

        const newItems = response.data || [];

        if (newItems.length === 0) {
          setHasMore(false);
          return;
        }

        // Merge new items, avoiding duplicates by ID
        setCombinedData((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = newItems.filter(
            (item: ConnectionRequestType) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueNewItems];
        });

        // If received items less than limit, no more data
        if (newItems.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading more suggestions:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchNextPage();
  }, [page, searchQuery, limit]);

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {combinedData && combinedData.length > 0 ? (
          combinedData.map((profile: ConnectionRequestType, index: number) => (
            <ConnectionUserCard
              profile={profile}
              key={profile?.id || `profile-${index}`}
            />
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-gray-500">
            No suggestions found
          </p>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && combinedData.length > 0 && (
        <div className="flex justify-center w-full cursor-pointer mt-4">
          <button
            className="px-4 py-2 cursor-pointer disabled:bg-bgColor disabled:text-grayColor1 disabled:cursor-not-allowed bg-primaryColor text-white rounded"
            onClick={handleLoadMore}
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
