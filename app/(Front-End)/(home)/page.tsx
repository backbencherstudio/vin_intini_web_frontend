import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Features from "./_components/Features";
import GetApp from "./_components/GetApp";
import Hero from "./_components/Hero";
import HowWeWork from "./_components/HowWeWork";
import OurImpact from "./_components/OurImpact";

function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (token) {
    const payload = parseJwt(token);
    if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
      const role = payload.role || "user";
      if (role === "admin" || role === "super-admin") {
        redirect("/dashboard");
      }
      redirect("/mu/home");
    }
  }

  return (
    <div className="w-full h-full">
      <Hero />
      <Features />
      <HowWeWork />
      {/* <Testimonials /> */}
      {/* <Opportunities /> */}
      <OurImpact />
      <GetApp />
    </div>
  );
}

