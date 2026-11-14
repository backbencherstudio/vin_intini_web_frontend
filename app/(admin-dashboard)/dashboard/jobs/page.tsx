"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import AdminCreateJobModal from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminCreateJobModal";
import AdminDeleteJobModal from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminDeleteJobModal";
import AdminEditJobModal from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminEditJobModal";
import AdminJobViewModal from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminJobViewModal";
import AdminJobsTable from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminJobsTable";
import AdminRejectJobModal from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminRejectJobModal";
import JobsOverviewCards from "@/app/(Front-End)/_components/adminDashboard/jobs/JobsOverviewCards";
import {
  useDeleteAdminJobMutation,
  useGetAdminJobsQuery,
  useRejectAdminJobMutation,
  useUpdateAdminJobStatusMutation,
  type AdminJobItem,
  type AdminJobStatus,
} from "@/feature/slice/admin/jobs";

export default function AdminJobsPage() {
  // Query parameters state
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("all");
  const [selectedStateId, setSelectedStateId] = useState<string>("all");
  const [selectedCityId, setSelectedCityId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal states
  const [viewingJob, setViewingJob] = useState<AdminJobItem | null>(null);
  const [editingJob, setEditingJob] = useState<AdminJobItem | null>(null);
  const [rejectingJob, setRejectingJob] = useState<AdminJobItem | null>(null);
  const [deletingJob, setDeletingJob] = useState<AdminJobItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // API hooks
  const { data, isLoading, refetch } = useGetAdminJobsQuery({
    status: selectedStatus,
    network_type: selectedNetwork,
    work_mode: selectedWorkMode,
    state_id: selectedStateId,
    city_id: selectedCityId,
    search: searchQuery,
    page: currentPage,
    per_page: pageSize,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdminJobStatusMutation();
  const [rejectJob, { isLoading: isRejecting }] = useRejectAdminJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteAdminJobMutation();

  const handleStatusTabChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
    setCurrentPage(1);
  };

  const handleWorkModeChange = (mode: string) => {
    setSelectedWorkMode(mode);
    setCurrentPage(1);
  };

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedCityId("all");
    setCurrentPage(1);
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStateId("all");
    setSelectedCityId("all");
    setSelectedNetwork("all");
    setSelectedWorkMode("all");
    setCurrentPage(1);
  };

  const handleToggleStatus = async (job: AdminJobItem, newStatus: string) => {
    try {
      await updateStatus({
        id: job.id,
        status: newStatus as AdminJobStatus,
      }).unwrap();
      toast.success(`Job status changed to ${newStatus}.`);
      if (viewingJob?.id === job.id) {
        setViewingJob((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update job status.");
    }
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingJob) return;
    try {
      await rejectJob({
        id: rejectingJob.id,
        reason,
      }).unwrap();
      toast.success("Job rejected successfully. Industry has been notified.");
      setRejectingJob(null);
      if (viewingJob?.id === rejectingJob.id) {
        setViewingJob((prev) =>
          prev
            ? { ...prev, status: "rejected", rejection_reason: reason }
            : null
        );
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject job posting.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingJob) return;
    try {
      await deleteJob(deletingJob.id).unwrap();
      toast.success("Job deleted successfully.");
      setDeletingJob(null);
      if (viewingJob?.id === deletingJob.id) {
        setViewingJob(null);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete job.");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Job Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review, post on behalf of verified industries, track applicants, and manage job listings across Psychology and Neuroscience networks.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <JobsOverviewCards summary={data?.summary} isLoading={isLoading} />

      {/* Jobs Main Table */}
      <AdminJobsTable
        jobs={data?.data ?? []}
        meta={data?.meta}
        summary={data?.summary}
        isLoading={isLoading}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusTabChange}
        selectedNetwork={selectedNetwork}
        onNetworkChange={handleNetworkChange}
        selectedWorkMode={selectedWorkMode}
        onWorkModeChange={handleWorkModeChange}
        selectedStateId={selectedStateId}
        onStateChange={handleStateChange}
        selectedCityId={selectedCityId}
        onCityChange={handleCityChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        onViewJob={(job) => setViewingJob(job)}
        onEditJob={(job) => setEditingJob(job)}
        onRejectJob={(job) => setRejectingJob(job)}
        onDeleteJob={(job) => setDeletingJob(job)}
        onToggleStatus={handleToggleStatus}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onResetFilters={handleResetFilters}
      />

      {/* Modals */}
      <AdminJobViewModal
        job={viewingJob}
        open={Boolean(viewingJob)}
        onOpenChange={(open) => {
          if (!open) setViewingJob(null);
        }}
        onReject={(job) => setRejectingJob(job)}
        onToggleStatus={handleToggleStatus}
        onEdit={(job) => setEditingJob(job)}
        isUpdatingStatus={isUpdatingStatus}
      />

      <AdminRejectJobModal
        job={rejectingJob}
        isSubmitting={isRejecting}
        onClose={() => setRejectingJob(null)}
        onConfirm={handleConfirmReject}
      />

      <AdminDeleteJobModal
        isOpen={Boolean(deletingJob)}
        jobTitle={deletingJob?.job_title}
        isSubmitting={isDeleting}
        onClose={() => setDeletingJob(null)}
        onConfirm={handleConfirmDelete}
      />

      <AdminCreateJobModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => refetch()}
      />

      <AdminEditJobModal
        job={editingJob}
        open={Boolean(editingJob)}
        onOpenChange={(open) => {
          if (!open) setEditingJob(null);
        }}
        onSuccess={() => {
          refetch();
          if (viewingJob && editingJob && viewingJob.id === editingJob.id) {
            setViewingJob(null);
          }
        }}
      />
    </div>
  );
}

