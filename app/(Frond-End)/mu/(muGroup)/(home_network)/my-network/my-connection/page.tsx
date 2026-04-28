"use client";
import ConnectionRequestCard from "@/app/(Frond-End)/_components/mainPage/network/connectionRequests/ConnectionRequestCard";
import ConnectionListHeader from "@/app/(Frond-End)/_components/mainPage/network/connectionUsers/ConnectionListHeader";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import Error from "@/components/reusable/Error";
import { useGetMyConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { ConnectionRequestType } from "@/lib/type";

function page() {
  const { data, isLoading, isError } = useGetMyConnectionsQuery("");

  if (isError) {
    return <Error />;
  }
  console.log(data, "===========");

  return (
    <div>
      <ConnectionListHeader data={data} />
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
    </div>
  );
}

export default page;
