"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { ConnectionRequestType } from "@/lib/type";
import ConnectionNotFound from "./ConnectionNotFound";
import ConnectionRequestCard from "./ConnectionRequestCard";
import { useSearchParams } from "next/navigation";

function ConnectionRequestList({ isNetwork }: { isNetwork?: boolean }) {
   const params = useSearchParams();

  const searchQuery = (params.get("search") ?? "").trim().toLowerCase();
  const { data, isFetching, isError } = useGetConnectionsQuery(searchQuery);

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div className="">
        {isFetching
          ? Array.from({ length: 8 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : data?.data?.length > 0
            ? data?.data?.map((item: ConnectionRequestType) => (
                <ConnectionRequestCard key={item.id} item={item} />
              ))
            : isNetwork && <ConnectionNotFound />}
      </div>
    </div>
  );
}

export default ConnectionRequestList;
