"use client";

import { useMemo, useState } from "react";
import { ArrowDownToLine, Eye, Mail, Phone, Search } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/reusable/dashboard/AdminTable";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import Pagination from "@/components/reusable/Pagination";
import {
  ContactMessage,
  useGetContactMessagesQuery,
} from "@/feature/slice/admin/reports/adminReportApi";

const PAGE_SIZE = 20;

export default function ContactMessages() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetContactMessagesQuery({
      search: search.trim() || undefined,
      page,
      per_page: PAGE_SIZE,
    });

  const pagination = data?.pagination;
  const messages = data?.data ?? [];
  const totalMessages = pagination?.total ?? messages.length;
  const totalPages = pagination?.last_page ?? 1;

  const handleExportCSV = () => {
    if (!messages.length) {
      toast.error("No messages to export");
      return;
    }
    const headers = [
      "No.",
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
      "Address",
    ];
    const rows = messages.map((m) => [
      m.sl_no ?? m.id,
      m.name,
      m.email,
      m.phone || "",
      m.subject || "",
      m.message || "",
      m.address || "",
    ]);
    const escapeCell = (val: unknown) =>
      `"${String(val ?? "").replaceAll('"', '""')}"`;
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Contact messages exported successfully");
  };

  const columns: Column<ContactMessage>[] = useMemo(
    () => [
      {
        header: "No.",
        cell: (row) => (
          <span className="font-medium text-gray-500">
            {row.sl_no ?? row.id}
          </span>
        ),
      },
      {
        header: "Sender",
        cell: (row) => (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-primaryColor border border-teal-100">
              {row.name ? row.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-gray-900">
                {row.name}
              </span>
              <a
                href={`mailto:${row.email}`}
                className="truncate text-xs text-primaryColor hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {row.email}
              </a>
            </div>
          </div>
        ),
      },
      {
        header: "Phone",
        cell: (row) => (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 whitespace-nowrap">
            <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>{row.phone || "—"}</span>
          </div>
        ),
      },
      {
        header: "Subject",
        cell: (row) => (
          <div
            className="max-w-[260px] truncate text-sm text-gray-700"
            title={row.subject || ""}
          >
            {row.subject ? (
              <span className="font-medium text-gray-900">{row.subject}</span>
            ) : (
              <span className="text-gray-400 italic">No subject</span>
            )}
          </div>
        ),
      },
      {
        header: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              title="View message details"
              onClick={() => setSelected(row)}
              className="p-1.5 rounded-md text-gray-500 hover:text-primaryColor hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-6">
      {/* Title & Controls */}
      <CustomTitleDescription
        title="Contact messages"
        description="Review messages submitted through the contact form."
        action={
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Export CSV
            </button>
            <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <CustomInput
                aria-label="Search contact messages"
                className="pl-9 pr-3"
                placeholder="Search name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        }
      />

      {/* Main Table / Loading / Empty State */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primaryColor border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">
            Loading contact messages...
          </p>
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">
            Contact messages could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-md bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
          <Mail className="h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No contact messages found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {search
              ? "No messages match your search query."
              : "No contact messages have been submitted yet."}
          </p>
        </div>
      ) : (
        <div
          className={`space-y-6 ${
            isFetching ? "opacity-60 transition-opacity" : ""
          }`}
        >
          <DataTable columns={columns} data={messages} />
          {pagination && pagination.last_page > 1 && (
            <Pagination
              page={page}
              pageSize={pagination.per_page || PAGE_SIZE}
              total={totalMessages}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      {/* Message Details Modal */}
      <CustomModal
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title="Contact message"
        size="lg"
        className="gap-5"
      >
        {selected && (
          <div className="space-y-5 p-2 text-sm">
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Sender details
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {selected.name}
              </p>
              <a
                href={`mailto:${selected.email}`}
                className="mt-1 inline-block text-primaryColor hover:underline"
              >
                {selected.email}
              </a>
              <div className="mt-5 grid gap-4 border-t border-gray-200 pt-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Phone
                  </p>
                  <p className="mt-1 text-gray-800">
                    {selected.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Address
                  </p>
                  <p className="mt-1 text-gray-800">
                    {selected.address || "—"}
                  </p>
                </div>
              </div>
            </section>
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Subject
              </p>
              <p className="rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-900">
                {selected.subject || "No subject provided"}
              </p>
            </section>
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Message
              </p>
              <p className="min-h-40 whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-white px-5 py-4 leading-7 text-gray-700">
                {selected.message || "No message provided"}
              </p>
            </section>
          </div>
        )}
      </CustomModal>
    </section>
  );
}
