"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import {
  ChevronDown,
  LogOut,
  Settings,
  BarChart3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { SidebarData } from "./Dashboard-sidebar";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Open submenu when current page belongs to it
  useEffect(() => {
    SidebarData.forEach((item) => {
      if (item.children?.some((child) => child.href === pathname)) {
        setOpenMenus((prev) =>
          prev.includes(item.id) ? prev : [...prev, item.id]
        );
      }
    });
  }, [pathname]);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E5E7EB] pt-16">

      {/* ================= CONTENT ================= */}
      <SidebarContent className="bg-white">
        <SidebarGroup className="px-3 py-4">

          {/* Logo */}
          <div className="mb-5 flex justify-center border-b pb-5">
            <Image
              src="/assets/images/logo (2).png"
              width={180}
              height={50}
              alt="Logo"
              className="w-[180px] object-contain"
            />
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">

              {SidebarData.map((item) => {
                const Icon = item.icon;
                const hasChildren = !!item.children?.length;
                const isOpen = openMenus.includes(item.id);

                const active =
                  pathname === item.href ||
                  item.children?.some(
                    (child) => child.href === pathname
                  );

                return (
                  <React.Fragment key={item.id}>

                    {/* Parent */}
                    <SidebarMenuItem>
                      {hasChildren ? (
                        <SidebarMenuButton
                          onClick={() => toggleMenu(item.id)}
                          className={`h-9 rounded-lg ${active
                            ? "bg-[#D3F4EF] text-[#111827]"
                            : "text-[#374151] hover:bg-gray-50"
                            }`}
                        >
                          <Icon className="h-4 w-4" />

                          <span>{item.name}</span>

                          <ChevronDown
                            className={`ml-auto h-4 w-4 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={`h-9 rounded-lg ${active
                            ? "bg-[#D3F4EF] text-[#111827]"
                            : "text-[#374151] hover:bg-gray-50"
                            }`}
                        >
                          <Link href={item.href!}>
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>

                    {/* Submenu */}
                    {hasChildren && isOpen && (
                      <div className="ml-5 space-y-1">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const active = pathname === child.href;

                          return (
                            <SidebarMenuItem key={child.id}>
                              <SidebarMenuButton
                                asChild
                                className={`h-8 rounded-md ${active
                                  ? "bg-[#D3F4EF] text-[#111827]"
                                  : "text-[#6B7280] hover:bg-gray-50"
                                  }`}
                              >
                                <Link href={child.href}>
                                  <ChildIcon className="h-3.5 w-3.5" />
                                  <span>{child.name}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </div>
                    )}

                  </React.Fragment>
                );
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter className="bg-white px-3 pb-4">
        <SidebarMenu className="space-y-1">

          {/* Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`h-9 rounded-lg ${pathname === "/dashboard/settings"
                ? "bg-[#D3F4EF] text-[#111827]"
                : "text-[#374151] hover:bg-gray-50"
                }`}
            >
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Analytics */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`h-9 rounded-lg ${pathname === "/dashboard/analytics"
                ? "bg-[#D3F4EF] text-[#111827]"
                : "text-[#374151] hover:bg-gray-50"
                }`}
            >
              <Link href="/dashboard/analytics">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="h-9 rounded-lg text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>

        {/* Subscription */}
        <div className="mt-6 rounded-xl bg-[#18AFC0] p-4 text-center text-white">
          <h3 className="font-semibold">Subscription</h3>

          <p className="mt-1 text-xs text-white/90">
            Try our experience for using more features
          </p>

          <Link
            href="/dashboard/subscription"
            className="mt-3 flex h-9 items-center justify-center rounded-lg bg-white text-xs font-medium text-[#0EA5B7]"
          >
            Upgrade Now
          </Link>
        </div>
      </SidebarFooter>

    </Sidebar>
  );
}