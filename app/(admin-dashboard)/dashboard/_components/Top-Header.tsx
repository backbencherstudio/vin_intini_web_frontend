"use client";

import Breadcrumb from "@/components/reusable/dashboard/BreadCumb";
import Image from "next/image";
import { IoMdNotifications } from "react-icons/io";
import { Menu, X } from "lucide-react";
import adminImg from "@/public/images/admin/profile.png";
import { useSidebar } from "@/components/ui/sidebar";

export default function TopHeader() {
    const { openMobile, setOpenMobile } = useSidebar();

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between border-b bg-white px-4">
            <div className="flex items-center gap-3">
                {/* 3-line icon & Cross icon for small devices only */}
                <button
                    type="button"
                    onClick={() => setOpenMobile(!openMobile)}
                    className="inline-flex md:hidden items-center justify-center p-1.5 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none"
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

            {/* Right side */}
            <div className="flex justify-center items-center gap-5">
                <IoMdNotifications className="h-5 w-5 text-gray-600" />

                <div className="flex items-center gap-2">
                    <Image
                        src={adminImg}
                        alt="Admin Image"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        priority
                    />
                </div>
            </div>
        </header>
    );
}