import React from "react";
import ProIndustrySidebar from "./_component/ProIndustrySidebar";

export default function ProIndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 py-6 justify-center px-4">
      <aside className="hidden lg:block w-64 shrink-0">
        <ProIndustrySidebar />
      </aside>
      <main className="flex-1 max-w-3xl">{children}</main>
    </div>
  );
}