import MainNavbar from "../_components/mainPage/MainNavbar";

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MainNavbar />
      {children}
    </div>
  );
}
