"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { ConnectionRequestType } from "@/lib/type";
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
          : data?.data?.map((item: ConnectionRequestType) => (
              <ConnectionRequestCard key={item.id} item={item} />
            ))}
      </div>
    </div>
  );
}

export default ConnectionRequestList;
