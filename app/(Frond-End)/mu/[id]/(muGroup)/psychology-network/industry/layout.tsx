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
      {/* Mobile & Tablet Layout - Shows up to 1024px (lg) */}
      <div className="flex w-full flex-col gap-6 px-4 pt-6 lg:hidden">
        <PartnersSidebar />
        <IndustrySidebar />
        <div className="w-full">{children}</div>
      </div>

      {/* Desktop Layout - Shows from 1024px (lg) and above */}
      <div className="hidden w-full items-stretch gap-6 pt-10 lg:flex">
        <div className="w-66 shrink-0">
          <IndustrySidebar />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
        <div className="w-85.5 shrink-0">
          <PartnersSidebar />
        </div>
      </div>
    </>
  );
}
