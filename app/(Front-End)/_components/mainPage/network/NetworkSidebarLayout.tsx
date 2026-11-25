"use client";
import React from "react";

function NetworkSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-full">{children}</div>
    </div>
  );
}

export default NetworkSidebarLayout;
