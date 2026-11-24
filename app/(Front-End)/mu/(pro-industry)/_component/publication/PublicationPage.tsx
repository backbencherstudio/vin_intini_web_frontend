"use client";

import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonStateCard, {
  CommonStateCardProps,
} from "@/components/reusable/CommonStateCard";
import DynamicTable from "@/components/reusable/DynamicTable";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import Pagination from "@/components/reusable/Pagination";
import Search from "@/components/reusable/Search";
import { useGetMyPublicationsQuery } from "@/feature/slice/jobs/publicationSlice";
import {
  ApplicantIcon,
  OpenEyeIcon,
  PublicationsMenueIcon,
} from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import { ArrowUpRight, Calendar1, FileText, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PublicationAction from "./PublicationAction";
import PublicationStatusUpdate from "./PublicationStatusUpdate";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";

export default function PublicationPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("search") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: userProfileData } = useGetUserProfileQuery("user");
  const isPremiumPlan = userProfileData?.subscription?.plan_type === "premium";
  const isPremiumView = Boolean(isPremiumPlan || pathname?.includes("/premium"));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // API Queries
  const {
    data: myPublicationsResponse,
    isLoading: isMyPublicationsLoading,
    isFetching: isMyPublicationsFetching,
  } = useGetMyPublicationsQuery({
    page: currentPage,
    per_page: perPage,
    ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
  });

  const publicationsList: any[] = myPublicationsResponse?.data || [];
  const pagination = myPublicationsResponse?.pagination;
  const insightCards = myPublicationsResponse?.cards;

  // Top Stat Cards configuration
  const stateCards: CommonStateCardProps[] = [
    {
      title: "All Publications",
      total: insightCards?.total_publications?.total ?? 0,
      badgeText: insightCards?.total_publications?.growth ?? "+2.8%",
      isPositive: insightCards?.total_publications?.is_positive,

      icon: PublicationsMenueIcon,
      iconBg: "bg-[#E6F8F6]",
      iconColor: "text-primaryColor",
    },
    {
      title: "Active Publications",
      total: insightCards?.active_publications?.total ?? 0,
      badgeText: insightCards?.active_publications?.growth ?? "Stable",
      isPositive: insightCards?.active_publications?.is_positive,

      icon: ApplicantIcon,
      iconBg: "bg-[#E6F8F6]",
      iconColor: "text-primaryColor",
    },
    {
      title: "Publication Views",
      total: insightCards?.publications_views?.total ?? 0,
      badgeText: insightCards?.publications_views?.growth ?? "+54%",
      isPositive: insightCards?.publications_views?.is_positive,

      icon: OpenEyeIcon,
      iconBg: "bg-[#E6F8F6]",
      iconColor: "text-primaryColor",
    },
    {
      title: "Boost Impressions",
      total:
        insightCards?.boost_impressions?.total ??
        insightCards?.total_impressions?.total ??
        0,
      badgeText: insightCards?.boost_impressions?.growth ?? "Active",
      isPositive: true,

      icon: Zap,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  // Table Columns Definition matching senior UI/UX standard
  const columns = [
    {
      label: "No.",
      accessor: "no",
      position: "justify-center",
      width: "55px",
      formatter: (_: any, __: any, index: number) => (
        <span className="text-sm font-semibold text-headerColor text-center block px-2">
          {(currentPage - 1) * perPage + index + 1}
        </span>
      ),
    },
    {
      label: "Publications",
      accessor: "title",
      position: "justify-start",
      width: "320px",
      formatter: (_: any, row: any) => {
        const isBoosted = Boolean(
          row.is_boosted || (row.boost_days_left && row.boost_days_left > 0)
        );
        const boostText =
          row.boost_remaining_text ||
          (row.boost_days_left ? `${row.boost_days_left} days left` : "Boosted");

        return (
          <div className="flex items-center gap-3 py-2.5 px-3">
            {/* Visual Icon / Document Thumbnail */}
            <div className="w-10 h-10 rounded-xl bg-primaryColor/10 border border-primaryColor/20 text-primaryColor flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5 text-primaryColor" />
            </div>

            <div className="min-w-0 flex items-center gap-2 flex-wrap">
              <h4
                title={row.title}
                className="font-semibold text-sm text-headerColor hover:text-primaryColor transition-colors truncate max-w-[220px] sm:max-w-[280px] cursor-pointer"
              >
                {row.title || "Untitled Publication"}
              </h4>
              {row.website_url && (
                <a
                  href={row.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open external article source"
                  className="text-gray-400 hover:text-primaryColor transition-colors shrink-0"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              {isBoosted ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 whitespace-nowrap">
                  <Zap className="w-3 h-3 fill-purple-600 text-purple-600" />
                  <span>{boostText}</span>
                </span>
              ) : (row.is_new_release || row.badge === "New Release") ? (
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 whitespace-nowrap">
                  New Release
                </span>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      label: "Network",
      accessor: "network_type",
      position: "justify-start",
      width: "130px",
      formatter: (val: string) => {
        const network = String(val || "psychology").toLowerCase();
        const isPsychology = network === "psychology";
        const isNeuroscience = network === "neuroscience";

        return (
          <div className="px-3">
            <span
              className={`inline-block text-xs leading-[140%] font-semibold px-2.5 py-0.5 rounded-full capitalize whitespace-nowrap ${
                isPsychology
                  ? "bg-orengeColor/10 text-orengeColor border border-orengeColor/30"
                  : isNeuroscience
                    ? "bg-blueColor/10 text-blueColor border border-blueColor/30"
                    : "bg-primaryColor/10 text-primaryColor border border-primaryColor/30"
              }`}
            >
              {val || "Psychology"}
            </span>
          </div>
        );
      },
    },
    {
      label: "Publish Date",
      accessor: "created_at",
      position: "justify-start",
      width: "140px",
      formatter: (val: string) => (
        <div className="flex items-center gap-1.5 px-3 text-xs leading-[140%] font-medium text-descriptionColor whitespace-nowrap">
          <Calendar1 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{val ? dayjs(val).format("DD MMM YYYY") : "—"}</span>
        </div>
      ),
    },
    {
      label: "Views",
      accessor: "views_count",
      position: "justify-center",
      width: "90px",
      formatter: (val: any, row: any) => {
        const isBoosted = Boolean(row.is_boosted || row.is_sponsored);
        return (
          <div
            className="flex items-center justify-center gap-1.5 px-3 text-sm font-semibold text-headerColor whitespace-nowrap cursor-default"
            title={
              isBoosted
                ? `${(row.impressions_count ?? 0).toLocaleString()} impressions • ${(row.clicks_count ?? 0).toLocaleString()} clicks`
                : `${(val ?? 0).toLocaleString()} total views`
            }
          >
            <OpenEyeIcon className="w-3.5 h-3.5 text-primaryColor shrink-0" />
            <span>{(val ?? 0).toLocaleString()}</span>
          </div>
        );
      },
    },
    {
      label: "Status",
      accessor: "status",
      position: "justify-center",
      width: "120px",
      formatter: (_: string, row: any) => <PublicationStatusUpdate row={row} />,
    },
    {
      label: "Action",
      accessor: "actions",
      position: "justify-end",
      width: "160px",
      formatter: (_: any, row: any) => (
        <PublicationAction ispremium={isPremiumView} row={row} />
      ),
    },
  ];

  return (
    <div className="w-full space-y-7 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor">
            {isPremiumView
              ? "Research Publications"
              : "Industry Pro Publication"}
          </h1>
          <p className="text-sm sm:text-base text-descriptionColor mt-1">
            {isPremiumView
              ? "Submit, manage, and track your clinical and academic research publications."
              : "Add your publications in Health Industry"}
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <Link
            href={
              isPremiumView
                ? `/mu/premium/publications/create`
                : `/mu/publications/create`
            }
            className="h-10 inline-flex items-center gap-1.5 bg-primaryColor hover:bg-primaryColor/90 text-white px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Publications</span>
          </Link>
        </div>
      </div>

      {/* Top Stat Cards using CommonStateCard (layout="split") */}
      {isMyPublicationsLoading && !publicationsList.length ? (
        <StateCardSkleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stateCards.map((card) => (
            <CommonStateCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* Publication Listings Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-headerColor">
            Your Publication Listings
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <div className="w-full sm:w-64">
              <Search placeHolder="Search publications..." className="w-full h-10" />
            </div>

            <div className="w-full sm:w-36">
              <SelecteInputField
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "draft", label: "Draft" },
                ]}
                className="h-10! text-sm font-medium rounded-lg shadow-none border border-borderColor bg-white"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="bg-white rounded-2xl border border-borderColor/80 overflow-hidden shadow-xs">
          <DynamicTable
            columns={columns}
            data={publicationsList}
            tableMinWidth="1000px"
            header={{
              bg: "#F9FAFB",
              padding: "14px 16px",
              text: "#4B5563",
              fontWeight: "600",
              fontSize: "13px",
            }}
            rowStyle={{
              hover: true,
              hoverbg: "hover:bg-gray-50/70",
              border:
                "border-b last:border-b-0 border-x-0 border-borderColor/60",
            }}
            noDataMessage={
              isMyPublicationsLoading || isMyPublicationsFetching
                ? "Loading publications..."
                : "No publications found. Click 'Add New Publications' to create your first article."
            }
          />
        </div>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="pt-2">
            <Pagination
              page={currentPage}
              pageSize={perPage}
              total={pagination.total}
              totalPages={pagination.last_page || 1}
              onPageChange={(page) => setCurrentPage(page)}
              showPageSize={true}
              onPageSizeChange={(size) => {
                setPerPage(size);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 30, 50]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
