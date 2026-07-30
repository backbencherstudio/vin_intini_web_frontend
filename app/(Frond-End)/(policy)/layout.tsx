import MainFooter from "@/components/reusable/MainFooter";

import { cookies } from "next/headers";
import React from "react";
import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";
import MainNavbar from "../_components/mainPage/MainNavbar";

export async function getToken() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("accessToken")?.value;

    return token || null;
  } catch (error) {
    console.error("Error getting token from cookies:", error);
    return null;
  }
}
async function layout({ children }: { children: React.ReactNode }) {
  const token = await getToken();

  return (
    <div className="min-h-screen">
      {token ? <MainNavbar /> : <Navbar />}

      <div className="container h-full w-full">{children}</div>
      {token ? <MainFooter /> : <Footer />}
    </div>
  );
}

export default layout;
