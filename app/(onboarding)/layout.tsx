import MainFooter from "@/components/reusable/MainFooter";
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
              <Image src="/black_Logo.png" alt="Logo" width={256} height={50} />
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
