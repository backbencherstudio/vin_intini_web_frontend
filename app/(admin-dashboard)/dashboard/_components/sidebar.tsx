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
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/public/images/admin/Vector (1).png";

import { SidebarData } from "./Dashboard-sidebar";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();

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
              src={logo}
              alt="Logo"
              width={250}
              height={30}
              className="md:max-w-59.5 max-w-40 w-full h-auto"
              priority
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
                            ? " text-[#111827]  border "
                            : "text-[#374151] hover:bg-gray-50"
                            }`}
                        >
                          <Icon className="h-4 w-4" />

                          <span className="text-[#1D1F2C]  text-[16px] font-normal leading-[24px] tracking-[0.08px]">{item.name}</span>

                          <ChevronDown
                            className={`ml-auto h-4 w-4 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={`h-9 rounded-lg ${active
                            ? "bg-[#D3F4EF] text-[#111827] border border-primaryColor"
                            : "text-[#374151] hover:bg-gray-50"
                            }`}
                        >
                          <Link href={item.href!} onClick={() => { if (isMobile) setOpenMobile(false); }}>
                            <Icon className="h-4 w-4" />
                            <span className="text-[#1D1F2C]  text-[16px] font-normal leading-[24px] tracking-[0.08px]">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>

                    {/* Submenu */}
                    {hasChildren && isOpen && state === "expanded" && (
                      <div className="ml-5 space-y-1">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const active = pathname === child.href;

                          return (
                            <SidebarMenuItem key={child.id}>
                              <SidebarMenuButton
                                asChild
                                className={`h-8 rounded-md ${active
                                  ? "bg-[#D3F4EF] text-[#1D1F2C]  text-base font-semibold leading-6 tracking-[0.08px] border border-primaryColor"
                                  : "text-[#6B7280] hover:bg-gray-50"
                                  }`}
                              >
                                <Link
                                  href={child.href}
                                  onClick={() => {
                                    if (isMobile) {
                                      setOpenMobile(false);
                                    }
                                  }}
                                >
                                  <ChildIcon className="h-3.5 w-3.5" />
                                  <span className="text-[#1D1F2C]  text-[16px] font-normal leading-[24px] tracking-[0.08px]">{child.name}</span>
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

          {/* Analytics */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`h-9 rounded-lg ${pathname === "/dashboard/analytics"
                ? "bg-[#D3F4EF] text-[#111827] border border-primaryColor"
                : "text-[#374151] hover:bg-gray-50"
                }`}
            >
              <Link
                href="/dashboard/analytics"
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-[#1D1F2C]  text-[16px] font-normal leading-[24px] tracking-[0.08px]">
                  Analytics
                </span>
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
      </SidebarFooter>

    </Sidebar>
  );
}