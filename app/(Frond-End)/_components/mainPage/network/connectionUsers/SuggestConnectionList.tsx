"use client";
import UserConnectionCardSkleton from "@/components/reusable/All Skleton/UserConnectionCardSkleton";
import { suggestedProfiles } from "@/public/demoData/DemoData";
import { useEffect, useState } from "react";
import ConnectionUserCard from "./ConnectionUserCard";

function SuggestConnectionList() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <UserConnectionCardSkleton
                key={`suggested-profile-skeleton-${index}`}
              />
            ))
          : suggestedProfiles.map((profile) => (
              <ConnectionUserCard profile={profile} key={profile.id} />
            ))}
      </div>
    </div>
  );
}

export default SuggestConnectionList;
