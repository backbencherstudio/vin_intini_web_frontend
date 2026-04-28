"use client";

import CustomBackButton from "@/components/reusable/CustomBackButton";
import BreadCrumb from "@/helper/BreadCrumb";
import { buildSourceBreadcrumbs } from "@/lib/source-breadcrumb";
import { useEffect, useState } from "react";

export default function AcademiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [redirectUrl, setRedirectUrl] = useState("");

  const [bannerLinks, setBannerLinks] = useState<
    { label: string; href?: string }[]
  >([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateRedirect = () => {
      const value =
        new URLSearchParams(window.location.search).get("redirect") || "";
      setRedirectUrl(value);
    };

    updateRedirect();
    window.addEventListener("popstate", updateRedirect);

    return () => {
      window.removeEventListener("popstate", updateRedirect);
    };
  }, []);

  useEffect(() => {
    setBannerLinks(buildSourceBreadcrumbs(redirectUrl));
  }, [redirectUrl]);

  return (
    <div className="h-full grid grid-rows-[auto_1fr] grid-cols-1 pt-6 pb-10 sm:pt-8 sm:pb-14 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20 space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex items-center sm:gap-6">
        <CustomBackButton />
        <div className="hidden sm:block">
          <BreadCrumb links={bannerLinks} />
        </div>
      </div>
      <div className="w-full h-full grid">{children}</div>
    </div>
  );
}
