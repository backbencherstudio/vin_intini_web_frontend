"use client";
import ConnectionRequestSkleton from "@/components/reusable/All Skleton/ConnectionRequestSkleton";
import { connectionRequests } from "@/public/demoData/DemoData";

import { useEffect, useState } from "react";
import ConnectionRequestCard from "./ConnectionRequestCard";

function ConnectionRequestList() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <div>
      <div className="">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ConnectionRequestSkleton key={`request-skeleton-${index}`} />
            ))
          : connectionRequests.map((item) => (
              <ConnectionRequestCard key={item.id} item={item} />
            ))}
      </div>
    </div>
  );
}

export default ConnectionRequestList;
