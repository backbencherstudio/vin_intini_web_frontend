"use client";

import AdminUserDetailsPanel from "@/app/(Front-End)/_components/adminDashboard/usermanagement/AdminUserDetailsPanel";
import DataTable, { type Column } from "@/components/reusable/dashboard/AdminTable";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import StatusToggle from "@/components/reusable/dashboard/StatusToggle";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import AdminFilterPopover from "@/components/reusable/dashboard/AdminFilterPopover";
import Pagination from "@/components/reusable/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import {
  useGetUsersQuery,
  useGetUserManagementOverviewQuery,
  useToggleUserSuspendMutation,
} from "@/feature/slice/admin/user-management";
import type { User, UserStatus, UserTier } from "@/feature/slice/admin/user-management/userTypes";
import userPlaceholder from "@/public/images/admin/parterner.png";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpDown,
  Building2,
  Crown,
  SearchIcon,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const PAGE_SIZE = 15;

const TIER_TABS: { key: UserTier; label: string }[] = [
  { key: "all", label: "All Users" },
  { key: "basic", label: "Basic Users" },
  { key: "premium", label: "Premium Users" },
  { key: "pro_industry", label: "Pro Industry" },
];

function downloadCsv(users: User[], tab: string) {
  const escapeCell = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = [
    ["ID", "Name", "Email", "Tier", "Profession", "Company", "Subscription", "Status", "Joined"],
    ...users.map((user) => [
      user.id,
      user.full_name,
      user.email,
      user.tier === "pro_industry" ? "Pro Industry" : user.tier === "premium" ? "Premium" : "Basic",
      Array.isArray(user.profession) ? user.profession.join(", ") : user.profession || "",
      user.company?.name || "",
      user.plan?.name || (user.tier === "premium" ? "Premium" : "Basic"),
      user.status,
      user.joined_at,
    ]),
  ];
  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `users-overview-${tab}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function UserManagementOverview() {
  const [activeTab, setActiveTab] = useState<UserTier>("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus>("all");
  const [sort, setSort] = useState("default");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Overview stats query
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useGetUserManagementOverviewQuery();

  // Paginated master table query
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    query: {
      type: activeTab,
      search: search.trim() || undefined,
      status,
      page,
      per_page: PAGE_SIZE,
    },
  });

  const [toggleUserSuspend, { isLoading: isSuspending, originalArgs }] =
    useToggleUserSuspendMutation();

  // Summary counts from overview or users query response
  const summary = overviewData?.summary ?? usersResponse?.summary;
  const totalUsersCount = summary?.total_users ?? usersResponse?.pagination?.total ?? 0;
  const basicCount = summary?.basic_users ?? 0;
  const premiumCount = summary?.premium_users ?? 0;
  const proCount = summary?.pro_industry_users ?? 0;
  const activeCount = summary?.active_users ?? 0;
  const suspendedCount = summary?.suspended_users ?? 0;
  const pendingLeaves = summary?.pending_leaves ?? 0;
  const newThisMonth = summary?.new_this_month ?? 0;

  // Percentage calculations
  const basicPct = totalUsersCount > 0 ? Math.round((basicCount / totalUsersCount) * 100) : 0;
  const premiumPct = totalUsersCount > 0 ? Math.round((premiumCount / totalUsersCount) * 100) : 0;
  const proPct = totalUsersCount > 0 ? Math.round((proCount / totalUsersCount) * 100) : 0;

  const users = useMemo(() => {
    const rows = [...(usersResponse?.data ?? [])];
    if (sort === "a-z") {
      rows.sort((a, b) => a.full_name.localeCompare(b.full_name));
    } else if (sort === "z-a") {
      rows.sort((a, b) => b.full_name.localeCompare(a.full_name));
    }
    return rows;
  }, [usersResponse?.data, sort]);

  const totalFilteredUsers = usersResponse?.pagination?.total ?? usersResponse?.total_users ?? 0;
  const totalPages = usersResponse?.pagination?.last_page ?? 0;

  const handleSuspendChange = async (user: User, isActive: boolean) => {
    try {
      const result = await toggleUserSuspend({
        userId: user.id,
        is_suspended: !isActive,
      }).unwrap();
      toast.success(result.message);
      refetchOverview();
    } catch {
      toast.error("Could not update this user's status.");
    }
  };

  const handleTabChange = (newTab: UserTier) => {
    setActiveTab(newTab);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatus("all");
    setSort("default");
    setSearch("");
    setPage(1);
  };

  const columns: Column<User>[] = [
    {
      header: "No.",
      cell: (user) => <span className="text-gray-500">{user.sl_no ?? user.id}</span>,
    },
    {
      header: "User",
      accessor: "full_name",
      cell: (user) => (
        <span className="flex min-w-44 items-center gap-2.5 font-medium text-gray-900">
          <Image
            src={user.profile_image_url || userPlaceholder}
            alt={`${user.full_name} avatar`}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover border border-gray-200"
          />
          <div className="flex flex-col min-w-0">
            <span className="max-w-48 truncate text-sm font-semibold text-gray-900">
              {user.full_name}
            </span>
            <span className="max-w-48 truncate text-xs text-gray-500">{user.email}</span>
          </div>
        </span>
      ),
    },
    {
      header: "Tier",
      cell: (user) => {
        const tier = user.tier;
        if (tier === "pro_industry" || tier === "industry") {
          return (
            <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              Pro Industry
            </span>
          );
        }
        if (tier === "premium") {
          return (
            <span className="inline-flex items-center rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
              Premium
            </span>
          );
        }
        return (
          <span className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
            Basic
          </span>
        );
      },
    },
    {
      header: "Profession",
      cell: (user) => (
        <span
          className="block max-w-44 truncate text-sm text-gray-700"
          title={Array.isArray(user.profession) ? user.profession.join(", ") : user.profession || ""}
        >
          {Array.isArray(user.profession)
            ? user.profession.join(", ") || "—"
            : user.profession || "—"}
        </span>
      ),
    },
    {
      header: "Company",
      cell: (user) => (
        <span className="block max-w-36 truncate text-sm text-gray-700">
          {user.company?.name || "—"}
        </span>
      ),
    },
    {
      header: "Subscription",
      cell: (user) => (
        <span className="text-sm font-medium text-gray-800">
          {user.plan?.name || (user.tier === "premium" ? "Premium" : "Basic")}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (user) => (
        <StatusToggle
          checked={!user.is_suspended}
          activeLabel="Active"
          inactiveLabel="Suspended"
          disabled={isSuspending && originalArgs?.userId === user.id}
          ariaLabel={`${user.is_suspended ? "Unsuspend" : "Suspend"} ${user.full_name}`}
          onChange={(isActive) => handleSuspendChange(user, isActive)}
        />
      ),
    },
    {
      header: "Joined",
      accessor: "joined_at",
      cell: (user) => (
        <span className="whitespace-nowrap text-sm text-gray-600">
          {user.joined_at || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <CustomTitleDescription
        title="User Management Overview"
        description="Comprehensive view of all onboarded platform users, tier distributions, and account statuses."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => downloadCsv(users, activeTab)}
              disabled={!users.length}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primaryColor px-4 text-sm font-semibold text-white shadow-xs transition hover:bg-primaryColor/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        }
      />

      {/* Pending Leave Requests Alert Banner */}
      {pendingLeaves > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {pendingLeaves} {pendingLeaves === 1 ? "User" : "Users"} Requested Account Deletion
              </p>
              <p className="text-xs text-amber-700">
                Review pending account leave records and permanently delete or restore user accounts.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/user-management/leave-management"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
          >
            Review Requests
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Stat Cards (6 Grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Card 1: Total Users */}
        <button
          type="button"
          onClick={() => handleTabChange("all")}
          className={`flex flex-col justify-between rounded-xl border bg-white p-4 text-left transition-none shadow-2xs ${
            activeTab === "all"
              ? "border-primaryColor ring-2 ring-primaryColor/20"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Users</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primaryColor/10 text-primaryColor">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {isOverviewLoading ? "..." : totalUsersCount.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-medium text-gray-500">
            {newThisMonth > 0 ? (
              <span className="font-semibold text-primaryColor">+{newThisMonth} this month</span>
            ) : (
              "Onboarded profiles"
            )}
          </span>
        </button>

        {/* Card 2: Basic Users */}
        <button
          type="button"
          onClick={() => handleTabChange("basic")}
          className={`flex flex-col justify-between rounded-xl border bg-white p-4 text-left transition-none shadow-2xs ${
            activeTab === "basic"
              ? "border-sky-500 ring-2 ring-sky-500/20"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Basic Users</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {isOverviewLoading ? "..." : basicCount.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-medium text-sky-600">{basicPct}% of user base</span>
        </button>

        {/* Card 3: Premium Users */}
        <button
          type="button"
          onClick={() => handleTabChange("premium")}
          className={`flex flex-col justify-between rounded-xl border bg-white p-4 text-left transition-none shadow-2xs ${
            activeTab === "premium"
              ? "border-purple-500 ring-2 ring-purple-500/20"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Premium</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {isOverviewLoading ? "..." : premiumCount.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-medium text-purple-600">{premiumPct}% subscribed</span>
        </button>

        {/* Card 4: Pro Industry */}
        <button
          type="button"
          onClick={() => handleTabChange("pro_industry")}
          className={`flex flex-col justify-between rounded-xl border bg-white p-4 text-left transition-none shadow-2xs ${
            activeTab === "pro_industry"
              ? "border-emerald-500 ring-2 ring-emerald-500/20"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Pro Industry</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {isOverviewLoading ? "..." : proCount.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-600">{proPct}% industry</span>
        </button>

        {/* Card 5: Active Users */}
        <button
          type="button"
          onClick={() => {
            setStatus("active");
            setPage(1);
          }}
          className={`flex flex-col justify-between rounded-xl border bg-white p-4 text-left transition-none shadow-2xs ${
            status === "active"
              ? "border-teal-500 ring-2 ring-teal-500/20"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {isOverviewLoading ? "..." : activeCount.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-medium text-teal-600">Good standing</span>
        </button>

        {/* Card 6: Suspended */}
        <button
          type="button"
          onClick={() => {
            setStatus("suspended");
            setPage(1);
          }}
          className={`flex flex-col justify-between rounded-xl border bg-white p-4 text-left transition-none shadow-2xs ${
            status === "suspended"
              ? "border-red-500 ring-2 ring-red-500/20"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Suspended</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              {isOverviewLoading ? "..." : suspendedCount.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-medium text-red-600">
            {suspendedCount > 0 ? "Blocked accounts" : "Zero suspended"}
          </span>
        </button>
      </div>

      {/* Tier Distribution Breakdown Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">User Tier Breakdown</h3>
            <p className="text-xs text-gray-500">
              Distribution of {totalUsersCount} onboarded platform accounts across subscription tiers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              Basic ({basicCount} · {basicPct}%)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              Premium ({premiumCount} · {premiumPct}%)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Pro Industry ({proCount} · {proPct}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            style={{ width: `${basicPct}%` }}
            className="h-full bg-sky-500"
            title={`Basic: ${basicCount} (${basicPct}%)`}
          />
          <div
            style={{ width: `${premiumPct}%` }}
            className="h-full bg-purple-500"
            title={`Premium: ${premiumCount} (${premiumPct}%)`}
          />
          <div
            style={{ width: `${proPct}%` }}
            className="h-full bg-emerald-500"
            title={`Pro Industry: ${proCount} (${proPct}%)`}
          />
        </div>
      </div>

      {/* Master Users Directory Section */}
      <div className="space-y-4">
        {/* Navigation Tabs and Controls Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Tab Filter Buttons (Styled to industry standard rounded-lg buttons) */}
          <div className="flex flex-wrap items-center gap-2">
            {TIER_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count =
                tab.key === "all"
                  ? totalUsersCount
                  : tab.key === "basic"
                  ? basicCount
                  : tab.key === "premium"
                  ? premiumCount
                  : proCount;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition-none ${
                    isActive
                      ? "bg-primaryColor text-white border border-primaryColor"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold transition-none ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Filter Popover, and Reset */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <label className="relative w-full sm:w-64">
              <span className="sr-only">Search users</span>
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <CustomInput
                aria-label="Search users"
                className="pl-9 h-10 rounded-lg text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email..."
              />
            </label>

            {/* Filter Popover */}
            <AdminFilterPopover
              title="Filter Users"
              activeCount={Number(status !== "all") + Number(sort !== "default")}
              onReset={handleResetFilters}
            >
              <div className="min-w-0 space-y-1.5">
                <span className="block text-xs font-medium text-gray-600">Status</span>
                <Select
                  value={status}
                  onValueChange={(val: UserStatus) => {
                    setStatus(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-gray-200 bg-white">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="z-[100100]">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="suspended">Suspended Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-0 space-y-1.5">
                <span className="block text-xs font-medium text-gray-600">Sort by</span>
                <Select
                  value={sort}
                  onValueChange={(val) => {
                    setSort(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border-gray-200 bg-white">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Newest" />
                  </SelectTrigger>
                  <SelectContent className="z-[100100]">
                    <SelectItem value="default">Newest Joined</SelectItem>
                    <SelectItem value="a-z">Name: A to Z</SelectItem>
                    <SelectItem value="z-a">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AdminFilterPopover>

            {/* Reset Filters Shortcut (if active) */}
            {(status !== "all" || sort !== "default" || search.length > 0) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {isUsersError && (
          <div
            role="alert"
            className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>Could not load users for this view.</span>
            <button
              type="button"
              onClick={() => refetchUsers()}
              className="font-semibold underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton / Data Table */}
        {isUsersLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500 shadow-2xs">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primaryColor border-t-transparent mb-2" />
            Loading user directory…
          </div>
        ) : (
          <div>
            <DataTable
              columns={columns}
              data={users}
              onView={(user) => setSelectedUserId(user.id)}
            />

            {/* Empty State */}
            {users.length === 0 && (
              <div className="rounded-b-xl border-x border-b border-gray-200 bg-white py-12 text-center text-sm text-gray-500">
                <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="font-semibold text-gray-700">No users found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting your search query, status filter, or selected tier.
                </p>
                {(status !== "all" || search) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalFilteredUsers > 0 && (
              <Pagination
                page={usersResponse?.pagination?.current_page || page}
                pageSize={usersResponse?.pagination?.per_page || PAGE_SIZE}
                total={totalFilteredUsers}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <CustomModal
        open={selectedUserId !== null}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        title="User details"
        size="xl"
      >
        {selectedUserId !== null && <AdminUserDetailsPanel userId={selectedUserId} />}
      </CustomModal>
    </div>
  );
}
