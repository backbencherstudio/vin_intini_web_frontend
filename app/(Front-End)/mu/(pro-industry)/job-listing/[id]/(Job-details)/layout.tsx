import React from "react";
import JobDetailsHeader from "../../../_component/jobs/JobDetailsHeader";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <JobDetailsHeader />
      {children}
    </div>
  );
}

export default Layout;
