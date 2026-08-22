import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import RootProtectedLayout from "../_components/RootProtectedLayout";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bgLightColor">
      <RootProtectedLayout>
       {children}
      </RootProtectedLayout>
    </div>
  );
}

export default layout;
