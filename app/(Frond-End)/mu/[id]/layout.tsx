import MainFooter from "@/components/reusable/MainFooter";
import React from "react";
import MainNavbar from "../../_components/mainPage/MainNavbar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className=" grid grid-rows-[auto_1fr_auto] min-h-screen">
        <MainNavbar />
        <div className="container h-full w-full  ">{children}</div>
        <MainFooter />
      </div>
    </div>
  );
}

export default layout;
