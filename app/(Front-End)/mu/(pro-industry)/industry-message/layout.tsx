"use client";

import { useParams } from "next/navigation";
import IndustryMessageUserSection from "./_component/IndustryMessageUserSection";

function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();

  return (
    <div className="pb-6 md:pb-8">
      <div className="h-full bg-white p-3 md:p-4 rounded-xl border border-gray-200/80 shadow-xs flex">
        {/* Conversations Sidebar */}
        <div
          className={`md:max-w-80 lg:max-w-90 md:border-r border-gray-200 md:pr-4 w-full ${
            params?.id ? "hidden" : "block"
          } md:flex flex-col`}
        >
          <IndustryMessageUserSection />
        </div>

        {/* Conversation Root Pane */}
        <div className={`w-full ${params?.id ? "block" : "hidden"} md:block flex-1 min-w-0`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;

