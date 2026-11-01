"use client";

import AdminUserDetailsPanel from "@/app/(Front-End)/_components/adminDashboard/usermanagement/AdminUserDetailsPanel";
import DataTable, { type Column } from "@/components/reusable/dashboard/AdminTable";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import StatusToggle from "@/components/reusable/dashboard/StatusToggle";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
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
  useToggleUserSuspendMutation,
} from "@/feature/slice/admin/user-management";
import type { User, UserStatus, UserTier } from "@/feature/slice/admin/user-management/userTypes";
import userPlaceholder from "@/public/images/admin/parterner.png";
import { ArrowDownToLine, ArrowUpDown, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const PAGE_SIZE = 15;

const tierLabels: Record<string, string> = {
  basic: "Basic Users",
  premium: "Premium Users",
  pro_industry: "Pro Industry Users",
};

function downloadCsv(users: User[], tier: UserTier) {
  const escapeCell = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = [
    ["ID", "Name", "Email", "Profession", "Status", "Joined", "Plan", "Company"],
    ...users.map((user) => [
      user.id,
      user.full_name,
      user.email,
      Array.isArray(user.profession) ? user.profession.join(", ") : user.profession,
      user.status,
      user.joined_at,
      user.plan?.name || tierLabels[tier]?.replace(/ Users$/, "") || tier,
      user.company?.name,
    ]),
  ];
  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tier}-users-page.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function UserManagementTable({
  tier,
}: {
  tier: Exclude<UserTier, "all">;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus>("all");
  const [sort, setSort] = useState("default");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetUsersQuery({
    query: {
      type: tier,
      search: search.trim() || undefined,
      status,
      page,
      per_page: PAGE_SIZE,
    },
  });
  const [toggleUserSuspend, { isLoading: isSuspending, originalArgs }] =
    useToggleUserSuspendMutation();

  const users = useMemo(() => {
    const rows = [...(response?.data ?? [])];
    if (sort === "a-z") {
      rows.sort((first, second) => first.full_name.localeCompare(second.full_name));
    } else if (sort === "z-a") {
      rows.sort((first, second) => second.full_name.localeCompare(first.full_name));
    }
    return rows;
  }, [response?.data, sort]);

  const totalUsers = response?.pagination?.total ?? response?.total_users ?? 0;
  const totalPages = response?.pagination?.last_page ?? 0;
  const title = tierLabels[tier] || "Users";

  const handleSuspendChange = async (user: User, isActive: boolean) => {
    try {
      const result = await toggleUserSuspend({
        userId: user.id,
        is_suspended: !isActive,
      }).unwrap();
      toast.success(result.message);
    } catch {
      toast.error("Could not update this user's status.");
    }
  };

  const columns: Column<User>[] = [
    {
      header: "No.",
      cell: (user) => <span className="text-gray-500">{user.sl_no ?? user.id}</span>,
    },
    {
      header: "Full Name",
      accessor: "full_name",
      cell: (user) => (
        <span className="flex min-w-40 items-center gap-2 font-medium text-gray-900">
          <Image
            src={user.profile_image_url || userPlaceholder}
            alt={`${user.full_name} profile`}
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
          <span className="max-w-52 truncate">{user.full_name}</span>
        </span>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      cell: (user) => <span className="whitespace-nowrap">{user.email}</span>,
    },
    {
      header: "Profession",
      cell: (user) => (
        <span className="block max-w-48 truncate" title={Array.isArray(user.profession) ? user.profession.join(", ") : user.profession || ""}>
          {Array.isArray(user.profession)
            ? user.profession.join(", ") || "—"
            : user.profession || "—"}
        </span>
      ),
    },
    ...(tier === "pro_industry"
      ? [{
          header: "Company",
          cell: (user: User) => user.company?.name || "—",
        } satisfies Column<User>]
      : []),
    {
      header: "Subscription",
      cell: (user) => user.plan?.name || (tier === "basic" ? "Basic" : "—"),
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
      cell: (user) => <span className="whitespace-nowrap">{user.joined_at || "—"}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <CustomTitleDescription
          title={title}
          description={`${totalUsers.toLocaleString()} ${title}`}
        />
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <button
            type="button"
            onClick={() => downloadCsv(users, tier)}
            disabled={!users.length}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primaryColor px-4 text-sm font-medium text-white transition hover:bg-primaryColor/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Export page
          </button>
          <label className="relative w-full sm:w-60">
            <span className="sr-only">Search users</span>
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grayColor1" />
            <CustomInput
              aria-label="Search users"
              className="pl-9"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search users"
            />
          </label>
          <Select
            value={status}
            onValueChange={(value: UserStatus) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full sm:w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-10 w-full sm:w-40">
              <ArrowUpDown className="h-4 w-4" />
              <SelectValue placeholder="Sort name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Newest</SelectItem>
              <SelectItem value="a-z">Name A–Z</SelectItem>
              <SelectItem value="z-a">Name Z–A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError && (
        <div role="alert" className="flex items-center justify-between rounded-md border border-redColor/20 bg-redColor/5 p-3 text-sm text-redColor">
          <span>Could not load {title.toLowerCase()}.</span>
          <button type="button" onClick={() => refetch()} className="font-semibold underline">Retry</button>
        </div>
      )}

      {isLoading ? (
        <p className="rounded-lg border border-borderColor bg-white py-12 text-center text-sm text-grayColor1">
          Loading {title.toLowerCase()}…
        </p>
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
          <DataTable
            columns={columns}
            data={users}
            onView={(user) => setSelectedUserId(user.id)}
          />
          {totalUsers > 0 && (
            <Pagination
              page={response?.pagination?.current_page || page}
              pageSize={response?.pagination?.per_page || PAGE_SIZE}
              total={totalUsers}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      <CustomModal
        open={selectedUserId !== null}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        title="User details"
        size="xl"
      >
        {selectedUserId !== null && (
          <AdminUserDetailsPanel userId={selectedUserId} />
        )}
      </CustomModal>
    </div>
  );
}
