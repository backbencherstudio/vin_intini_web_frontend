"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetMyConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { ConnectionRequestType } from "@/lib/type";
import ConnectionRequestCard from "../connectionRequests/ConnectionRequestCard";
import { useSearchParams } from "next/navigation";

function AllConnectionFriendList() {
  const params = useSearchParams();

   const searchQuery = (params.get("search") ?? "").trim().toLowerCase();

  const filterCustomers = () => {
    const filtered = new URLSearchParams();
    if (searchQuery) filtered.set("search", searchQuery);
   
    return filtered;
  };
  const { data, isLoading, isError } = useGetMyConnectionsQuery(filterCustomers().toString());
  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div className="">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : data?.data?.map((item: ConnectionRequestType) => (
              <ConnectionRequestCard
                key={item.id}
                item={item}
                
              />
            ))}
      </div>
    </div>
  );
}

export default AllConnectionFriendList;
