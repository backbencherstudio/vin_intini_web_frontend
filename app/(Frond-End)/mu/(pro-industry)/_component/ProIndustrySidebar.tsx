import React from 'react' 
"use client";

import {
  GroupUserIcon,
  JobsIcon,
  MessageIcon,
  MultiUserIcon,
  PlusUserIcon,
  PremiumAnalyticsIcon,
  SaveJobIcon,
  SingleUserIcon,
} from "@/public/svgIcons/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MainPageBottomNav from '@/app/(Frond-End)/_components/mainPage/MainPageBottomNav';
import SubscriptionCard from '../../(subscription)/_component/SubscriptionCard';
import { LayoutDashboardIcon } from 'lucide-react';

function ProIndustrySidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const [isMobile, setOpenMobile] = useState(false);

  const menuItems = [
    {
      label: "Recruiter Dashboard",
      slug: "/mu/my-network/my-connection",
      icon: LayoutDashboardIcon,
    },
    {
      label: "Advertisement",
      slug: "/mu/my-network/connection-requests",
      icon: JobsIcon,
    },
    {
      label: "Job Listing",
      slug: "/mu/my-network/following",
      icon: SingleUserIcon,
    },
    {
      label: "Analytics",
      slug: "/mu/my-network/groups",
      icon: PremiumAnalyticsIcon,
    },
    {
      label: "Message",
      slug: "/mu/my-network/groups",
      icon: MessageIcon,
    },
    {
      label: "Saved job",
      slug: "/mu/my-network/groups",
      icon: SaveJobIcon,
    },
  ];

  const handleLinkClick = () => {
    onItemClick?.();
    if (isMobile) setOpenMobile(false);
  };

  const isActive = (href: string): boolean => {
    if (href === "/mu/my-network/my-connection") {
      return pathname === "/mu/my-network/my-connection";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-170px)] h-full">
      {/* Top Navigation */}
      <div>
        <h3 className="text-lg border-b py-3 border-[#D2D2D5] font-semibold text-headerColor">
         Pro Industry Dashboard
        </h3>

        <div className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              onClick={onItemClick}
              className={`flex items-center gap-3 p-2 text-sm rounded-md transition ${
                isActive(item.slug)
                  ? "text-headerColor bg-lightGreenColor font-medium"
                  : "text-grayColor1 hover:text-headerColor hover:bg-gray-50"
              }`}
            >
              {item.icon && <item.icon className="w-4.5 h-4.5" />}
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Common Navigation */}
      <div className="pt-6  ">
        <MainPageBottomNav onItemClick={onItemClick} />
      </div>
      <div className="pt-6">
        <SubscriptionCard />
      </div>
    </div>
  );
}

export default ProIndustrySidebar;
