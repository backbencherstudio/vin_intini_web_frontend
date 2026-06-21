// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/industry/layout.tsx

import { IndustrySidebar } from "./_components/IndustrySidebar";
import { PartnersSidebar } from "./_components/PartnersSidebar";

export default function IndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile Layout - Keep as is */}
      <div className="flex w-full flex-col gap-6 pt-6 lg:hidden">
        <PartnersSidebar />
        <IndustrySidebar />
        <div className="w-full min-w-0">{children}</div>
      </div>

      {/* Desktop Layout - Modified for sticky sidebars */}
      <div className="hidden w-full gap-6 pt-10 lg:flex">
        {/* Left Sidebar - Sticky with proper offset */}
        <div className="sticky top-24 h-fit  shrink-0">
          <IndustrySidebar />
        </div>

        {/* Main Content - Scrollable */}
        <div className="min-w-0 flex-1">
          {children}
        </div>

        {/* Right Sidebar - Sticky with proper offset */}
        <div className="sticky top-24 h-fit w-85.5 shrink-0">
          <PartnersSidebar />
        </div>
      </div>
    </>
  );
}
