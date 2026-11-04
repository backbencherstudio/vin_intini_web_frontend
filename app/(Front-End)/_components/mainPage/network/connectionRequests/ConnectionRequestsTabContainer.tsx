"use client";

import { useGetSentConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { useState } from "react";
import ConnectionRequestHeader from "./ConnectionRequestHeader";
import ConnectionRequestList from "./ConnectionRequestList";

export default function ConnectionRequestsTabContainer() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const { data: sentData } = useGetSentConnectionsQuery({
    query: "?page=1&limit=10",
  });

  const sentCount = sentData?.total ?? sentData?.data?.total ?? 0;

  return (
    <div>
      <ConnectionRequestHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sentCount={sentCount}
      />
      <div className="mt-2">
        <ConnectionRequestList isNetwork={true} type={activeTab} />
      </div>
    </div>
  );
}

