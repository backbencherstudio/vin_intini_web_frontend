import MainFooter from "@/components/reusable/MainFooter";
import MainNavbar from "../../_components/mainPage/MainNavbar";

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MainNavbar />
      {children}
      <MainFooter />
    </div>
  );
}
