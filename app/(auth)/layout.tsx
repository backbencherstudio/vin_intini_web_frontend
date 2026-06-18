import MainFooter from "@/components/reusable/MainFooter";
import balckImage from "@/public/black_Logo.png";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-sectionColor space-y-10 md:space-y-20">
        <header
          className={`w-full border-b border-borderColor text-[#07C3BB] font-normal leading-[150%] tracking-[0.08px]`}
        >
          <div className="container py-4! grid grid-cols-[auto_auto] items-center justify-between gap-4">
            <Link href="/">
              <Image
                src={balckImage}
                alt="Logo"
                width={256}
                height={50}
                className="w-full max-w-32.5 lg:max-w-55.5 h-auto "
                priority
              />
            </Link>
            <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
              <Link
                href="/login"
                className="px-2 sm:px-4 py-0.5 sm:py-2 border border-[#07C3BB] rounded-lg sm:rounded-xl hover:rounded-md hover:bg-[#07C3BB] hover:text-white transition-all duration-300"
              >
                Sign in
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-lg bg-whiteColor rounded-lg p-4 md:p-6   mx-auto">
          {children}
        </div>
        <div className="mt-40">
          <MainFooter />
        </div>
      </div>
    </div>
  );
}

export default layout;
