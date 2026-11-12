"use client";

export interface CategoryTab {
  id: string;
  label: string;
  count?: number;
}

interface CategoryTabsProps {
  tabs: CategoryTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

export default function CategoryTabs({
  tabs,
  activeTabId,
  onTabChange,
}: CategoryTabsProps) {
  return (
    <div className="mb-5 inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-[#E5E7EB] bg-white p-1.5">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              isActive
                ? "bg-[#111827] text-white shadow-xs"
                : "text-[#4A4C56] hover:bg-gray-100 hover:text-[#1D1F2C]"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
