"use client";

import { cn } from "@/lib/utils";
import mainLogo from "@/public/browserLogo.svg";
import {
  ClinicalIcon,
  GlobalIcon,
  HomeIcon,
  JobsIcon,
  MultiUserIcon,
  PsychologyMenuIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import UserHeaderInfo from "./UserHeaderInfo";

const menuItems = [
  { label: "Home", slug: "/mu/2/home", icon: HomeIcon },
  { label: "Academia", slug: "/mu/2/academia", icon: GlobalIcon },
  { label: " My Network", slug: "/mu/2/my-network", icon: MultiUserIcon },
  {
    label: "Psychology Network",
    slug: "/mu/2/psychology-network",
    icon: PsychologyMenuIcon,
    isDropdown: true,
  },
  {
    label: "Neuroscience Network",
    slug: "/mu/2/neuroscience-network",
    icon: ClinicalIcon,
    isDropdown: true,
  },
  { label: "Jobs", slug: "/mu/2/jobs", icon: JobsIcon },
];

export default function MainNavbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className=" py-2.5 px-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.03),_0_16px_24px_0_rgba(0,0,0,0.01)]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <div className="">
          <Image src={mainLogo} alt="Logo" width={50} height={50} />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-base">
          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className={cn(
                "hover:text-headerColor text-sm flex flex-col w-fit items-center gap-1 transition",
                pathname === item.slug ? "text-headerColor" : "text-grayColor1",
              )}
            >
              {item.icon && (
                <div className="">
                  <item.icon className="w-4.5 h-4.5" />
                </div>
              )}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Language, Auth Buttons */}
        <div className="hidden md:flex items-center space-x-[14px]">
          <UserHeaderInfo />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <div className="">
            <UserHeaderInfo />
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl"
          >
            {menuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div
        className={cn(
          "md:hidden fixed top-0 right-0 w-full bg-blackColor/20 backdrop-blur-xs h-screen space-y-3 z-50 transform transition-transform duration-300 ease-in-out",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="w-[80%]  absolute top-0 p-4 right-0 h-full bg-primaryColor max-w-[320px]">
          <div className="flex w-full justify-between items-center mb-2">
            <div className="">
              <Image src={mainLogo} alt="Logo" width={50} height={50} />
            </div>
            <button
              aria-label="close-menu"
              className="absolute top-4 right-4 z-10 text-white"
              onClick={() => setMenuOpen(false)}
            >
              <HiX className="text-2xl text-whiteColor" />
            </button>
          </div>

          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className={cn(
                "text-base flex items-center gap-2 py-2",
                pathname === item.slug ? "text-secondaryColor " : "text-white",
              )}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon && (
                <div className="">
                  <item.icon className="w-4.5 h-4.5" />
                </div>
              )}{" "}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
