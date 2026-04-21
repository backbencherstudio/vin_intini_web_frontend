import MainPageLeftSidebar from "@/app/(Frond-End)/_components/mainPage/MainPageLeftSidebar";

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="  ">
        <div className="md:grid grid-cols-10 py-8 gap-6  md:py-10 mb-10">
          <div className="hidden md:block col-span-2 border-r border-[#D2D2D5] pr-6 h-full">
            <MainPageLeftSidebar />
          </div>
          <div className="md:col-span-8 col-span-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
