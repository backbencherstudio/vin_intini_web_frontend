import MainFooter from "@/components/reusable/MainFooter";
import balckImage from "@/public/black_Logo.png";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-sectionColor space-y-10 md:space-y-20">
        <header
          className={`w-full border-b border-borderColor text-primaryColor font-normal leading-[150%] tracking-[0.08px]`}
        >
          <div className="container py-4! flex justify-center ">
            <Link href="/">
              <Image
                src={balckImage}
                alt="Logo"
                width={296}
                height={50}
                className="w-full max-w-32.5 lg:max-w-62.5 h-auto "
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
