"use client";
import UserConnectionCardSkleton from "@/components/reusable/All Skleton/UserConnectionCardSkleton";
import Error from "@/components/reusable/Error";
import { useGetMyConnectionSuggestionsQuery } from "@/feature/slice/connect/connectSlice";
import { ConnectionRequestType } from "@/lib/type";
import ConnectionUserCard from "./ConnectionUserCard";

function SuggestConnectionList() {
  const { data, isLoading, isError } = useGetMyConnectionSuggestionsQuery("");

  if (isError) {
    return <Error />;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <UserConnectionCardSkleton
                key={`suggested-profile-skeleton-${index}`}
              />
            ))
          : data?.data?.map((profile: ConnectionRequestType, index: number) => (
              <ConnectionUserCard
                profile={profile}
                key={profile?.id || `profile-${index}`}
              />
            ))}
      </div>
    </div>
  );
}

export default SuggestConnectionList;
