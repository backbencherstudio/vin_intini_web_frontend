"use client";
import { useParams } from "next/navigation";
import Breadcrumb from "../../_components/Breadcrumb";
import MessageUserSection from "./_component/MessageUserSection";

function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  return (
    <div className="pb-6 md:pb-8">
      <div>
        <Breadcrumb />
      </div>
      <div className="h-full md:bg-white md:p-4 rounded-xl flex">
        {/* Sidebar */}
        <div
          className={`w-full md:w-[370px] md:min-w-[370px] lg:w-[410px] lg:min-w-[410px] xl:w-[430px] xl:min-w-[430px] shrink-0 md:border-r border-gray-200 ${params?.id ? "hidden" : "block"} md:pr-4 md:flex flex-col`}
        >
          <MessageUserSection />
        </div>
        <div className={`w-full flex-1 min-w-0 ${params?.id ? "block" : "hidden"} md:block`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
