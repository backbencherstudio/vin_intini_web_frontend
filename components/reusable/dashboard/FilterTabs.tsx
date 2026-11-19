// components/FilterTabs.tsx
"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  /** Query param key (default: "tab") */
  paramKey?: string;
  className?: string;
}

export default function FilterTabs({
  tabs,
  paramKey = "tab",
  className = "",
}: FilterTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current active tab from URL (fallback to first tab)
  const activeTab = searchParams.get(paramKey) || tabs[0]?.id;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        // Build new URL with the selected tab
        const params = new URLSearchParams(searchParams.toString());
        if (tab.id === tabs[0]?.id) {
          // Optional: remove param when selecting the default tab ("All")
          params.delete(paramKey);
        } else {
          params.set(paramKey, tab.id);
        }

        const href = `${pathname}?${params.toString()}`;

        return (
          <Link
            key={tab.id}
            href={href}
            className={`inline-flex h-10 items-center justify-center px-5 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? "bg-[#04A1B7] text-white border border-[#04A1B7] shadow-xs hover:bg-[#038A9D]"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}