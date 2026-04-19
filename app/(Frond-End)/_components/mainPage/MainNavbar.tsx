"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiOutlineMenu, HiX } from "react-icons/hi";

import { cn } from "@/lib/utils";

const menuItems = [
  { en: "Home", slug: "/" },
  { en: "Apartment", slug: "#" },
  { en: "Hotel", slug: "#" },
  { en: "Tours", slug: "#" },
  { en: "Contact Us", slug: "#" },
];

export default function MainNavbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primaryColor py-4 px-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <h2 className="text-white text-3xl font-semibold tracking-wide">
          LOGO
        </h2>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-base">
          {menuItems.map((item) => (
            <Link
              key={item.slug}
              href={item.slug}
              className={cn(
                "hover:text-secondaryColor transition",
                pathname === item.slug ? "text-secondaryColor" : "text-white",
              )}
            >
              {item.en}
            </Link>
          ))}
        </nav>

        {/* Right: Language, Auth Buttons */}
        <div className="hidden md:flex items-center space-x-[14px]">
          {/* Language Dropdown */}
          <Link href="/login" className="text-white text-base">
            Login
          </Link>
          <Link
            href="/registration"
            className="bg-secondaryColor text-blackColor font-medium cursor-pointer  text-base px-4 py-2 rounded-[8px]"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
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
          "md:hidden fixed top-0 right-0 w-full bg-blackColor/20 backdrop-blur-xs h-screen    space-y-3 z-50 transform transition-transform duration-300 ease-in-out",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="w-[80%]  absolute top-0 p-4 right-0 h-full bg-primaryColor max-w-[320px]">
          <div className="flex w-full justify-between items-center mb-2">
            <h2 className="text-white text-2xl font-semibold tracking-wide">
              LOGO
            </h2>
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
                "block text-base py-2",
                pathname === item.slug ? "text-secondaryColor" : "text-white",
              )}
              onClick={() => setMenuOpen(false)}
            >
              {item.en}
            </Link>
          ))}
          <div className="flex items-center justify-between">
            <Link
              href="/login"
              className="text-white text-base"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/registration"
              className="bg-secondaryColor inline-block text-blackColor font-medium cursor-pointer text-base px-4 py-2 rounded-[8px]"
              onClick={() => setMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
