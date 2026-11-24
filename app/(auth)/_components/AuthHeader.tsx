"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/public/logo.png";

export default function AuthHeader() {
  const pathname = usePathname();

  const isLogin = pathname?.startsWith("/login");
  const isSignUp = pathname?.startsWith("/sign-up");

  const buttonConfig = isLogin
    ? { href: "/sign-up", label: "Sign up" }
    : isSignUp
    ? { href: "/login", label: "Sign in" }
    : { href: "/login", label: "Sign in" };

  return (
    <header className="sticky top-0 left-0 z-50 w-full border-b border-borderColor bg-whiteColor shadow-[0_2px_4px_0_rgba(0,0,0,0.02)] text-[#07C3BB] font-normal leading-[150%] tracking-[0.08px] transition-all">
      <div className="container mx-auto flex items-center justify-between gap-4 py-2.5 sm:py-3 md:py-3.5 min-h-[66px] md:min-h-[72px]">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="Logo"
            width={270}
            height={38}
            className="md:max-w-[270px] max-w-[180px] w-full h-auto block"
            priority
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
          <Link
            href={buttonConfig.href}
            className="px-4 sm:px-5 py-1.5 sm:py-2 border border-[#07C3BB] text-[#07C3BB] rounded-lg sm:rounded-xl hover:bg-[#07C3BB] hover:text-white transition-all duration-300 font-medium cursor-pointer"
          >
            {buttonConfig.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
