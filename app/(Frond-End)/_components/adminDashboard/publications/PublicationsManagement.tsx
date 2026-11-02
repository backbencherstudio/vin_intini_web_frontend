"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowDownToLine,
  ArrowUpDown,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileDown,
  FileText,
  Heart,
  Layers,
  SearchIcon,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";

import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
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
import {
  useDeletePublicationMutation,
  useGetPublicationByIdQuery,
  useGetPublicationsQuery,
  useTogglePublicationStatusMutation,
} from "@/feature/slice/admin/publication";
import { PublicationItem } from "@/feature/slice/admin/publication/publicationType";
import userIcon from "@/public/images/admin/parterner.png";

const PAGE_SIZE = 15;

function htmlToText(value?: string | null) {
  if (!value) return "";

  const decoded = value.replace(
    /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
    (entity, code: string) => {
      if (code[0] === "#") {
        const point = code[1]?.toLowerCase() === "x"
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
        return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
      }
      const namedEntities: Record<string, string> = {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"',
        apos: "'",
        nbsp: " ",
      };
      return namedEntities[code.toLowerCase()] ?? entity;
    },
  );

  return decoded
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "• ")
    .replace(/<\/(p|div|li|h[1-6]|blockquote|tr)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function PublicationsManagement({
  initialNetwork = "all",
}: {
  initialNetwork?: "all" | "psychology" | "neuroscience";
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [networkFilter, setNetworkFilter] = useState<string>(initialNetwork);
  const [publicationTypeFilter, setPublicationTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<string>("default");
  const activeFilterCount =
    Number(statusFilter !== "all") +
    Number(networkFilter !== initialNetwork) +
    Number(publicationTypeFilter !== "all");

  const clearFilters = () => {
    setStatusFilter("all");
    setNetworkFilter(initialNetwork);
    setPublicationTypeFilter("all");
    setSortOrder("default");
    setPage(1);
  };

  // Selected publication for viewing details or deleting
  const [selectedPublication, setSelectedPublication] =
    useState<PublicationItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [publicationToDelete, setPublicationToDelete] =
    useState<PublicationItem | null>(null);

  // RTK Query endpoints
  const { data: response, isLoading, isFetching, isError, refetch } =
    useGetPublicationsQuery({
      query: {
        page,
        per_page: PAGE_SIZE,
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        network_type: networkFilter !== "all" ? networkFilter : undefined,
        publication_type:
          publicationTypeFilter !== "all" ? publicationTypeFilter : undefined,
      },
    });
  const { currentData: publicationDetails } = useGetPublicationByIdQuery(
    selectedPublication?.id ?? 0,
    { skip: selectedPublication === null },
  );

  const [toggleStatus, { isLoading: isToggling, originalArgs }] =
    useTogglePublicationStatusMutation();
  const [deletePublication, { isLoading: isDeleting }] =
    useDeletePublicationMutation();

  const publications = response?.data ?? [];
  const statistics = response?.statistics ?? response?.overview;
  const pagination = response?.pagination;

  const totalPublications =
    pagination?.total ?? statistics?.total_publications ?? publications.length;
  const totalPages = pagination?.last_page ?? 1;

  useEffect(() => {
    if (publicationDetails?.data) setSelectedPublication(publicationDetails.data);
  }, [publicationDetails]);

  // Search and filters are applied by the API. Sorting applies to the current page.
  const filteredPublications = useMemo(() => {
    let list = [...publications];

    if (sortOrder === "title-asc") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortOrder === "title-desc") {
      list.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    } else if (sortOrder === "views-desc") {
      list.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    }

    return list;
  }, [publications, sortOrder]);

  // Handle status toggle
  const handleToggleStatus = async (pub: PublicationItem) => {
    try {
      await toggleStatus(pub.id).unwrap();
      toast.success(
        `Publication status updated to ${
          pub.status === "active" ? "inactive" : "active"
        }`
      );
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error("Failed to update publication status.");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!publicationToDelete) return;
    try {
      await deletePublication(publicationToDelete.id).unwrap();
      toast.success("Publication deleted successfully.");
      setDeleteModalOpen(false);
      setPublicationToDelete(null);
    } catch (err) {
      console.error("Delete publication error:", err);
      toast.error("Failed to delete publication.");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!filteredPublications.length) {
      toast.error("No publication data to export.");
      return;
    }

    const headers = [
      "No.",
      "Publication ID",
      "Title",
      "Network Type",
      "Publication Type",
      "Status",
      "Authors",
      "Creator Name",
      "Creator Email",
      "Industry",
      "Views",
      "Likes",
      "Created At",
      "Website URL",
      "Attachment URL",
    ];

    const rows = filteredPublications.map((item, idx) => [
      item.sl_no ?? idx + 1,
      `"${item.publication_id || ""}"`,
      `"${(item.title || "").replace(/"/g, '""')}"`,
      `"${item.network_type || ""}"`,
      `"${item.publication_type || ""}"`,
      `"${item.status || ""}"`,
      `"${(item.authors || []).join(", ")}"`,
      `"${item.creator?.name || item.creator?.full_name || ""}"`,
      `"${item.creator?.email || ""}"`,
      `"${item.industry?.name || ""}"`,
      item.views_count ?? 0,
      item.likes_count ?? 0,
      `"${item.created_at || ""}"`,
      `"${item.website_url || ""}"`,
      `"${item.attachment_url || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `publications_export_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table Columns
  const columns: Column<PublicationItem>[] = [
    {
      header: "No.",
      cell: (row) => (
        <span className="font-medium text-gray-500">
          {row.sl_no ?? row.id}
        </span>
      ),
    },
    {
      header: "Publication",
      accessor: "title",
      cell: (row) => (
        <div className="flex flex-col gap-1 max-w-[260px]">
          <span className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
            {row.title}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                row.network_type === "neuroscience"
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                  : "bg-purple-50 text-purple-700 border border-purple-200"
              }`}
            >
              {row.network_type}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Creator",
      cell: (row) => {
        const creator = row.creator;
        if (!creator) return <span className="text-sm text-gray-400">-</span>;
        return (
          <div className="flex items-center gap-2 max-w-[200px]">
            <Image
              src={creator.profile_image_url || userIcon}
              alt={creator.name || creator.full_name || "Creator"}
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-full object-cover border border-gray-200"
            />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-gray-900">
                {creator.name || creator.full_name}
              </span>
              <span className="truncate text-xs text-gray-500">
                {creator.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Industry",
      cell: (row) => {
        const ind = row.industry;
        if (!ind)
          return <span className="text-sm italic text-gray-400">None</span>;
        return (
          <div className="flex items-center gap-1.5 max-w-[150px]">
            {ind.logo_url && (
              <Image
                src={ind.logo_url}
                alt={ind.name}
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 rounded object-cover"
              />
            )}
            <span className="truncate text-sm font-medium text-gray-800">
              {ind.name}
            </span>
          </div>
        );
      },
    },
    {
      header: "Engagement",
      cell: (row) => (
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1" title="Views">
            <Eye className="h-3.5 w-3.5 text-blue-500" />
            {row.views_count ?? 0}
          </span>
          <span className="inline-flex items-center gap-1" title="Likes">
            <Heart className="h-3.5 w-3.5 text-red-500" />
            {row.likes_count ?? 0}
          </span>
        </div>
      ),
    },
    {
      header: "Created Date",
      accessor: "created_at",
      cell: (row) => (
        <div className="flex items-center gap-1 whitespace-nowrap text-sm text-gray-600">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>{row.created_at}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const isActive = row.status === "active";
        return (
          <StatusToggle
            checked={isActive}
            activeLabel="Active"
            inactiveLabel={row.status === "draft" ? "Draft" : "Inactive"}
            disabled={isToggling && originalArgs === row.id}
            ariaLabel={`Toggle status for ${row.title}`}
            onChange={() => handleToggleStatus(row)}
          />
        );
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {/* View Details */}
          <button
            type="button"
            title="View Details"
            onClick={() => {
              setSelectedPublication(row);
              setViewModalOpen(true);
            }}
            className="p-1.5 rounded-md text-gray-500 hover:text-primaryColor hover:bg-gray-100 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            title="Delete Publication"
            onClick={() => {
              setPublicationToDelete(row);
              setDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Publications */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Total Publications
            </span>
            <div className="rounded-lg bg-teal-50 p-2 text-primaryColor">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {statistics?.total_publications ?? totalPublications}
          </p>
          <span className="text-xs text-gray-400">All recorded articles</span>
        </div>

        {/* Active Publications */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Active Publications
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {statistics?.active_publications ?? 0}
          </p>
          <span className="text-xs text-gray-400">Currently live on site</span>
        </div>

        {/* Inactive Publications */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Inactive Publications
            </span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {statistics?.inactive_publications ?? 0}
          </p>
          <span className="text-xs text-gray-400">Hidden / Suspended</span>
        </div>

        {/* Draft Publications */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Drafts</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {statistics?.draft_publications ?? 0}
          </p>
          <span className="text-xs text-gray-400">Unpublished submissions</span>
        </div>
      </div>

      {/* Table title and controls */}
      <CustomTitleDescription
        title="Publications Management"
        description="Manage research publications, articles, peer reviews, and creator submissions."
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
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <CustomInput
                type="text"
                placeholder="Search by title, author, ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-3"
              />
            </div>

            <AdminFilterPopover
              title="Filter publications"
              activeCount={activeFilterCount + Number(sortOrder !== "default")}
              onReset={clearFilters}
            >
              <div className="min-w-0 space-y-1.5">
                <span className="block text-xs font-medium text-gray-600">Status</span>
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                  <SelectTrigger className="h-10 w-full cursor-pointer rounded-lg border-gray-200 bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="z-[100100]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-1.5">
                <span className="block text-xs font-medium text-gray-600">Network</span>
                <Select value={networkFilter} onValueChange={(val) => { setNetworkFilter(val); setPage(1); }}>
                  <SelectTrigger className="h-10 w-full cursor-pointer rounded-lg border-gray-200 bg-white">
                    <SelectValue placeholder="Network" />
                  </SelectTrigger>
                  <SelectContent className="z-[100100]">
                    <SelectItem value="all">All Networks</SelectItem>
                    <SelectItem value="neuroscience">Neuroscience</SelectItem>
                    <SelectItem value="psychology">Psychology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-1.5">
                <span className="block text-xs font-medium text-gray-600">Publication type</span>
                <Select value={publicationTypeFilter} onValueChange={(val) => { setPublicationTypeFilter(val); setPage(1); }}>
                  <SelectTrigger className="h-10 w-full cursor-pointer rounded-lg border-gray-200 bg-white">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="z-[100100]">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 space-y-1.5">
                <span className="block text-xs font-medium text-gray-600">Sort by</span>
                <Select value={sortOrder} onValueChange={(value) => { setSortOrder(value); setPage(1); }}>
                  <SelectTrigger className="h-10 w-full cursor-pointer rounded-lg border-gray-200 bg-white">
                    <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="z-[100100]">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="title-asc">Title: A to Z</SelectItem>
                    <SelectItem value="title-desc">Title: Z to A</SelectItem>
                    <SelectItem value="views-desc">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AdminFilterPopover>
          </div>
        }
      />

      {/* Error state */}
      {isError && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>Failed to load publications.</span>
          <button type="button" onClick={() => refetch()} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Main Table / Loading */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primaryColor border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">Loading publications...</p>
        </div>
      ) : filteredPublications.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
          <FileText className="h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No publications found
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {search || statusFilter !== "all" || networkFilter !== "all" || publicationTypeFilter !== "all"
              ? "No results match your search and filter criteria."
              : "No publications have been uploaded yet."}
          </p>
        </div>
      ) : (
        <div className={`space-y-6 ${isFetching ? "opacity-60 transition-opacity" : ""}`}>
          <DataTable columns={columns} data={filteredPublications} />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={totalPublications}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* View Publication Details Modal */}
      {selectedPublication && (
        <CustomModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          title="Publication Details"
          size="lg"
        >
          <div className="space-y-6 p-2 text-sm">
            {/* Header / ID & Status */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
              <div>
                <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border">
                  {selectedPublication.publication_id}
                </span>
                <h2 className="mt-1.5 text-lg font-bold text-gray-900">
                  {selectedPublication.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${
                    selectedPublication.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {selectedPublication.status}
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full capitalize">
                  {selectedPublication.network_type}
                </span>
              </div>
            </div>

            {/* Abstract */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Short Abstract
              </h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed text-xs sm:text-sm">
                {htmlToText(selectedPublication.short_abstract || selectedPublication.abstract) ||
                  "No abstract provided."}
              </p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <span className="text-xs font-medium text-gray-400">
                  Publication Type
                </span>
                <p className="capitalize font-medium text-gray-800">
                  {selectedPublication.publication_type || "-"}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-400">
                  Authors
                </span>
                <p className="font-medium text-gray-800">
                  {selectedPublication.authors?.join(", ") || "-"}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-400">
                  Published Date
                </span>
                <p className="font-medium text-gray-800">
                  {selectedPublication.created_at || "-"}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-400">Views</span>
                <p className="font-medium text-gray-800 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-blue-500" />
                  {selectedPublication.views_count ?? 0}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-400">Likes</span>
                <p className="font-medium text-gray-800 flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-red-500" />
                  {selectedPublication.likes_count ?? 0}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-400">
                  Information Confirmed
                </span>
                <p className="font-medium text-gray-800">
                  {selectedPublication.information_confirmed ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Creator Information */}
            {selectedPublication.creator && (
              <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider text-gray-500">
                  Submitted By (Creator)
                </h4>
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      selectedPublication.creator.profile_image_url || userIcon
                    }
                    alt={
                      selectedPublication.creator.name ||
                      selectedPublication.creator.full_name ||
                      "Creator"
                    }
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {selectedPublication.creator.name ||
                        selectedPublication.creator.full_name}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {selectedPublication.creator.email}
                      {selectedPublication.creator.tier && (
                        <span className="ml-2 rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 capitalize">
                          {selectedPublication.creator.tier.replace("_", " ")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Industry Profile if present */}
            {selectedPublication.industry && (
              <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider text-gray-500">
                  Associated Industry / Company
                </h4>
                <div className="flex items-center gap-3">
                  {selectedPublication.industry.logo_url && (
                    <Image
                      src={selectedPublication.industry.logo_url}
                      alt={selectedPublication.industry.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded object-cover border border-gray-200"
                    />
                  )}
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {selectedPublication.industry.name}
                    </h5>
                    {selectedPublication.industry.website && (
                      <a
                        href={selectedPublication.industry.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primaryColor hover:underline"
                      >
                        {selectedPublication.industry.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Links and Attachments */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {selectedPublication.attachment_url && (
                <a
                  href={selectedPublication.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primaryColor px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <FileDown className="h-4 w-4" />
                  Download PDF Attachment
                </a>
              )}

              {selectedPublication.website_url && (
                <a
                  href={selectedPublication.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Publication Website
                </a>
              )}
            </div>
          </div>
        </CustomModal>
      )}

      {/* Delete Confirmation Modal */}
      <CustomDeletModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPublicationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Publication"
        description={`Are you sure you want to delete "${
          publicationToDelete?.title ?? "this publication"
        }"? This action cannot be undone.`}
        confirmText="Delete Now"
        cancelText="Cancel"
      />
    </div>
  );
}
