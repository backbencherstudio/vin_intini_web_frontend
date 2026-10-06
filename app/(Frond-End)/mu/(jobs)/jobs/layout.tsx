import Breadcrumb from "../../../_components/Breadcrumb";
import JobsLeftSidebar from "./_component/JobsLeftSidebar";
import TopJobsRightbar from "./_component/TopJobsRightbar";

export default async function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="">
        <div className="lg:grid lg:grid-cols-11  sm:pb-8 pb-6 gap-4 xl:gap-6 mb-10">
          <div className="xl:col-span-7  border-[#D2D2D5] lg:col-span-7 col-span-12">
            {children}
          </div>
          <div className="hidden lg:block col-span-4   lg:sticky lg:top-19  lg:overflow-y-auto self-start">
            <TopJobsRightbar />
          </div>
        </div>
        {/* <div>{children}</div> */}
      </div>
    </div>
  );
}
