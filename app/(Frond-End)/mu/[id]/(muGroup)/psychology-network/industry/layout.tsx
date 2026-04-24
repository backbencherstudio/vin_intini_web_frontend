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
      {/* Mobile Layout */}
      <div className="flex w-full flex-col gap-6 px-4 pt-6 lg:hidden">
        <PartnersSidebar />
        <IndustrySidebar />
        <div className="w-full">{children}</div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden w-full max-w-90 gap-6 pt-10 sm:max-w-2xl lg:flex md:max-w-4xl lg:max-w-6xl xl:max-w-360">
        <IndustrySidebar />
        <div className="flex-1">{children}</div>
        <PartnersSidebar />
      </div>
    </>
  );
}
