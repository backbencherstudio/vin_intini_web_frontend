"use client";

import CustomBackButton from "@/components/reusable/CustomBackButton";
import BreadCrumb from "@/helper/BreadCrumb";
import { buildSourceBreadcrumbs } from "@/lib/source-breadcrumb";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AcademiaLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "";

    const [bannerLinks, setBannerLinks] = useState<{ label: string; href?: string }[]>([]);


    useEffect(() => {
        setBannerLinks(buildSourceBreadcrumbs(redirectUrl));
    }, [redirectUrl]);

    return (
        <div className="h-full grid grid-rows-[auto_1fr] grid-cols-1 pt-6 pb-10 sm:pt-8 sm:pb-14 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20 space-y-4 sm:space-y-5 md:space-y-6">
            <div className="flex items-center gap-6">
                <CustomBackButton />
                <BreadCrumb links={bannerLinks}/>
            </div>
            <div className="w-full h-full grid">
                {children}
            </div>
        </div>
    );
}