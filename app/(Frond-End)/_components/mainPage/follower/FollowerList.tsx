"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";

import { useGetMyFollowersQuery } from "@/feature/slice/connect/followSlice";
import { ConnectionRequestType } from "@/lib/type";
import ConnectionNotFound from "../network/connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "../network/connectionRequests/ConnectionRequestCard";

function FollowerList({ isNetwork }: { isNetwork?: boolean }) {
  const { data, isLoading, isError } = useGetMyFollowersQuery("");

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <p className="text-sm  text-grayColor1 mt-1">
        You are following {data?.total || 0} people out of your network
      </p>
      <div className="mt-6">
        {isLoading
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

export default FollowerList;
