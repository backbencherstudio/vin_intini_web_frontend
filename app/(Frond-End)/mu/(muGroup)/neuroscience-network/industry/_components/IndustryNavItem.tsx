// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/_components/IndustryNavItem.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface IndustryNavItemProps {
  href?: string;
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
}

export const IndustryNavItem = ({
  href,
  icon,
  label,
  onClick,
}: IndustryNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition ${
        isActive ? "bg-[#D3F4EF]" : "bg-white hover:bg-[#F6F8FA]"
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span className="font-['Segoe_UI'] text-base font-normal text-[#4A4C56]">
        {label}
      </span>
    </Link>
  );
};
