"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetMyConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ConnectionRequestType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConnectionNotFound from "../connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "../connectionRequests/ConnectionRequestCard";
import ConnectionListHeader from "./ConnectionListHeader";

function AllConnectionFriendList() {
  const params = useSearchParams();

  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const limit = 10;
  const [tempPage, setTempPage] = useState(1);

  const { data, isFetching, isError } = useGetMyConnectionsQuery({
    query: `?search=${searchQuery}&page=${tempPage}&limit=${limit}`,
  });

  const { page, combinedData, lastElementRef } = useInfiniteScroll(
    data,
    isFetching,
    false, // isLoading is not needed here as we are using isFetching to determine loading state
    searchQuery,
  );

  useEffect(() => {
    setTempPage(page);
  }, [page, searchQuery]);

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <ConnectionListHeader data={data} />
      <div className="">
        {isFetching ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
          ))
        ) : combinedData?.length > 0 ? (
          combinedData?.map((item: ConnectionRequestType, index: number) => (
            <div
              key={item?.id}
              ref={combinedData.length === index + 1 ? lastElementRef : null}
            >
              <ConnectionRequestCard key={item.id} item={item} />
            </div>
          ))
        ) : (
          <ConnectionNotFound title="No Connections Found" />
        )}
      </div>
    </div>
  );
}

export default AllConnectionFriendList;
