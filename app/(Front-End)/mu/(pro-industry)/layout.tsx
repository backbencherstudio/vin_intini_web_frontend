"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb from "../../_components/Breadcrumb";
import ProIndustrySidebar from "./_component/ProIndustrySidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isError } = useGetUserProfileQuery("Profile");

  // Determine user authorization for Industry Pro dashboard
  const hasCompany = Boolean(
    data?.industry?.has_company ||
      data?.industry?.company?.id ||
      data?.industry?.company
  );
  const isIndustryPlan =
    data?.subscription?.plan_type === "industry" ||
    data?.subscription?.type === "industry";
  const isAdmin = Boolean(
    data?.user?.role?.toLowerCase()?.includes("admin") ||
      data?.user?.role?.toLowerCase()?.includes("super-admin")
  );
  const isIndustryUser = hasCompany || isIndustryPlan || isAdmin;

  const isPremium =
    data?.subscription?.plan_type === "premium" ||
    Boolean(data?.subscription?.is_subscribed);

  useEffect(() => {
    if (isLoading) return;

    if (!data || isError) {
      router.replace("/mu/home");
      return;
    }

    if (!isIndustryUser) {
      // If a Premium user visits publication routes under (pro-industry),
      // seamlessly redirect them to their dedicated /mu/premium/publications pages
      if (pathname.startsWith("/mu/publications")) {
        if (isPremium) {
          if (pathname.includes("/boosting-plan")) {
            const matches = pathname.match(
              /\/mu\/publications\/([^/]+)\/boosting-plan/
            );
            const pubId = matches ? matches[1] : "";
            router.replace(
              pubId
                ? `/mu/premium/publications/${pubId}/boosting-plan`
                : "/mu/premium/publications"
            );
          } else if (pathname.includes("/create")) {
            router.replace("/mu/premium/publications/create");
          } else if (pathname.includes("/edit")) {
            const matches = pathname.match(
              /\/mu\/publications\/([^/]+)\/edit/
            );
            const pubId = matches ? matches[1] : "";
            router.replace(
              pubId
                ? `/mu/premium/publications/${pubId}/edit`
                : "/mu/premium/publications"
            );
          } else {
            router.replace("/mu/premium/publications");
          }
          return;
        } else {
          toast.error("Industry Pro access required.");
          router.replace("/mu/home");
          return;
        }
      }

      // Any other Industry Pro dashboard route (/mu/products, /mu/advertisment, /mu/industry-profile, etc.)
      toast.error("Access restricted: Industry Pro account required.");
      router.replace("/mu/home");
    }
  }, [isLoading, isError, data, isIndustryUser, isPremium, pathname, router]);

  // Loading skeleton while verifying access
  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primaryColor" />
        <span className="text-sm text-descriptionColor font-medium">
          Verifying Industry Pro access...
        </span>
      </div>
    );
  }

  // Prevent any flash of unauthorized content
  if (!isIndustryUser) {
    return null;
  }

  return (
    <div>
      <Breadcrumb />
      <div className="lg:grid lg:grid-cols-8 xl:grid-cols-10 sm:pb-8 pb-6 gap-6 md:pb-10 mb-10">
        <div className="hidden lg:block col-span-2 lg:sticky lg:top-25 lg:overflow-y-auto self-start">
          <ProIndustrySidebar />
        </div>
        <div className="xl:col-span-8 lg:border-l lg:pl-6 border-[#D2D2D5] lg:col-span-6 col-span-12">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
