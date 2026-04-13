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

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primaryColor py-4 px-4">
     
    </header>
  );
}
