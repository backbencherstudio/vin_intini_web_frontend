"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


import DashboardSidebar from "./dashboard/_components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopHeader from "./dashboard/_components/Top-Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const token = Cookies.get("accessToken") || Cookies.get("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(
          atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (payload?.exp && payload.exp * 1000 <= Date.now()) {
          Cookies.remove("accessToken");
          router.push("/admin/login?expired=1");
          return;
        }
        if (payload?.role && payload.role !== "admin") {
          router.push("/mu/home");
          return;
        }
      }
    } catch {
      // fallback
    }

    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return (
    <SidebarProvider>
      {/* 1st Bar: Top Header — fixed at top always */}
      <TopHeader />

      {/* Content area below the fixed 64px TopHeader */}
      <div className="flex min-h-screen w-full pt-16">
        {/* Sidebar */}
        <DashboardSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          {/* Page Content */}
          <main className="flex-1 w-full overflow-auto px-4 py-6 md:px-6 md:py-8">
           
            <div className="admin-dashboard-content w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
