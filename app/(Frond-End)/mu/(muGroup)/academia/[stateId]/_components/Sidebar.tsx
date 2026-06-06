"use client";

import { buildSourceBreadcrumbs } from "../../../../../../../lib/source-breadcrumb";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BrainIcon,
  UndergradCapIcon,
  HospitalIcon,
  JobSearchIcon,
} from "../../../../../../../public/svgIcons/Icons";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useParams } from "next/navigation";
import { TbLayoutSidebarRight } from "react-icons/tb";
import { TbLayoutSidebarRightFilled } from "react-icons/tb";
import { usaMapData } from "@/public/staticData";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { stateId } = useParams();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const navigationItems = [
    {
      label: "Degree Programs",
      href: `/mu/academia/${stateId}/grad-undergrad-programs`,
      Icon: UndergradCapIcon,
      redirectKey: "undergradgradprograms",
    },
    {
      label: "Medical Residencies",
      href: `/mu/academia/${stateId}/medical-residencies`,
      Icon: BrainIcon,
      redirectKey: "medicalresidencies",
    },
    {
      label: "Hospitals",
      href: `/mu/academia/${stateId}/hospitals`,
      Icon: HospitalIcon,
      redirectKey: "hospitals",
    },
    {
      label: "Employment Opportunities",
      href: `/mu/academia/${stateId}/employemnts`,
      Icon: JobSearchIcon,
      redirectKey: "employmentopportunities",
    },
  ];

  const [currentState, setCurrentState] = useState<string>("");

  useEffect(() => {
    const state = redirectUrl
      .split("_")
      .find((part) => part.startsWith("stateacademia"));

    const parts = redirectUrl.split("_");

    const idx = parts.findIndex((part) => {
      const key = part.split(":")[0];
      return navigationItems.some((item) => item.redirectKey === key);
    });

    console.log("Parsed redirect URL:", { redirectUrl, state, idx, parts });

    setCurrentIndex(idx !== -1 ? idx : parts.length);
    if (state) {
      setCurrentState(buildSourceBreadcrumbs(state)[0].label || "");
    }
  }, [redirectUrl]);

  return (
    <div
      className={`${isOpen ? "w-full translate-x-0" : "w-fit -translate-x-92.5 xl:translate-x-0"} h-full grid absolute z-98 bg-[#0003] xl:bg-transparent backdrop-blur-xs xl:relative transition-all duration-300`}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={`bg-[#F8FAFB] h-full grid grid-rows-[auto_1fr] border-r border-[#D2D2D5] xl:rounded-l-2xl min-h-0 ${toggleSidebar ? "w-fit" : "w-70 sm:w-77.5"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2 relative border-b border-[#D2D2D5]">
          <div className={`px-2 pt-2 flex ${toggleSidebar ? "justify-center" : "justify-end"} items-center`}>
            <button
              onClick={() => setToggleSidebar((prev) => !prev)}
              className="hidden xl:flex items-center justify-center p-1.5 cursor-pointer hover:bg-gray-200 rounded-full transition-colors duration-300"
            >
              {toggleSidebar ? (
                <TbLayoutSidebarRightFilled className="text-2xl" />
              ) : (
                <TbLayoutSidebarRight className="text-2xl" />
              )}
            </button>
          </div>
          <Link
            href={`/mu/academia/${stateId}?redirect=${redirectUrl?.split("stateacademia")?.[0]}_stateacademia:${stateId}:${currentState}`}
            onClick={() => setIsOpen(false)}
            className={`block px-4 pb-4 sm:px-6 sm:pb-6 text-headerColor 
                 text-xl sm:text-2xl md:text-3xl lg:text-[32px] 
                 font-semibold leading-snug sm:leading-[130%] ${toggleSidebar ? "uppercase" : "text-left"}`}
          >
            {toggleSidebar
              ? usaMapData?.find((s) => s.name === currentState)?.id || "US"
              : currentState || "Unknown State"}
          </Link>
          <button
            type="button"
            className="xl:hidden absolute top-0 right-0 p-1.5 cursor-pointer hover:bg-gray-200 rounded-full transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            <IoClose className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col p-6 space-y-0.5 items-center">
          {navigationItems.map(({ label, href, Icon, redirectKey }) => (
            <Link
              href={`${href}?redirect=${redirectUrl ? redirectUrl?.split("_")?.slice(0, currentIndex).join("_") + "_" : ""}${redirectKey}:${currentState}`}
              onClick={() => setIsOpen(false)}
              key={href}
              className={`flex items-center p-1.5 sm:p-2 hover:bg-[#E2E8F0] gap-1.5 rounded-md sm:gap-2 ${redirectUrl?.includes(redirectKey) ? "bg-[#E2E8F0]" : ""} ${toggleSidebar ? "w-fit" : "w-full"}`}
            >
              <Icon className="w-6 h-6" />
              {!toggleSidebar && <span>{label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
