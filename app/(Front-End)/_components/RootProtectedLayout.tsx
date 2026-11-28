"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import MainNavbar from "./mainPage/MainNavbar";
import MainFooter from "@/components/reusable/MainFooter";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { clearToken, getToken } from "@/lib/token";

export default function RootProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: userProfile, isLoading, isFetching, isError, error } =
    useGetUserProfileQuery("userProfile");

  const isOnboardingIncomplete =
    Boolean(userProfile) && userProfile?.is_onboarding === false;

  useEffect(() => {
    let active = true;

    const verifyAuth = async () => {
      const token = await getToken();
      if (!active) return;

      if (!token) {
        await clearToken();
        window.location.replace("/login");
        return;
      }

      if (isError && (error as any)?.status === 401) {
        await clearToken();
        window.location.replace("/login");
        return;
      }

      if (
        (!isFetching && isOnboardingIncomplete) ||
        (isError &&
          (error as any)?.status === 403 &&
          String((error as any)?.data?.message || "").includes(
            "Profile setup required",
          ))
      ) {
        window.location.replace("/onboarding");
      }
    };

    verifyAuth();

    return () => {
      active = false;
    };
  }, [pathname, isError, error, isFetching, isOnboardingIncomplete]);

  const noContainerRoutes = ["/mu/about-us"];

  const shouldUseContainer = !noContainerRoutes.includes(pathname);

  if (isLoading || (isFetching && isOnboardingIncomplete) || isOnboardingIncomplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primaryColor border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MainNavbar />

      {shouldUseContainer ? (
        <div className="container h-full w-full">{children}</div>
      ) : (
        children
      )}

      <MainFooter />
    </div>
  );
}
