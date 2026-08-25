import JobsLeftSidebar from "./_component/JobsLeftSidebar";

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="">
        <div className="lg:grid lg:grid-cols-12  sm:py-8 py-6 gap-4 xl:gap-6 md:py-10 mb-10">
          <div className="hidden lg:block col-span-3   lg:sticky lg:top-19  lg:overflow-y-auto self-start">
            <JobsLeftSidebar />
          </div>
          <div className="xl:col-span-8 lg:border-l lg:pl-6 border-[#D2D2D5] lg:col-span-6 col-span-12">
            {children}
          </div>
          <div className="hidden lg:block col-span-3   lg:sticky lg:top-19  lg:overflow-y-auto self-start">
            <JobsLeftSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
