import MainFooter from "@/components/reusable/MainFooter";
import React from "react";
import AuthHeader from "./_components/AuthHeader";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-sectionColor space-y-10 md:space-y-20">
        <AuthHeader />
        <div className="max-w-lg  bg-whiteColor rounded-lg p-4 md:p-6 mx-4  sm:mx-auto">
          {children}
        </div>
        <div className="mt-40">
          <MainFooter />
        </div>
      </div>
    </div>
  );
}

export default Layout;
