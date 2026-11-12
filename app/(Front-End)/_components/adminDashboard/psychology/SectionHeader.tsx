"use client";

import Link from "next/link";
import { ArrowRight, PlusIcon } from "lucide-react";
import CustomButton, {
  customButtonVariants,
} from "@/components/reusable/dashboard/CustomButton";

interface SectionHeaderProps {
  title: string;
  totalCount?: number;
  seeMoreHref?: string;
  seeMoreLabel?: string;
  expanded?: boolean;
  canExpand?: boolean;
  isLoadingMore?: boolean;
  onToggleExpand?: () => void;
  onAddToSection?: () => void;
}

export default function SectionHeader({
  title,
  totalCount,
  seeMoreHref,
  seeMoreLabel = "See More",
  expanded = false,
  canExpand = false,
  isLoadingMore = false,
  onToggleExpand,
  onAddToSection,
}: SectionHeaderProps) {
  const showSeeMoreLink =
    Boolean(seeMoreHref) &&
    (typeof totalCount !== "number" || totalCount > 0);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="text-lg font-bold tracking-tight text-[#1D1F2C] sm:text-xl">
          {title}
        </h2>
        {typeof totalCount === "number" && (
          <span className="rounded-full border border-[#E5E7EB] bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-[#4A4C56]">
            {totalCount} {totalCount === 1 ? "product" : "products"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onAddToSection && (
          <CustomButton
            variant="outline"
            size="sm"
            onClick={onAddToSection}
            className="gap-1.5"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>Add Product</span>
          </CustomButton>
        )}

        {showSeeMoreLink && seeMoreHref ? (
          <Link
            href={seeMoreHref}
            className={customButtonVariants({ variant: "primary", size: "sm" })}
          >
            <span>{seeMoreLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          canExpand &&
          onToggleExpand && (
            <CustomButton
              variant="primary"
              size="sm"
              loading={isLoadingMore}
              loadingText="Loading..."
              onClick={onToggleExpand}
            >
              {expanded ? "Show Less" : "See More"}
            </CustomButton>
          )
        )}
      </div>
    </div>
  );
}
