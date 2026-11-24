"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateCompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetUserProfileQuery("Profile");

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
    !isIndustryUser &&
    (data?.subscription?.plan_type === "premium" ||
      Boolean(data?.subscription?.is_subscribed));

  useEffect(() => {
    if (isLoading) return;

    if (!data || isError) {
      router.replace("/mu/home");
      return;
    }

    // Rule: Premium users cannot access company creation route
    if (isPremium) {
      toast.error(
        "Access restricted: Premium users cannot create a company page. Industry Pro account required."
      );
      router.replace("/mu/premium/publications");
    }
  }, [isLoading, isError, data, isPremium, router]);

  // Loading skeleton while verifying permissions
  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primaryColor" />
        <span className="text-sm text-descriptionColor font-medium">
          Verifying account permissions...
        </span>
      </div>
    );
  }

  // Prevent flash of page for premium users
  if (isPremium) {
    return null;
  }

  return <>{children}</>;
}
