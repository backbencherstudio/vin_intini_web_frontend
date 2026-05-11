"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ConnectionRequestType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectionNotFound from "./ConnectionNotFound";
import ConnectionRequestCard from "./ConnectionRequestCard";

function ConnectionRequestList({ isNetwork }: { isNetwork?: boolean }) {
  const params = useSearchParams();
  const limit = 10;
  const [tempPage, setTempPage] = useState(1);
  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const { data, isFetching, isLoading, isError } = useGetConnectionsQuery({
    query: `?search=${searchQuery}&page=${tempPage}&limit=${limit}`,
  });

  const { page, combinedData, lastElementRef } = useInfiniteScroll(
    data,
    isFetching,
    isLoading,
    searchQuery,
  );
  useEffect(() => {
    setTempPage(page);
  }, [page, searchQuery]);

  if (isError) {
    return <div>Error loading groups</div>;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div className="w-full">
        {isFetching
          ? Array.from({ length: 8 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : combinedData?.length > 0
            ? combinedData?.map(
                (item: ConnectionRequestType, index: number) => (
                  <div
                    key={item.id}
                    ref={
                      combinedData.length === index + 1 ? lastElementRef : null
                    }
                  >
                    <ConnectionRequestCard key={item.id} item={item} />
                  </div>
                ),
              )
            : isNetwork && <ConnectionNotFound />}
      </div>
    </div>
  );
}

export default ConnectionRequestList;
