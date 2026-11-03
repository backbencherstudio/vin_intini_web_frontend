"use client";

import { cn, scrollToTop } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AnalyticsMenue({
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
    <div className="overflow-x-auto scrollbar-hide py-1">
      <div className="my-2 max-w-full md:max-w-auto w-full flex gap-2.5 items-center">
        {menuData.map((menu) => (
          <Link
            key={menu.id}
            href={menu.href}
            onClick={scrollToTop}
            className={cn(
              "text-sm border text-nowrap font-medium rounded-full py-2 px-4 transition-all duration-200 cursor-pointer select-none",
              isActive(menu.href)
                ? "text-white bg-primaryColor border-primaryColor shadow-xs font-semibold"
                : "border-borderColor text-grayColor1 bg-white hover:text-headerColor hover:bg-gray-50",
            )}
          >
            {menu.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsMenue;
