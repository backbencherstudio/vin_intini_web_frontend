import MainFooter from "@/components/reusable/MainFooter";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-sectionColor space-y-10 md:space-y-20">
        <header
          className={`sticky top-0 left-0 z-50 w-full border-b border-borderColor bg-whiteColor shadow-[0_2px_4px_0_rgba(0,0,0,0.02)] text-primaryColor font-normal leading-[150%] tracking-[0.08px] transition-all`}
        >
          <div className="container mx-auto py-2.5 sm:py-3 md:py-3.5 min-h-[66px] md:min-h-[72px] flex items-center justify-center">
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
          </div>
        </header>
        <div>{children}</div>
        <div className="mt-40">
          <MainFooter />
        </div>
      </div>
    </div>
  );
}

export default OnboardingLayout;
