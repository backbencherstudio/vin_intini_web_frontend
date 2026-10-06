import React from "react";
import Breadcrumb from "../../_components/Breadcrumb";
import JobsLeftSidebar from "./jobs/_component/JobsLeftSidebar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Breadcrumb />
      <div className="lg:grid lg:grid-cols-11  sm:pb-8 pb-6 gap-4 xl:gap-6 mb-10">
        <div className="hidden lg:block col-span-3 xl:col-span-2   lg:sticky lg:top-19  lg:overflow-y-auto self-start">
          <JobsLeftSidebar />
        </div>
        <div className="xl:col-span-9 lg:border-l lg:pl-4 xl:pl-6 border-[#D2D2D5] lg:col-span-9 col-span-12">
          {children}
        </div>
      </div>
      {/* <div>{children}</div> */}
    </div>
  );
}

export default layout;
