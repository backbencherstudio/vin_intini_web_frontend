// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/IndustryNavItem.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface IndustryNavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export const IndustryNavItem = ({
  href,
  icon,
  label,
  onClick,
}: IndustryNavItemProps) => {
  const pathname = usePathname();

  const cleanPath = (pathname || "").replace(/\/+$/, "");
  const cleanHref = (href || "").replace(/\/+$/, "");

  // Match exact route or sub-routes (e.g. /sections, /[sectionId])
  const isDirectMatch =
    cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`);

  // Cross-network fallback: match industry segment (e.g. 'biotechnology', 'psychopharmacology', 'publications')
  const hrefIndustry = cleanHref.split("/industry/")[1]?.split("/")[0];
  const pathIndustry = cleanPath.split("/industry/")[1]?.split("/")[0];
  const isIndustryMatch = Boolean(
    hrefIndustry && pathIndustry && hrefIndustry === pathIndustry
  );

  const isActive = isDirectMatch || isIndustryMatch;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md p-2 text-sm transition ${
        isActive
          ? "bg-lightGreenColor text-headerColor font-medium"
          : "text-grayColor1 hover:text-headerColor hover:bg-gray-50"
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span className="text-sm font-normal">
        {label}
      </span>
    </Link>
  );
};
