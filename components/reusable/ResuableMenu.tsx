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
    <div className="overflow-x-auto scrollbar-hide">
      <div className="inline-flex w-fit items-center border-b border-borderColor">
        {menuData.map((menu) => (
          <Link
            key={menu.id}
            href={menu.href}
            className={`text-base font-medium hover:text-primaryColor pb-2.5 px-3 -mb-px transition-all duration-200 ${
              isActive(menu.href)
                ? "text-primaryColor border-b-2 border-primaryColor font-semibold"
                : "text-lightblackColor border-b-2 border-transparent"
            }`}
          >
            {menu.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ResuableMenu;
