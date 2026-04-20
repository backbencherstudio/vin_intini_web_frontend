import MainFooter from "@/components/reusable/MainFooter";
import React from "react";
import MainNavbar from "../../_components/mainPage/MainNavbar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <MainNavbar />
        <div className="container ">{children}</div>
        <MainFooter />
      </div>
    </div>
  );
}

export default layout;
