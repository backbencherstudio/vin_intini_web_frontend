"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetMyConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { ConnectionRequestType } from "@/lib/type";
import { useSearchParams } from "next/navigation";
import ConnectionNotFound from "../connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "../connectionRequests/ConnectionRequestCard";
import ConnectionListHeader from "./ConnectionListHeader";

function AllConnectionFriendList() {
  const params = useSearchParams();

  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();

  const filterCustomers = () => {
    const filtered = new URLSearchParams();
    if (searchQuery) filtered.set("search", searchQuery);

    return filtered;
  };
  const { data, isFetching, isError } = useGetMyConnectionsQuery(
    filterCustomers().toString(),
  );
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
        ) : data?.data?.length > 0 ? (
          data?.data?.map((item: ConnectionRequestType) => (
            <ConnectionRequestCard key={item.id} item={item} />
          ))
        ) : (
          <ConnectionNotFound title="No Connections Found" />
        )}
      </div>
    </div>
  );
}

export default AllConnectionFriendList;
