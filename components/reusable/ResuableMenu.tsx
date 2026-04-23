"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function ResuableMenu({
  menuData,
  initialPath,
}: {
  menuData: { id: number; title: string; href: string }[];
  initialPath?: string;
}) {
  const pathName = usePathname();
  const isActive = (href: string): boolean => {
    if (href === initialPath) {
      return pathName === initialPath;
    }
    return pathName.startsWith(href);
  };
  return (
    <div className=" overflow-x-auto">
      <div className=" mt-2 max-w-[100%] md:max-w-auto w-full flex items-center  border-b border-borderColor">
        {menuData.map((menu) => (
          <Link
            key={menu.id}
            href={menu.href}
            className={`text-base font-medium hover:text-primaryColor  pb-2 px-3 ${isActive(menu.href) ? "text-primaryColor transition-all duration-200  border-b border-primaryColor" : "text-lightblackColor"}`}
          >
            {menu.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ResuableMenu;
