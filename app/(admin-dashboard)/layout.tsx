"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import DashboardHeader from "./dashboard/_components/dashboard-header";
import DashboardSidebar from "./dashboard/_components/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";
import TopHeader from "./dashboard/_components/Top-Header";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();

    const [checked, setChecked] = useState(false);
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
        } else {
            setChecked(true);
        }
    }, [router]);
    if (!checked) return null;

    return (
        <>
            {/* 1st Bar: Top Header — fixed at top always */}
            <TopHeader />

            {/* pt-16 = pushes content below the fixed 64px TopHeader */}
            <SidebarProvider>
                <div className="flex min-h-screen w-full pt-16">
                    {/* Sidebar */}
                    <DashboardSidebar />

                    <div className="flex flex-1 flex-col min-w-0">
                        {/* 2nd Bar: Sidebar Trigger + Page Title & Description */}
                        <header className="flex h-25 sticky top-16 z-50 bg-white items-center gap-4 border-b pr-5 pl-4">
                            <SidebarTrigger />
                            <DashboardHeader />
                        </header>

                        {/* Page Content */}
                        <main className="flex-1 bg-muted/40 p-6 overflow-auto">
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    style: {
                                        background: "#008000",
                                        color: "#fff",
                                    },
                                }}
                            />
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
}
