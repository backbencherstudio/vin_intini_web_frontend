import React from "react";
import Breadcrumb from "../../_components/Breadcrumb";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Breadcrumb />
      <div>{children}</div>

      {/* <div>{children}</div> */}
    </div>
  );
}

export default layout;
