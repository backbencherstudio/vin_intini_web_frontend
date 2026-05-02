"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";

import { useGetMyFollowingsQuery } from "@/feature/slice/connect/followSlice";
import { ConnectionRequestType } from "@/lib/type";
import ConnectionNotFound from "../network/connectionRequests/ConnectionNotFound";
import ConnectionRequestCard from "../network/connectionRequests/ConnectionRequestCard";

function FollowingList({ isNetwork }: { isNetwork?: boolean }) {
  const { data, isLoading, isError } = useGetMyFollowingsQuery("");

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <p className="text-sm  text-grayColor1 mt-1">
        {data?.total || 0} people are following you
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

export default FollowingList;
