"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import mainLogo from "@/public/browserLogo.svg";
import {
  ClinicalIcon,
  GlobalIcon,
  HomeIcon,
  JobsIcon,
  MenueArrowDownIcon,
  MultiUserIcon,
  PsychologyMenuIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import UserHeaderInfo from "./UserHeaderInfo";

type MenuItem = {
  label: string;
  slug: string;
  icon: ComponentType<{ className?: string }>;
  isDropdown?: boolean;
  dropdownItems?: Array<{ label: string; slug: string }>;
};

const menuItems: MenuItem[] = [
  { label: "Home", slug: "/mu/2/home", icon: HomeIcon },
  { label: "Academia", slug: "/mu/2/academia", icon: GlobalIcon },
  { label: "My Network", slug: "/mu/2/my-network", icon: MultiUserIcon },
  {
    label: "Psychology Network",
    slug: "/mu/2/psychology-network",
    icon: PsychologyMenuIcon,
    isDropdown: true,
    dropdownItems: [
      { label: "Psychology Fields", slug: "/mu/2/psychology-network/fields" },
      {
        label: "Psychology Careers",
        slug: "/mu/2/psychology-network/careers",
      },
      { label: "Industry", slug: "/mu/2/psychology-network/industry" },
      { label: "Jobs", slug: "/mu/2/psychology-network/jobs" },
    ],
  },
  {
    label: "Neuroscience Network",
    slug: "/mu/2/neuroscience-network",
    icon: ClinicalIcon,
    isDropdown: true,
    dropdownItems: [
      {
        label: "Neuroscience Fields",
        slug: "/mu/2/neuroscience-network/fields",
      },
      {
        label: "Neuroscience Careers",
        slug: "/mu/2/neuroscience-network/careers",
      },
      { label: "Industry", slug: "/mu/2/neuroscience-network/industry" },
      { label: "Jobs", slug: "/mu/2/neuroscience-network/jobs" },
    ],
  },
  { label: "Jobs", slug: "/mu/2/jobs", icon: JobsIcon },
];

export default function MainNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdownSlug, setOpenDropdownSlug] = useState<string | null>(null);
  const [openMobileDropdownSlug, setOpenMobileDropdownSlug] = useState<
    string | null
  >(null);
  const isActive = (href: string): boolean => {
    if (href === "/mu/2/home") {
      return pathname === "/mu/2/home";
    }
    return pathname.startsWith(href);
  };
  return (
    <header className="py-2.5 px-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.03),_0_16px_24px_0_rgba(0,0,0,0.01)]">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Image src={mainLogo} alt="Logo" width={50} height={50} />
        </div>

        <nav className="hidden space-x-6 text-base lg:flex">
          {menuItems.map((item) => {
            if (item.isDropdown) {
              const isDropdownOpen = openDropdownSlug === item.slug;

              return (
                <DropdownMenu
                  key={item.slug}
                  open={isDropdownOpen}
                  onOpenChange={(open) =>
                    setOpenDropdownSlug(open ? item.slug : null)
                  }
                >
                  <DropdownMenuTrigger asChild className="focus:outline-0">
                    <button
                      type="button"
                      className={cn(
                        "group flex w-fit flex-col items-center gap-1 text-sm transition cursor-pointer hover:text-headerColor",
                        isActive(item.slug) || isDropdownOpen
                          ? "text-headerColor"
                          : "text-grayColor1",
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      <span className="flex items-center gap-1">
                        {item.label}
                        <MenueArrowDownIcon
                          className={cn(
                            "inline-block h-3 w-3 transition-transform duration-200",
                            isDropdownOpen
                              ? "rotate-180 text-headerColor"
                              : "text-grayColor1",
                          )}
                        />
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="center"
                    className="mt-3 w-[205px]  rounded-xl bg-whiteColor p-2 shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
                  >
                    {item.dropdownItems?.map((dropdownItem, index) => (
                      <DropdownMenuItem
                        key={dropdownItem.slug}
                        asChild
                        className={cn(
                          "cursor-pointer hover:bg-bgLightColor rounded-none px-3 py-2! text-base font-medium text-headerColor focus:bg-transparent",
                          index !== item.dropdownItems!.length - 1
                            ? "border-b border-borderColor"
                            : "",
                        )}
                      >
                        <Link href={dropdownItem.slug}>
                          {dropdownItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.slug}
                href={item.slug}
                className={cn(
                  "flex w-fit flex-col items-center gap-1 text-sm transition hover:text-headerColor",
                  isActive(item.slug) ? "text-headerColor" : "text-grayColor1",
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center space-x-[14px] lg:flex">
          <UserHeaderInfo />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <UserHeaderInfo />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-headerColor focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-full space-y-3 bg-blackColor/20 backdrop-blur-xs transform transition-transform duration-300 ease-in-out lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="absolute top-0 right-0 h-full max-w-[320px] w-[80%] bg-primaryColor p-4">
          <div className="mb-2 flex w-full items-center justify-between">
            <Image src={mainLogo} alt="Logo" width={50} height={50} />
            <button
              aria-label="close-menu"
              className="absolute top-4 right-4 z-10 text-white"
              onClick={() => setMenuOpen(false)}
            >
              <HiX className="text-2xl text-whiteColor" />
            </button>
          </div>

          {menuItems.map((item) => {
            const isMobileDropdownOpen = openMobileDropdownSlug === item.slug;

            if (item.isDropdown) {
              return (
                <div key={item.slug} className="py-1">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMobileDropdownSlug((previous) =>
                        previous === item.slug ? null : item.slug,
                      )
                    }
                    className={cn(
                      "flex w-full items-center justify-between gap-2 py-2 text-base",
                      isActive(item.slug)
                        ? "text-secondaryColor"
                        : "text-white",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4.5 w-4.5" />
                      {item.label}
                    </span>
                    <MenueArrowDownIcon
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isMobileDropdownOpen
                          ? "rotate-180 text-secondaryColor"
                          : "text-white",
                      )}
                    />
                  </button>

                  {isMobileDropdownOpen && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-white/20 pl-3">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.slug}
                          href={dropdownItem.slug}
                          className={cn(
                            "block py-1 text-sm text-white/90 transition hover:text-secondaryColor",
                            pathname === dropdownItem.slug
                              ? "text-secondaryColor"
                              : "text-white/90",
                          )}
                          onClick={() => {
                            setMenuOpen(false);
                            setOpenMobileDropdownSlug(null);
                          }}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.slug}
                href={item.slug}
                className={cn(
                  "flex items-center gap-2 py-2 text-base",
                  pathname === item.slug ? "text-secondaryColor" : "text-white",
                )}
                onClick={() => {
                  setMenuOpen(false);
                  setOpenMobileDropdownSlug(null);
                }}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
