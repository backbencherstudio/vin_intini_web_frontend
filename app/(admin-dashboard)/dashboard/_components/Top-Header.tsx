"use client";

import Breadcrumb from "@/components/reusable/dashboard/BreadCumb";
import Image from "next/image";
import { IoMdNotifications } from "react-icons/io";
import { Menu, X } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useGetMyProfileQuery } from "@/feature/slice/user/userSlice";
import adminProfile from "@/public/images/admin/profile.png";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopHeader() {
  const { openMobile, setOpenMobile } = useSidebar();

  const { data } = useGetMyProfileQuery("");
  const profile = data?.data;
  const profileName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "Administrator";

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("token");
    window.location.href = "/login";
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-16 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpenMobile(!openMobile)}
          className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none md:hidden"
          aria-label="Toggle navigation menu"
        >
          {openMobile ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <Breadcrumb />
      </div>

      <div className="flex items-center justify-center gap-5">
        <IoMdNotifications className="h-5 w-5 text-gray-600" />

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open admin account menu"
              className="rounded-full outline-none ring-offset-2 transition hover:ring-2 hover:ring-primaryColor focus-visible:ring-2 focus-visible:ring-primaryColor"
            >
              <Image
                src={profile?.profile_image_url || adminProfile}
                alt={`${profileName} profile`}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
                priority
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={8}
            collisionPadding={8}
            className="w-64 max-sm:w-48"
          >
            <DropdownMenuLabel className="font-normal">
              <p className="truncate text-sm font-medium text-headerColor">
                {profileName}
              </p>
              {profile?.email && (
                <p className="truncate text-xs text-grayColor1">
                  {profile.email}
                </p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings/general-settings">
                <Settings />
                General Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings/security">
                <ShieldCheck />
                Security Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings/notification-settings">
                <Bell />
                Notification Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleLogout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="text-red-600 opacity-100" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
