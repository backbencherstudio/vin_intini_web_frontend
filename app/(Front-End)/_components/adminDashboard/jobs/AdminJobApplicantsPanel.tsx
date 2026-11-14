"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import AdminApplicantViewModal from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminApplicantViewModal";
import AdminApplicantsTable from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminApplicantsTable";
import {
  useGetAdminJobApplicantsQuery,
  useUpdateAdminApplicantStatusMutation,
  type ApplicantItem,
  type ApplicantStage,
} from "@/feature/slice/admin/jobs";

interface AdminJobApplicantsPanelProps {
  jobId: string;
}

export default function AdminJobApplicantsPanel({
  jobId,
}: AdminJobApplicantsPanelProps) {
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewingApplicant, setViewingApplicant] =
    useState<ApplicantItem | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetAdminJobApplicantsQuery({
    jobId,
    status: selectedStage,
    search: searchQuery,
    page: currentPage,
    per_page: 15,
  });

  const [updateApplicantStatus] = useUpdateAdminApplicantStatusMutation();

  const handleStageChange = (stage: string) => {
    setSelectedStage(stage);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleUpdateStage = async (
    applicant: ApplicantItem,
    newStage: ApplicantStage
  ) => {
    setUpdatingId(applicant.id);
    try {
      await updateApplicantStatus({
        jobId,
        applicationId: applicant.id,
        status: newStage,
      }).unwrap();
      toast.success(
        `Candidate ${applicant.full_name}'s stage updated to "${newStage}". Notification sent.`
      );
      if (viewingApplicant?.id === applicant.id) {
        setViewingApplicant((prev) =>
          prev ? { ...prev, status: newStage } : null
        );
      }
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to update candidate application stage."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <AdminApplicantsTable
        jobInfo={data?.job}
        applicants={data?.data ?? []}
        stats={data?.stats}
        meta={data?.meta}
        isLoading={isLoading}
        selectedStage={selectedStage}
        onStageChange={handleStageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onViewApplicant={(app) => setViewingApplicant(app)}
        onUpdateApplicantStage={handleUpdateStage}
        updatingId={updatingId}
      />

      <AdminApplicantViewModal
        applicant={viewingApplicant}
        open={Boolean(viewingApplicant)}
        onOpenChange={(open) => {
          if (!open) setViewingApplicant(null);
        }}
        onUpdateStage={handleUpdateStage}
        isUpdatingStage={updatingId === viewingApplicant?.id}
      />
    </div>
  );
}

