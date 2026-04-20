import {
  GroupUserIcon,
  MultiUserIcon,
  PlusUserIcon,
  SingleUserIcon,
} from "@/public/svgIcons/Icons";

import Link from "next/link";

function MainPageLeftSidebar() {
  const menuItems = [
    {
      label: "My Connections",
      slug: "/mu/2/my-connection",
      icon: MultiUserIcon,
    },
    {
      label: "Connection Requests",
      slug: "/mu/2/connection-requests",
      icon: PlusUserIcon,
    },
    {
      label: " Following & Followers",
      slug: "/mu/2/following-followers",
      icon: SingleUserIcon,
    },
    {
      label: "Groups",
      slug: "/mu/2/groups",
      icon: GroupUserIcon,
      isDropdown: true,
    },
  ];
  return (
    <div>
      <h3 className="text-lg border-b py-3 border-[#D2D2D5] font-semibold">
        Manage Network
      </h3>

      <div className="mt-6 space-y-4 ">
        {menuItems.map((item) => (
          <Link
            key={item.slug}
            href={item.slug}
            className="flex items-center gap-3 text-sm text-grayColor1 hover:text-headerColor transition"
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
