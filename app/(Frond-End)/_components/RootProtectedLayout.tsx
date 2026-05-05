"use client";

import MainFooter from "@/components/reusable/MainFooter";
import { CookieHelper } from "@/helper/cookie.helper";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import MainNavbar from "./mainPage/MainNavbar";

export default function RootProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("auth");
    useEffect(()=>{
      if(token){
        CookieHelper.set({key: "accessToken", value: JSON.parse(atob(token || "")).token});
        router.push("/mu/home")
      }
    },[token])

  return (
    <div className=" grid grid-rows-[auto_1fr_auto] min-h-screen">
      <MainNavbar />
      <div className="container h-full w-full  ">{children}</div>
      <MainFooter />
    </div>
  );
}
