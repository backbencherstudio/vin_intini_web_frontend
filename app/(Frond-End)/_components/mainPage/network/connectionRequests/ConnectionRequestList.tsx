"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { ConnectionRequest } from "@/lib/type";
import ConnectionRequestCard from "./ConnectionRequestCard";

function ConnectionRequestList({
  allReadyFriends,
}: {
  allReadyFriends?: string;
}) {
  const { data, isLoading, isError } = useGetConnectionsQuery("");

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div className="">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : data?.data?.map((item: ConnectionRequest) => (
              <ConnectionRequestCard
                key={item.id}
                item={item}
                allReadyFriends={allReadyFriends}
              />
            ))}
      </div>
    </div>
  );
}

export default ConnectionRequestList;
