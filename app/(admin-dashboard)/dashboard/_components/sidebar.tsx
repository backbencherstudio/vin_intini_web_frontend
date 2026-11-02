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

const matchesRoute = (pathname: string, href?: string) =>
  Boolean(href && (pathname === href || pathname.startsWith(`${href}/`)));

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Keep only the submenu containing the current route open.
  useEffect(() => {
    const activeGroup = SidebarData.find((item) =>
      item.children?.some((child) => matchesRoute(pathname, child.href))
    );

    setOpenMenus(activeGroup ? [activeGroup.id] : []);
  }, [pathname]);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => (prev.includes(id) ? [] : [id]));
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
              height={84}
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
                  (item.id === "dashboard"
                    ? pathname === item.href
                    : matchesRoute(pathname, item.href)) ||
                  item.children?.some((child) =>
                    matchesRoute(pathname, child.href)
                  );

                return (
                  <React.Fragment key={item.id}>

                    {/* Parent */}
                    <SidebarMenuItem>
                      {hasChildren ? (
                        <SidebarMenuButton
                          onClick={() => toggleMenu(item.id)}
                          aria-expanded={isOpen}
                          className={`h-11 rounded-lg transition-colors duration-200 ${active
                            ? "text-[#111827]"
                            : "text-[#374151] hover:bg-gray-50"
                            } ${isOpen ? "focus-visible:ring-0" : ""}`}
                        >
                          <Icon className="h-4 w-4" />

                          <span className="text-headerColor text-[17px] font-normal leading-[24px] tracking-[0.08px]">{item.name}</span>

                          <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={`h-11 rounded-lg transition-colors duration-200 ${active
                            ? "bg-[#D3F4EF] text-[#111827]"
                            : "text-[#374151] hover:bg-gray-50"
                            }`}
                        >
                          <Link href={item.href!} onClick={() => { if (isMobile) setOpenMobile(false); }}>
                            <Icon className="h-4 w-4" />
                            <span className="text-headerColor text-[17px] font-normal leading-[24px] tracking-[0.08px]">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>

                    {/* Submenu */}
                    {hasChildren && state === "expanded" && (
                      <div
                        aria-hidden={!isOpen}
                        inert={!isOpen}
                        className={`ml-5 grid transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="relative min-h-0 space-y-1 overflow-hidden pl-4 before:absolute before:bottom-5 before:left-1 before:top-0 before:w-px before:bg-gray-200 before:content-['']">
                          {item.children?.map((child) => {
                            const ChildIcon = child.icon;
                            const active = matchesRoute(pathname, child.href);

                            return (
                              <SidebarMenuItem
                                key={child.id}
                                className={`before:absolute before:-left-3 before:top-1/2 before:w-3 before:border-t before:content-[''] ${active ? "before:border-primaryColor" : "before:border-gray-300"}`}
                              >
                                <SidebarMenuButton
                                  asChild
                                  className={`h-10 rounded-md transition-colors duration-200 ${active
                                    ? "bg-[#D3F4EF] text-headerColor text-base font-semibold leading-6 tracking-[0.08px]"
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
                                    <span className="text-headerColor text-[17px] font-normal leading-[24px] tracking-[0.08px]">{child.name}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </div>
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
          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="h-11 rounded-lg text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-[17px] leading-[24px] tracking-[0.08px]">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}
