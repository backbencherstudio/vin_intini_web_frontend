"use client";

import { usePathname } from "next/navigation";

const routeMeta: Record<
  string,
  { title: string; desc: string }
> = {
  "/dashboard": {
    title: "Dashboard Overview",
    desc: "Welcome back! Here's what's happening with your service today.",
  },

  "/dashboard/homeowners": {
    title: "Homeowners",
    desc: "Manage all homeowner accounts and their activities.",
  },

  "/dashboard/cleaners": {
    title: "Cleaners",
    desc: "Manage all cleaner accounts the and their activities.",
  },

  "/dashboard/cleaner-request": {
    title: "Cleaners Request",
    desc: "Review and manage cleaner applications, documents, and verification status.",
  },

  "/dashboard/booking": {
    title: "Bookings",
    desc: "Manage all booking accounts and their activities.",
  },

  "/dashboard/payments": {
    title: "Payments",
    desc: "View and manage payment transactions.",
  },

  "/dashboard/jobAppruve": {
    title: "Job Approvals",
    desc: "Approve or reject job requests from homeowners.",
  },

  "/dashboard/danger-request": {
    title: "Danger Request",
    desc: "Manage all homeowner accounts and their activities.",
  },
};

export default function DashboardHeader() {
  const pathname = usePathname();

  const meta = routeMeta[pathname] ?? {
    title: "Dashboard",
    desc: "Manage your dashboard and activities.",
  };

  return (
    <div className="sticky top-0 z-10 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="pb-3 text-2xl font-bold leading-[120%] text-[#101828] lg:text-3xl">
            {meta.title}
          </h3>

          <p className="text-base font-normal text-[#4A5565]">
            {meta.desc}
          </p>
        </div>
      </div>
    </div>
  );
}