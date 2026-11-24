"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, isError } = useGetUserProfileQuery("Profile");

  // Determine user role and capabilities
  const hasCompany = Boolean(
    data?.industry?.has_company ||
      data?.industry?.company?.id ||
      data?.industry?.company
  );
  const isIndustryPlan =
    data?.subscription?.plan_type === "industry" ||
    data?.subscription?.type === "industry";
  const isIndustryUser = hasCompany || isIndustryPlan;

  const isPremium =
    data?.subscription?.plan_type === "premium" ||
    Boolean(data?.subscription?.is_subscribed);
  const isAdmin = Boolean(
    data?.user?.role?.toLowerCase()?.includes("admin") ||
      data?.user?.role?.toLowerCase()?.includes("super-admin")
  );

  useEffect(() => {
    if (isLoading) return;

    if (!data || isError) {
      router.replace("/mu/home");
      return;
    }

    // Rule 1: Industry Pro users MUST NOT access /mu/premium/* routes.
    // Redirect them to their corresponding Industry Pro publications dashboard.
    if (isIndustryUser) {
      if (pathname.startsWith("/mu/premium/publications")) {
        if (pathname.includes("/boosting-plan")) {
          const matches = pathname.match(
            /\/mu\/premium\/publications\/([^/]+)\/boosting-plan/
          );
          const pubId = matches ? matches[1] : "";
          router.replace(
            pubId
              ? `/mu/publications/${pubId}/boosting-plan`
              : "/mu/publications"
          );
        } else if (pathname.includes("/create")) {
          router.replace("/mu/publications/create");
        } else if (pathname.includes("/edit")) {
          const matches = pathname.match(
            /\/mu\/premium\/publications\/([^/]+)\/edit/
          );
          const pubId = matches ? matches[1] : "";
          router.replace(
            pubId ? `/mu/publications/${pubId}/edit` : "/mu/publications"
          );
        } else {
          router.replace("/mu/publications");
        }
        return;
      }

      router.replace("/mu/publications");
      return;
    }

    // Rule 2: Non-industry, non-premium users cannot access premium management routes.
    if (!isPremium && !isAdmin) {
      toast.error("Premium subscription required to access this page.");
      router.replace("/mu/home");
    }
  }, [isLoading, isError, data, isIndustryUser, isPremium, isAdmin, pathname, router]);

  // Loading indicator while verifying credentials
  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primaryColor" />
        <span className="text-sm text-descriptionColor font-medium">
          Verifying access permissions...
        </span>
      </div>
    );
  }

  // Prevent flash of unauthorized content for Industry Pro users
  if (isIndustryUser || (!isPremium && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
