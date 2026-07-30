"use client";
import {
  GroupUserIcon,
  MultiUserIcon,
  PlusUserIcon,
  SingleUserIcon,
} from "@/public/svgIcons/Icons";

import Link from "next/link";
import { usePathname } from "next/navigation";

function MainPageLeftSidebar({ onItemClick }: { onItemClick?: () => void }) {
  const menuItems = [
    {
      label: "My Connections",
      slug: "/mu/my-network/my-connection",
      icon: MultiUserIcon,
    },
    {
      label: "Connection Requests",
      slug: "/mu/my-network/connection-requests",
      icon: PlusUserIcon,
    },
    {
      label: " Following & Followers",
      slug: "/mu/my-network/following",
      icon: SingleUserIcon,
    },
    // {
    //   label: "Groups Invited",
    //   slug: "/mu/my-network/groups-invited",
    //   icon: GroupUserIcon,
    //   isDropdown: true,
    // },
    {
      label: "Groups",
      slug: "/mu/my-network/groups",
      icon: GroupUserIcon,
      isDropdown: true,
    },
  ];

  const pathName = usePathname();
  const isActive = (href: string): boolean => {
    if (href === "/mu/my-network/my-connection") {
      return pathName === "/mu/my-network/my-connection";
    }
    return pathName.startsWith(href);
  };
  return (
    <div>
      <h3 className="text-lg border-b py-3 border-[#D2D2D5] font-semibold">
        Manage Network
      </h3>

      <div className="mt-6 space-y-1 ">
        {menuItems.map((item) => (
          <Link
            key={item.slug}
            href={item.slug}
            onClick={onItemClick}
            className={`flex items-center gap-3 p-2 text-sm transition ${isActive(item.slug)
                ? "text-headerColor bg-bgLightColor rounded-md font-medium"
                : "text-grayColor1 hover:text-headerColor"
              }`}
          >
            {item.icon && <item.icon className="w-4.5 h-4.5" />}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainPageLeftSidebar;
