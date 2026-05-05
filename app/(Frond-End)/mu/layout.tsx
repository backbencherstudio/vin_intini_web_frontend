import MainFooter from "@/components/reusable/MainFooter";
import React from "react";
import MainNavbar from "../_components/mainPage/MainNavbar";
import RootProtectedLayout from "../_components/RootProtectedLayout";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <RootProtectedLayout>{children}</RootProtectedLayout>
    </div>
  );
}

export default layout;
