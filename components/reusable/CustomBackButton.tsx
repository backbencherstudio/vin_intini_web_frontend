"use client";
import { LeftArrowIcon } from "@/public/svgIcons/Icons";
import { useRouter } from "next/navigation";
import React from "react";

function CustomBackButton({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  const router = useRouter();
  return (
    <button
      aria-label="back-network-sidebar"
      className={`flex items-center cursor-pointer gap-2 ${className}`}
      onClick={() => router.back()}
    >
      <LeftArrowIcon className={`w-4 h-4 ${iconClassName}`} />
      Back
    </button>
  );
}

export default CustomBackButton;
