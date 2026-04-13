import Footer from "@/app/(Frond-End)/_components/Footer";
import Navbar from "@/app/(Frond-End)/_components/Navbar";
export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
