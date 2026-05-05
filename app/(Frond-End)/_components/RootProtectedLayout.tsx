"use client";

import MainFooter from "@/components/reusable/MainFooter";
import MainNavbar from "./mainPage/MainNavbar";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CookieHelper } from "@/helper/cookie.helper";
import { useRouter } from "next/navigation";

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
        // console.log("token", token);
        CookieHelper.set({key: "accessToken", value: token});
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