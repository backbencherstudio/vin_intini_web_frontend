"use client";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomSwitch from "@/components/reusable/dashboard/CustomSwitch";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import Pagination from "@/components/reusable/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery, useToggleUserSuspendMutation } from "@/feature/slice/admin/user-management";
import { User } from "@/feature/slice/admin/user-management/userTypes";
import userIcon from "@/public/images/admin/parterner.png";
import { ArrowDownToLine, ArrowUpDown, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

export default function BasicUser() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const {
    data: usersResponse,
    isLoading,
    isError,
  } = useGetUsersQuery({
    query: {
      type: "basic",
      search: search.trim() || undefined,
      page,
      per_page: PAGE_SIZE,
    },
  });
  const [toggleUserSuspend, { isLoading: isToggling }] =
    useToggleUserSuspendMutation();

  const users = usersResponse?.data ?? [];
  const totalUsers =
    usersResponse?.pagination?.total ?? usersResponse?.total_users ?? 0;
  const totalPages = usersResponse?.pagination?.last_page ?? 0;

  const handleToggleSuspend = async (user: User) => {
    try {
      await toggleUserSuspend(user.id).unwrap();
    } catch (error) {
      console.error(`Failed to update suspension for user ${user.id}:`, error);
      toast.error("Could not update this user's suspension status.");
    }
  };

  const columns: Column<User>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="text-gray-500">{row.sl_no ?? row.id}</span>
      ),
    },
    {
      header: "Full Name",
      accessor: "full_name",
      cell: (row) => (
        <span className="flex items-center gap-2 font-medium text-gray-900">
          <Image
            src={row.profile_image_url || userIcon}
            alt={row.full_name}
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
          {row.full_name}
        </span>
      ),
    },
    {
      header: "Subscriptions",
      cell: () => (
        <CustomBadge color="purple" className="font-medium">
          Basic
        </CustomBadge>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      cell: (row) => (
        <span className="text-[14px] font-normal text-[#0A0A0A]">
          {row.email}
        </span>
      ),
    },
    {
      header: "Profession",
      cell: (row) => (
        <span className="text-[14px] font-normal text-[#0A0A0A]">
          {Array.isArray(row.profession)
            ? row.profession.join(", ") || "-"
            : row.profession || "-"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) =>
        row.is_suspended ? (
          <CustomBadge color="suspended">Suspended</CustomBadge>
        ) : (
          <CustomBadge color="active">Active</CustomBadge>
        ),
    },
    {
      header: "Joined",
      accessor: "joined_at",
      cell: (row) => (
        <span className="text-[14px] font-normal text-[#0A0A0A]">
          {row.joined_at}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <CustomSwitch
          checked={!row.is_suspended}
          disabled={isToggling}
          aria-label={`Toggle suspension for ${row.full_name}`}
          onChange={() => handleToggleSuspend(row)}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="mb-6 w-full">
          <CustomTitleDescription
            title="Basic users"
            description={`${totalUsers.toLocaleString()} Basic Users`}
          />
        </div>

        <div className="mb-6 flex w-full justify-end">
          <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-white md:w-auto"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Export
            </button>

            <div className="relative w-full md:w-[220px]">
              <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#808897]" />
              <input
                className="h-10 w-full rounded-md border p-5 pl-7"
                type="text"
                placeholder="Search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-full cursor-pointer gap-2 py-5 md:w-[170px]">
                <ArrowUpDown className="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Sort by</SelectItem>
                <SelectItem value="connections">Connections</SelectItem>
                <SelectItem value="z-a">Alphabet Z-A</SelectItem>
                <SelectItem value="a-z">Alphabet A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          Failed to load basic users. Please try again.
        </p>
      )}
      {isLoading ? (
        <p className="py-8 text-center text-sm text-gray-500">
          Loading basic users...
        </p>
      ) : (
        <>
          <DataTable columns={columns} data={users} />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={totalUsers}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
