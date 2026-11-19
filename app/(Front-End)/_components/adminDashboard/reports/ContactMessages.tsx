"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ArrowDownToLine,
  Eye,
  Mail,
  Phone,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  RotateCcw,
  X,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  StickyNote,
  Save,
  Edit3,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import AdminPagination from "@/components/reusable/dashboard/AdminPagination";
import {
  ContactMessage,
  useGetContactMessagesQuery,
  useMarkContactMessageStatusMutation,
  useDeleteContactMessageMutation,
  useUpdateContactMessageNoteMutation,
} from "@/feature/slice/admin/reports/adminReportApi";

const PAGE_SIZE = 20;

export default function ContactMessages() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // Selected message for details modal
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Delete message modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // RTK Query hooks
  const { data, isLoading, isFetching, isError, refetch } =
    useGetContactMessagesQuery({
      search: debouncedSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      per_page: pageSize,
    });

  const [markStatus, { isLoading: isMarkingStatus }] =
    useMarkContactMessageStatusMutation();
  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();
  const [updateNote, { isLoading: isUpdatingNote }] =
    useUpdateContactMessageNoteMutation();

  const pagination = data?.pagination;
  const messages = data?.data ?? [];
  const summary = data?.summary ?? {
    total_messages: 0,
    unread_messages: 0,
    read_messages: 0,
    replied_messages: 0,
    today_messages: 0,
  };

  const totalMessages = pagination?.total ?? messages.length;
  const totalPages = pagination?.last_page ?? 1;

  // Handle opening details modal and auto-marking as read immediately
  const handleOpenDetails = async (message: ContactMessage) => {
    const isUnread = message.status === "unread";
    // Immediately set modal status to 'read' if it was unread
    const updated: ContactMessage = isUnread
      ? { ...message, status: "read" }
      : message;

    setSelected(updated);
    setNoteInput(message.admin_note || "");
    setIsEditingNote(!message.admin_note);

    if (isUnread) {
      try {
        await markStatus({ id: message.id, status: "read" }).unwrap();
      } catch {
        // Silently ignore background mark-as-read error
      }
    }
  };

  // Save internal admin note / comment
  const handleSaveNote = async () => {
    if (!selected) return;
    try {
      await updateNote({
        id: selected.id,
        admin_note: noteInput.trim(),
      }).unwrap();
      toast.success("Admin note saved successfully.");
      setSelected({
        ...selected,
        admin_note: noteInput.trim() || null,
      });
      setIsEditingNote(false);
    } catch {
      toast.error("Failed to save admin note.");
    }
  };

  // Handle changing status (unread, read, replied)
  const handleStatusChange = async (
    message: ContactMessage,
    newStatus: "unread" | "read" | "replied"
  ) => {
    try {
      await markStatus({ id: message.id, status: newStatus }).unwrap();
      toast.success(`Message marked as ${newStatus}.`);
      if (selected && selected.id === message.id) {
        setSelected({ ...selected, status: newStatus });
      }
    } catch {
      toast.error("Could not update message status.");
    }
  };

  // Open Delete modal
  const handleOpenDelete = (message: ContactMessage) => {
    setMessageToDelete(message);
    setDeleteModalOpen(true);
  };

  // Execute deletion
  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      const res = await deleteMessage(messageToDelete.id).unwrap();
      toast.success(res?.message || "Contact message deleted successfully.");
      setDeleteModalOpen(false);
      if (selected && selected.id === messageToDelete.id) {
        setSelected(null);
      }
      setMessageToDelete(null);
    } catch {
      toast.error("Failed to delete contact message.");
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchInput.trim() || statusFilter !== "all"
  );

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!messages.length) {
      toast.error("No messages to export");
      return;
    }
    const headers = [
      "No.",
      "Date",
      "Sender Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
      "Address",
      "Status",
      "Admin Note",
    ];
    const rows = messages.map((m) => [
      m.sl_no ?? m.id,
      m.created_at_formatted || m.created_at || "",
      m.name,
      m.email,
      m.phone || "",
      m.subject || "",
      m.message || "",
      m.address || "",
      m.status || "unread",
      m.admin_note || "",
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

  return (
    <section className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Contact Messages
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review, reply to, and manage inquiries submitted by users through the contact form.
          </p>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Inquiries */}
        <div
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
            statusFilter === "all"
              ? "border-[#04A1B7] bg-teal-50/30 ring-2 ring-[#04A1B7]/25"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Total Inquiries
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <span className="inline-block h-8 w-14 animate-pulse rounded bg-gray-200" />
                ) : (
                  summary.total_messages.toLocaleString()
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">All received messages</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#04A1B7]">
              <Mail className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Unread Inquiries */}
        <div
          onClick={() => {
            setStatusFilter("unread");
            setPage(1);
          }}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
            statusFilter === "unread"
              ? "border-amber-300 bg-amber-50/40 ring-2 ring-amber-300"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Unread Messages
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-600">
                {isLoading ? (
                  <span className="inline-block h-8 w-14 animate-pulse rounded bg-gray-200" />
                ) : (
                  summary.unread_messages.toLocaleString()
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">Awaiting review</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Replied Inquiries */}
        <div
          onClick={() => {
            setStatusFilter("replied");
            setPage(1);
          }}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
            statusFilter === "replied"
              ? "border-blue-300 bg-blue-50/40 ring-2 ring-blue-300"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Replied
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {isLoading ? (
                  <span className="inline-block h-8 w-14 animate-pulse rounded bg-gray-200" />
                ) : (
                  summary.replied_messages.toLocaleString()
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">Resolved & contacted</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Today's Inquiries */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Received Today
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <span className="inline-block h-8 w-14 animate-pulse rounded bg-gray-200" />
                ) : (
                  summary.today_messages.toLocaleString()
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">New submissions today</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Box */}
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sender, email, subject, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#04A1B7] focus:ring-2 focus:ring-[#04A1B7]/15"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
            {[
              { id: "all", label: "All" },
              { id: "unread", label: "Unread", count: summary.unread_messages },
              { id: "read", label: "Read" },
              { id: "replied", label: "Replied" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === tab.id
                    ? "bg-white text-gray-900 shadow-2xs font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Reset Filters Button (Always visible, disabled when no filters active) */}
          <button
            type="button"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            title={hasActiveFilters ? "Reset all filters to default" : "No filters active"}
            className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all shrink-0 ${
              hasActiveFilters
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-2xs cursor-pointer"
                : "border-gray-200 bg-gray-50 text-gray-400 opacity-60 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Action Button: Export CSV */}
        <div className="flex items-center gap-2">
          <CustomButton
            variant="outline"
            onClick={handleExportCSV}
            className="w-full sm:w-auto shadow-xs border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowDownToLine className="h-4 w-4 mr-1.5" />
            Export CSV
          </CustomButton>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
              <tr>
                <th className="px-5 py-3.5 w-14">No.</th>
                <th className="px-5 py-3.5">Sender</th>
                <th className="px-5 py-3.5">Subject & Message</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Date & Time</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="h-4 w-6 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-36 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-52 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-28 rounded bg-gray-200" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="mx-auto h-5 w-16 rounded-full bg-gray-200" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="ml-auto h-8 w-16 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-900">
                      Failed to load contact messages
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-3 inline-flex items-center text-xs font-medium text-[#04A1B7] hover:underline"
                    >
                      Click here to retry
                    </button>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <Mail className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-900">
                      No contact messages found
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {hasActiveFilters
                        ? "Try adjusting your search query or status filter."
                        : "No contact inquiries have been submitted yet."}
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-3 inline-flex items-center text-xs font-medium text-[#04A1B7] hover:underline"
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                messages.map((row) => {
                  const isUnread = row.status === "unread";
                  const isReplied = row.status === "replied";

                  return (
                    <tr
                      key={row.id}
                      onClick={() => handleOpenDetails(row)}
                      className={`cursor-pointer transition-colors hover:bg-gray-50/80 ${
                        isUnread ? "bg-amber-50/20 font-medium" : ""
                      }`}
                    >
                      {/* No. */}
                      <td className="px-5 py-4 text-xs font-mono text-gray-400">
                        {row.sl_no ?? row.id}
                      </td>

                      {/* Sender */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="relative">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-[#04A1B7] border border-teal-100">
                              {row.name ? row.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            {isUnread && (
                              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate text-sm font-semibold text-gray-900">
                              {row.name}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {row.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Preview */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-sm font-medium text-gray-900">
                              {row.subject || (
                                <span className="italic text-gray-400">No subject</span>
                              )}
                            </span>
                            {row.admin_note && (
                              <span
                                title={`Admin Note: ${row.admin_note}`}
                                className="inline-flex shrink-0 items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200/80"
                              >
                                <StickyNote className="h-2.5 w-2.5 text-amber-600" />
                                Note
                              </span>
                            )}
                          </div>
                          <span className="truncate text-xs text-gray-500 line-clamp-1">
                            {row.message}
                          </span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {row.created_at_formatted || "—"}
                          </span>
                          {row.created_at_human && (
                            <span className="text-[11px] text-gray-400">
                              {row.created_at_human}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {isUnread ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Unread
                          </span>
                        ) : isReplied ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-[#038A9D] border border-teal-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Replied
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 border border-gray-200">
                            Read
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-5 py-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {/* View Button */}
                          <button
                            type="button"
                            title="View message details"
                            onClick={() => handleOpenDetails(row)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-[#04A1B7] hover:bg-[#04A1B7]/10 hover:text-[#04A1B7]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Quick Toggle Replied */}
                          <button
                            type="button"
                            title={isReplied ? "Mark as Read" : "Mark as Replied"}
                            onClick={() =>
                              handleStatusChange(
                                row,
                                isReplied ? "read" : "replied"
                              )
                            }
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                              isReplied
                                ? "border-teal-200 bg-teal-50 text-[#04A1B7] hover:bg-teal-100"
                                : "border-gray-200 text-gray-400 hover:border-teal-200 hover:text-[#04A1B7] hover:bg-teal-50/50"
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            title="Delete message"
                            onClick={() => handleOpenDelete(row)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="border-t border-gray-200 px-5 py-3.5">
          <AdminPagination
            pagination={{
              current_page: pagination?.current_page || page,
              total: totalMessages,
              total_page: totalPages,
              limit: pagination?.per_page || pageSize,
            }}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Message Details Modal */}
      <CustomModal
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title="Message Details"
        size="lg"
      >
        {selected && (
          <div className="space-y-4 pt-1 text-sm">
            {/* Subject Header & Status */}
            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                  Subject
                </span>
                <h2 className="mt-0.5 text-lg sm:text-xl font-bold text-gray-900 leading-snug break-words">
                  {selected.subject || "No subject provided"}
                </h2>
              </div>

              {/* Status Switcher Pills */}
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 shrink-0 self-start sm:self-auto">
                {(["unread", "read", "replied"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selected, st)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-all cursor-pointer ${
                      selected.status === st
                        ? st === "unread"
                          ? "bg-amber-500 text-white shadow-2xs"
                          : st === "replied"
                          ? "bg-[#04A1B7] text-white shadow-2xs"
                          : "bg-white text-gray-800 shadow-2xs border border-gray-200/50"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Profile Header */}
            <div className="flex items-start justify-between gap-4 rounded-xl bg-gray-50/80 p-4 border border-gray-100">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[#038A9D] font-bold text-base shadow-2xs">
                  {selected.name ? selected.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">
                      {selected.name}
                    </h4>
                    <span className="text-xs text-gray-400">•</span>
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "MindUnite Inquiry")}`}
                      className="text-xs font-medium text-[#04A1B7] hover:underline"
                    >
                      {selected.email}
                    </a>
                    <button
                      type="button"
                      title="Copy email address"
                      onClick={() => {
                        navigator.clipboard.writeText(selected.email);
                        toast.success("Email copied to clipboard");
                      }}
                      className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-0.5"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    {selected.phone && (
                      <a
                        href={`tel:${selected.phone}`}
                        className="flex items-center gap-1.5 hover:text-gray-900"
                      >
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{selected.phone}</span>
                      </a>
                    )}
                    {selected.address && (
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{selected.address}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span>{selected.created_at_formatted || "—"}</span>
                      {selected.created_at_human && (
                        <span className="text-gray-400">({selected.created_at_human})</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Body (Clean Reading Canvas) */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                Message Body
              </span>
              <div className="mt-2 min-h-36 max-h-[380px] overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-5 text-sm leading-relaxed text-gray-800 border border-gray-100 shadow-2xs select-text">
                {selected.message || (
                  <span className="italic text-gray-400">No message content provided</span>
                )}
              </div>
            </div>

            {/* Internal Admin Note / Comment */}
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4">
              <div className="flex items-center justify-between gap-2 pb-1.5">
                <div className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-bold text-gray-900">
                    Internal Admin Note
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                    <Lock className="h-2.5 w-2.5" />
                    Private to Admins
                  </span>
                </div>

                {!isEditingNote && selected.admin_note && (
                  <button
                    type="button"
                    onClick={() => setIsEditingNote(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#04A1B7] hover:underline cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Edit Note</span>
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Write a private comment or follow-up note about this inquiry (e.g. called client, follow-up progress, assignment)..."
                    className="w-full rounded-lg border border-amber-300/80 bg-white p-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#04A1B7] focus:outline-none focus:ring-1 focus:ring-[#04A1B7] resize-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    {selected.admin_note && (
                      <button
                        type="button"
                        onClick={() => {
                          setNoteInput(selected.admin_note || "");
                          setIsEditingNote(false);
                        }}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isUpdatingNote || noteInput.trim() === (selected.admin_note || "").trim()}
                      onClick={handleSaveNote}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#04A1B7] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#038A9D] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="h-3 w-3" />
                      <span>{isUpdatingNote ? "Saving..." : "Save Note"}</span>
                    </button>
                  </div>
                </div>
              ) : selected.admin_note ? (
                <p className="whitespace-pre-wrap text-xs text-gray-700 leading-relaxed pt-1 select-text">
                  {selected.admin_note}
                </p>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-gray-400 italic">No internal note added yet.</p>
                  <button
                    type="button"
                    onClick={() => setIsEditingNote(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#04A1B7] hover:underline cursor-pointer"
                  >
                    + Add Note
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  handleOpenDelete(selected);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Message</span>
              </button>

              <div className="flex items-center gap-2">
                <CustomButton
                  variant="ghost"
                  onClick={() => setSelected(null)}
                >
                  Close
                </CustomButton>

                {/* Quick Reply Button */}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "MindUnite Inquiry")}`}
                  onClick={() => handleStatusChange(selected, "replied")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#04A1B7] px-4 text-sm font-medium text-white transition-colors hover:bg-[#038A9D] shadow-xs cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Contact Message"
        size="sm"
      >
        {messageToDelete && (
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
              <div>
                <h4 className="text-sm font-semibold text-red-900">
                  Are you sure you want to delete this message?
                </h4>
                <p className="mt-1 text-xs text-red-700 leading-relaxed">
                  Message from <strong>{messageToDelete.name}</strong> (
                  {messageToDelete.email}) will be permanently deleted from the database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <CustomButton
                type="button"
                variant="ghost"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="button"
                variant="destructive"
                loading={isDeleting}
                loadingText="Deleting..."
                onClick={handleConfirmDelete}
              >
                Delete Message
              </CustomButton>
            </div>
          </div>
        )}
      </CustomModal>
    </section>
  );
}
