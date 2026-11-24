import Navbar from "@/app/(Front-End)/_components/Navbar";
import Footer from "../_components/Footer";
export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="w-full flex-1">
        {children}
        <Footer />
      </main>
    </div>
  );
}
