"use client";

import CustomBackButton from "@/components/reusable/CustomBackButton";
import BreadCrumb from "@/helper/BreadCrumb";
import { buildSourceBreadcrumbs } from "@/lib/source-breadcrumb";
import { useEffect, useState } from "react";
import { AcademiaProvider, useAcademiaContext } from "./AcademiaContext";
import { AiOutlineMenuFold } from "react-icons/ai";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { usePathname, useSearchParams } from "next/navigation";

export default function AcademiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bannerLinks, setBannerLinks] = useState<
    { label: string; href?: string }[]
  >([]);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  


  useEffect(() => {
    setBannerLinks(buildSourceBreadcrumbs(redirect));
    console.log("Updated banner links based on redirect URL:", bannerLinks);
  }, [redirect]);

  return (
    <AcademiaProvider>
      <AcademiaLayoutContent bannerLinks={bannerLinks}>{children}</AcademiaLayoutContent>
    </AcademiaProvider>
  );
}

function AcademiaLayoutContent({ bannerLinks, children }: { bannerLinks: { label: string; href?: string }[]; children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useAcademiaContext();
  const pathname = usePathname();
  return (
    <div className="h-full grid grid-rows-[auto_1fr] grid-cols-1 container pt-6! pb-10! sm:pt-8! sm:pb-14! md:pt-10! md:pb-16! lg:pt-12! lg:pb-20! space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center sm:gap-6">
          <CustomBackButton />
          <div className="hidden sm:block">
            <BreadCrumb links={bannerLinks} />
          </div>
        </div>
        <div className={`xl:hidden h-fit ${pathname.includes("/mu/academia/") ? "block" : "hidden"}`}>
          <div className="flex justify-end">
            <button type="button" onClick={() => setIsOpen(prev => !prev)} className="relative cursor-default hover:bg-gray-200 transition-colors duration-300 p-1 rounded">
              {isOpen ?
                <AiOutlineMenuFold className="text-2xl text-headerColor" />
                :
                <AiOutlineMenuUnfold className="text-2xl text-headerColor" />
              }
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-full grid">{children}</div>
    </div>
  );
}
