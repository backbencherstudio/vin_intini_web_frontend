import type {
  AdminIndustryType,
  AdminNetworkType,
  AdminProductsSummary,
  AdminProductStatus,
} from "@/feature/slice/admin/products";

export type StatusFilterValue = AdminProductStatus | "all";

export const PAGE_META_MAP: Record<
  `${AdminNetworkType}:${AdminIndustryType}`,
  {
    title: string;
    subtitle: string;
    baseHref: string;
    categoriesHref: string;
  }
> = {
  "psychology:biotechnology": {
    title: "Psychology Biotechnology Products",
    subtitle:
      "Manage industry-added biotechnology products and upload new products under verified industries.",
    baseHref: "/dashboard/psychology/biotechnology",
    categoriesHref: "/dashboard/categories/psychology",
  },
  "psychology:psychotropics": {
    title: "Psychology Psychotropics Products",
    subtitle:
      "Manage industry-added psychotropics products and upload new products under verified industries.",
    baseHref: "/dashboard/psychology/psychotropics",
    categoriesHref: "/dashboard/categories/psychology",
  },
  "neuroscience:biotechnology": {
    title: "Neuroscience Biotechnology Products",
    subtitle:
      "Manage industry-added biotechnology products and upload new products under verified industries.",
    baseHref: "/dashboard/neuroscience/biotechnology",
    categoriesHref: "/dashboard/categories/neuroscience",
  },
  "neuroscience:psychotropics": {
    title: "Neuroscience Psychotropics Products",
    subtitle:
      "Manage industry-added psychotropics products and upload new products under verified industries.",
    baseHref: "/dashboard/neuroscience/psychotropics",
    categoriesHref: "/dashboard/categories/neuroscience",
  },
};

export function buildStatusTabs(summary: AdminProductsSummary): Array<{
  value: StatusFilterValue;
  label: string;
  count: number;
}> {
  return [
    { value: "all", label: "All", count: summary.total_products },
    { value: "active", label: "Active", count: summary.active_products },
    { value: "inactive", label: "Inactive", count: summary.inactive_products },
    { value: "draft", label: "Draft", count: summary.draft_products },
    {
      value: "rejected",
      label: "Rejected",
      count: summary.rejected_products ?? 0,
    },
  ];
}

