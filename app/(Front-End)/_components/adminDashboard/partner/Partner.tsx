"use client";

import DataTable, { type Column } from "@/components/reusable/dashboard/AdminTable";
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
  useGetAdminPartnersQuery,
  useToggleAdminPartnerPauseMutation,
  type Partner as PartnerRecord,
} from "@/feature/slice/admin/partner";
import userIcon from "@/public/images/admin/parterner.png";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

const PAGE_SIZE = 20;

export default function Partner() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminPartnersQuery({
    query: {
      page,
      per_page: PAGE_SIZE,
      search: search.trim() || undefined,
      status: status as "all" | "active" | "paused",
    },
  });
  const [togglePause, { isLoading: isToggling, originalArgs }] =
    useToggleAdminPartnerPauseMutation();

  const partners = response?.data ?? [];
  const summary = response?.summary;

  const handlePauseChange = async (
    partner: PartnerRecord,
    isPaused: boolean,
  ) => {
    try {
      const result = await togglePause({
        id: partner.id,
        is_paused: isPaused,
      }).unwrap();
      toast.success(result.message);
    } catch (error) {
      const message =
        typeof error === "object" && error && "data" in error
          ? (error.data as { message?: string })?.message
          : undefined;
      toast.error(message || "Could not update this partner’s status.");
    }
  };

  const columns: Column<PartnerRecord>[] = [
    {
      header: "No.",
      cell: (partner) => (
        <span className="text-grayColor1">{partner.sl_no ?? partner.id}</span>
      ),
    },
    {
      header: "Partner",
      cell: (partner) => (
        <div className="flex min-w-48 items-center gap-2.5">
          <Image
            src={partner.logo_url || userIcon}
            alt={`${partner.name} logo`}
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full border border-borderColor bg-white object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-headerColor">{partner.name}</p>
            <p className="truncate text-xs text-grayColor1">{partner.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Industry",
      cell: (partner) => (
        <span className="whitespace-nowrap text-headerColor">
          {partner.industry || "—"}
        </span>
      ),
    },
    {
      header: "Owner",
      cell: (partner) => (
        <div className="min-w-40">
          <p className="font-medium text-headerColor">
            {partner.owner?.full_name || "Platform Partner"}
          </p>
          {partner.owner?.email && (
            <p className="text-xs text-grayColor1">{partner.owner.email}</p>
          )}
        </div>
      ),
    },
    {
      header: "Location",
      cell: (partner) => partner.owner?.location || "—",
    },
    {
      header: "Company Size",
      cell: (partner) => partner.company_size || "—",
    },
    {
      header: "Views",
      cell: (partner) => partner.views_count.toLocaleString(),
    },
    {
      header: "Joined",
      cell: (partner) => partner.created_at_formatted || "—",
    },
    {
      header: "Status",
      cell: (partner) => (
        <StatusToggle
          checked={!partner.is_paused}
          activeLabel="Active"
          inactiveLabel="Paused"
          disabled={isToggling && originalArgs?.id === partner.id}
          ariaLabel={`${partner.is_paused ? "Resume" : "Pause"} ${partner.name}`}
          onChange={(isActive) => handlePauseChange(partner, !isActive)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {summary && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Total Partners", summary.total_partners],
            ["Active Partners", summary.active_partners],
            ["Paused Partners", summary.paused_partners],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-lg border border-borderColor bg-white p-4"
            >
              <p className="text-sm text-grayColor1">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-headerColor">
                {Number(value).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <CustomTitleDescription
        title="Partners Management"
        description={`${(response?.pagination?.total ?? 0).toLocaleString()} partners`}
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <label className="relative w-full sm:w-80">
              <span className="sr-only">Search partners</span>
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grayColor1" />
              <CustomInput
                aria-label="Search partners"
                className="pl-9"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search partners or owners..."
              />
            </label>
            <AdminFilterPopover
              title="Filter partners"
              activeCount={Number(status !== "all")}
              onReset={() => { setStatus("all"); setPage(1); }}
            >
              <div className="min-w-0 space-y-1.5">
                <span className="block text-xs font-medium text-gray-600">Status</span>
                <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
                  <SelectTrigger className="h-10 w-full rounded-lg border-gray-200 bg-white">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="z-[100100]">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AdminFilterPopover>
          </div>
        }
      />

      {isLoading ? (
        <p className="rounded-lg border border-borderColor bg-white py-12 text-center text-sm text-grayColor1">
          Loading partners…
        </p>
      ) : isError ? (
        <div
          role="alert"
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>Failed to load partners.</span>
          <button type="button" onClick={() => refetch()} className="font-semibold underline">
            Retry
          </button>
        </div>
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
          <DataTable columns={columns} data={partners} />
          {response && response.pagination.total > 0 && (
            <Pagination
              page={response.pagination.current_page}
              pageSize={response.pagination.per_page}
              total={response.pagination.total}
              totalPages={response.pagination.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
