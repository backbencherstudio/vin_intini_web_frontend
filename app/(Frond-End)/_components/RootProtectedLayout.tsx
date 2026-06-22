import MainFooter from "@/components/reusable/MainFooter";
import MainNavbar from "./mainPage/MainNavbar";

export default function RootProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-h-screen">
      <MainNavbar />
      <div className="container h-full w-full ">{children}</div>
      <MainFooter />
    </div>
  );
}
