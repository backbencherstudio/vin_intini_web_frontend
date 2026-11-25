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
  const { isError, error } = useGetUserProfileQuery("userProfile");

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
      }
    };

    verifyAuth();

    return () => {
      active = false;
    };
  }, [pathname, isError, error]);

  const noContainerRoutes = ["/mu/about-us"];

  const shouldUseContainer = !noContainerRoutes.includes(pathname);

  return (
    <div className="min-h-screen">
      <MainNavbar />

      {shouldUseContainer ? (
        <div className="container h-full w-full">
          {children}
        </div>
      ) : (
        children
      )}

      <MainFooter />
    </div>
  );
}

// import MainNavbar from "./mainPage/MainNavbar";
// import MainFooter from "@/components/reusable/MainFooter";

// export default function RootProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className=" min-h-screen">
//       <MainNavbar />
//       <div className="container h-full w-full ">{children}</div>
//       <MainFooter />
//     </div>
//   );
// }
