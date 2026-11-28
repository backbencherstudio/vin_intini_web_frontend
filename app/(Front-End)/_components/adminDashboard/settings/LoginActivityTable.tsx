"use client";

import AdminPagination from "@/components/reusable/dashboard/AdminPagination";
import DataTable, { Column } from "@/components/reusable/dashboard/AdminTable";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomModal from "@/components/reusable/dashboard/CustomModal";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import Pagination from "@/components/reusable/Pagination";
import {
  useBulkDeleteLoginActivitiesMutation,
  useDeleteActiveSessionsMutation,
  useDeleteAllLoginActivityMutation,
  useDeleteLoginActivityMutation,
  useGetLoginActivityQuery,
  useGetSecurityOverviewQuery,
  useLogoutActiveSessionsMutation,
  useSecureAccountFromLoginActivityMutation,
  useSingeleSessionTrustedMutation,
} from "@/feature/slice/admin/securitySettings";
import { TikIcon } from "@/public/svgIcons/AdminIcon";
import { LogoutIcon } from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import {
  ChevronDown,
  Delete,
  Monitor,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
dayjs.extend(utc);
dayjs.extend(timezone);

type LoginActivity = {
  id: number;
  device: string;
  browser: string;
  location: string;
  ip_address: string;
  status: "Successful" | "Failed";
  is_active: boolean;
  is_mobile: boolean;
  is_current: boolean;
  signin_status: string;
  login_at: string;
  created_at: string;
  is_suspicious: boolean;
  is_trusted: boolean;
  activity_status: string;
};

type SessionActionConfirmation = {
  activity: LoginActivity;
  action: "logout" | "delete";
};

export default function LoginActivityTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedLoginActivity, setSelectedLoginActivity] =
    useState<LoginActivity | null>(null);
  const [secureAccountMessage, setSecureAccountMessage] = useState<string | null>(
    null,
  );
  const [sessionActionConfirmation, setSessionActionConfirmation] =
    useState<SessionActionConfirmation | null>(null);
  const [isSessionActionConfirmationOpen, setIsSessionActionConfirmationOpen] =
    useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUserToggled, setHasUserToggled] = useState(false);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data, isLoading } = useGetLoginActivityQuery({
    page,
    limit,
  });
  const { data: overviewRes } = useGetSecurityOverviewQuery({});
  const isCurrentSessionTrusted =
    overviewRes?.data?.is_current_session_trusted ?? true;

  const loginActivities: LoginActivity[] = data?.data?.items || [];
  const hasSuspiciousAlert = Boolean(
    overviewRes?.data?.is_suspicious ||
      !isCurrentSessionTrusted ||
      loginActivities.some((row) => row.is_suspicious),
  );

  useEffect(() => {
    if (!hasUserToggled && hasSuspiciousAlert) {
      setIsExpanded(true);
    }
  }, [hasSuspiciousAlert, hasUserToggled]);
  const [logoutActivity, { isLoading: logoutLoading }] =
    useLogoutActiveSessionsMutation();

  const [deleteLoginActivity, { isLoading: deleteLoading }] =
    useDeleteLoginActivityMutation();

  const [singeleSessionTrusted, { isLoading: singeleSessionTrustedLoading }] =
    useSingeleSessionTrustedMutation();
  const [secureAccount, { isLoading: secureAccountLoading }] =
    useSecureAccountFromLoginActivityMutation();

  const [deletAllAcitivity, { isLoading: deletAllAcitivityLoading }] =
    useDeleteAllLoginActivityMutation();
  const [bulkDeleteActivities, { isLoading: isBulkDeleting }] =
    useBulkDeleteLoginActivitiesMutation();

  const selectableRows = loginActivities.filter(
    (row) => row.signin_status !== "Current device",
  );
  const allSelectableChecked =
    selectableRows.length > 0 &&
    selectableRows.every((row) => selectedIds.includes(row.id));

  const toggleSelectAll = () => {
    if (!isCurrentSessionTrusted) return;
    if (allSelectableChecked) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableRows.map((row) => row.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await bulkDeleteActivities({ ids: selectedIds }).unwrap();
      toast.success(
        res?.message || "Selected login activities deleted successfully.",
      );
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to delete selected activities.",
      );
    }
  };

  const openSessionActionConfirmation = (
    activity: LoginActivity,
    action: SessionActionConfirmation["action"],
  ) => {
    setSessionActionConfirmation({ activity, action });
    setIsSessionActionConfirmationOpen(true);
  };

  const handleSingeleSessionTrusted = async (id: number) => {
    try {
      const response = await singeleSessionTrusted(id).unwrap();
      toast.success(response?.message || "Session trusted successfully");
      setSelectedLoginActivity(null);
    } catch (error) {
      toast.error("Unable to trust this login activity.");
      console.error("Session trusted failed:", error);
    }
  };

  const handleSecureAccount = async (id: number) => {
    try {
      const response = await secureAccount(id).unwrap();
      setSecureAccountMessage(
        response?.message || "Your account has been secured successfully.",
      );
    } catch (error) {
      toast.error("Unable to secure your account.");
      console.error("Account security action failed:", error);
    }
  };

  const handleLogout = async (id: number) => {
    try {
      await logoutActivity(id).unwrap();
      toast.success("Logout successful");
      setIsSessionActionConfirmationOpen(false);
    } catch (error) {
      toast.error("Unable to sign out this session.");
      console.error("Logout failed:", error);
    }
  };

  const handelDelete = async (id: number) => {
    try {
      await deleteLoginActivity(id).unwrap();
      toast.success("Login activity deleted successfully.");
      setIsSessionActionConfirmationOpen(false);
    } catch (error) {
      toast.error("Unable to delete this login activity.");
      console.error("Login activity deletion failed:", error);
    }
  };

  const handelDeleteAll = async () => {
    try {
      await deletAllAcitivity({}).unwrap();
      toast.success("All other login activities cleared successfully");
      setShowClearAllModal(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to clear login activities.");
    }
  };

  const columns: Column<LoginActivity>[] = [
    {
      header: (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            aria-label="Select all deletable login activities"
            checked={allSelectableChecked}
            disabled={!isCurrentSessionTrusted || selectableRows.length === 0}
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded accent-[#287F6E] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>
      ),
      className: "w-10",
      cell: (row) => {
        const isCurrent = row.signin_status === "Current device";
        return (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              aria-label={`Select login activity ${row.id}`}
              checked={selectedIds.includes(row.id)}
              disabled={isCurrent || !isCurrentSessionTrusted}
              onChange={() => toggleSelectRow(row.id)}
              className="h-4 w-4 rounded accent-[#287F6E] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            />
          </div>
        );
      },
    },
    {
      header: "#",
      className: "w-10",
      cell: (row) => (
        <span className="text-xs font-medium text-[#9CA3AF]">
          {(page - 1) * limit + loginActivities.indexOf(row) + 1}
        </span>
      ),
    },

    {
      header: "Device & Location",
      cell: (row) => {
        const isCurrent = row.signin_status === "Current device";
        return (
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isCurrent
                  ? "bg-[#EDF8F6] text-[#287F6E] ring-1 ring-[#287F6E]/20"
                  : "bg-[#F3F4F6] text-[#4B5563]"
              }`}
            >
              {row?.is_mobile === true ? (
                <Smartphone className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="w-44">
                <span className="block w-44 truncate text-[13px] font-semibold text-[#1D1F2C]">
                  {row.device} • {row.browser}
                </span>
              </div>
              <span className="whitespace-nowrap text-xs font-normal text-[#7B7B7B]">
                {row.location && row.location !== "Unknown"
                  ? row.location
                  : "Location unavailable"}
              </span>
            </div>
          </div>
        );
      },
    },

    {
      header: "IP Address",
      cell: (row) => (
        <span className="inline-block whitespace-nowrap rounded-md bg-[#F3F4F6] px-2 py-1 font-mono text-xs text-[#4B5563]">
          {row.ip_address}
        </span>
      ),
    },

    {
      header: "Date & Time",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="whitespace-nowrap text-[13px] font-medium text-[#1D1F2C]">
            {dayjs.utc(row.login_at).tz(userTimezone).format("DD MMM YYYY")}
          </span>

          <span className="whitespace-nowrap text-xs text-[#8E929B]">
            {dayjs.utc(row.login_at).tz(userTimezone).format("hh:mm A")}
          </span>
        </div>
      ),
    },

    {
      header: "Status",
      cell: (row) => {
        const isSignedIn =
          row.signin_status === "Signed in" ||
          row.signin_status === "Current device";
        return (
          <CustomBadge
            color={isSignedIn ? "active" : "logout"}
            className={
              isSignedIn
                ? "inline-flex items-center whitespace-nowrap rounded-full border border-[#287F6E]/25 bg-[#EDF8F6] px-2.5 py-1 text-xs font-medium text-[#287F6E]"
                : "inline-flex items-center whitespace-nowrap rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#6B7280]"
            }
          >
            {row.signin_status}
          </CustomBadge>
        );
      },
    },

    {
      header: "Trust",
      cell: (row) => (
        <span
          className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${
            row.activity_status === "Trusted Device"
              ? "border-[#287F6E]/25 bg-[#EDF8F6] text-[#287F6E]"
              : row.activity_status === "Suspicious"
                ? "border-[#F38B94] bg-[#FEECEE] text-[#EB3D4D]"
                : "border-[#E5E7EB] bg-[#F8F9FA] text-[#6B7280]"
          }`}
        >
          {row.activity_status}
        </span>
      ),
    },

    {
      header: "Actions",
      cell: (row: LoginActivity) => {
        const isCurrentDevice = row.signin_status === "Current device";
        const isLoggedOut = row.signin_status === "Logged out";

        const isLogoutDisabled =
          !isCurrentSessionTrusted || isCurrentDevice || isLoggedOut;
        const isDeleteDisabled = !isCurrentSessionTrusted || isCurrentDevice;
        const isTrustedDisabled =
          !isCurrentSessionTrusted || isCurrentDevice || !row?.is_suspicious;

        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            {/* Verify / Trust suspicious */}
            <button
              type="button"
              title={
                isTrustedDisabled
                  ? "No review needed"
                  : "Confirm or block this login"
              }
              onClick={() => {
                setSecureAccountMessage(null);
                setSelectedLoginActivity(row);
              }}
              disabled={isTrustedDisabled || singeleSessionTrustedLoading}
              className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                isTrustedDisabled || singeleSessionTrustedLoading
                  ? "cursor-not-allowed border-transparent bg-[#F4F5F7] opacity-40"
                  : "cursor-pointer border-[#287F6E]/25 bg-[#EDF8F6] hover:bg-[#DDF3EE]"
              }`}
            >
              <TikIcon
                className={`h-4 w-4 ${
                  isTrustedDisabled || singeleSessionTrustedLoading
                    ? "text-[#9CA3AF]"
                    : "text-[#287F6E]"
                }`}
              />
            </button>

            {/* Sign out */}
            <button
              type="button"
              title={isLogoutDisabled ? "Session not active" : "Sign out session"}
              onClick={() =>
                !isLogoutDisabled &&
                openSessionActionConfirmation(row, "logout")
              }
              disabled={isLogoutDisabled}
              className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                isLogoutDisabled
                  ? "cursor-not-allowed border-transparent bg-[#F4F5F7] text-[#9CA3AF] opacity-40"
                  : "cursor-pointer border-[#E5E7EB] bg-white text-[#1D1F2C] hover:bg-[#F3F4F6]"
              }`}
            >
              <LogoutIcon className="h-4 w-4" />
            </button>

            {/* Delete */}
            <button
              type="button"
              title={
                isDeleteDisabled
                  ? "Current session cannot be deleted"
                  : "Delete login record"
              }
              onClick={() =>
                !isDeleteDisabled &&
                openSessionActionConfirmation(row, "delete")
              }
              disabled={isDeleteDisabled}
              className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                isDeleteDisabled
                  ? "cursor-not-allowed border-transparent bg-[#F4F5F7] text-[#9CA3AF] opacity-40"
                  : "cursor-pointer border-[#FBD8DB] bg-[#FEECEE] text-red-500 hover:bg-[#FCD8DC]"
              }`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const totalActivities = data?.total ?? loginActivities.length;

  return (
    <section className="w-full rounded-md border border-[#E8E8E8] bg-white">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => {
          setHasUserToggled(true);
          setIsExpanded((prev) => !prev);
        }}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-[#FAFAFA] sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EDF8F6] text-[#287F6E]">
            <Monitor className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold leading-[130%] tracking-[0.1px] text-headerColor sm:text-[20px]">
              Login Activity
            </h2>
            <p className="mt-1 text-sm text-[#4A4C56]">
              Review your recent account login activity and manage devices.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {hasSuspiciousAlert ? (
            <span className="hidden items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 sm:inline-flex">
              <ShieldAlert className="h-3.5 w-3.5" />
              Needs review
            </span>
          ) : (
            <span className="hidden items-center gap-1 rounded-full border border-[#287F6E]/30 bg-[#EDF8F6] px-2.5 py-0.5 text-xs font-medium text-[#287F6E] sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              All verified
            </span>
          )}
          <span className="hidden rounded-full border border-[#E8E8E8] bg-[#F8F9FA] px-2.5 py-0.5 text-xs font-medium text-[#4A4C56] sm:inline-block">
            {totalActivities} {totalActivities === 1 ? "record" : "records"}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-[#4A4C56] transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-[#F0F1F3] px-5 pb-6 pt-4 sm:px-6">
          <div className="mb-3.5 flex flex-col justify-between gap-2.5 rounded-lg border border-[#ECEEF2] bg-[#F8FAFC] px-3.5 py-2.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              {selectedIds.length > 0 ? (
                <>
                  <span className="inline-flex items-center rounded-full bg-[#EDF8F6] px-2.5 py-0.5 font-semibold text-[#287F6E]">
                    {selectedIds.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="cursor-pointer text-xs font-medium text-[#4B5563] underline hover:text-gray-900"
                  >
                    Clear selection
                  </button>
                </>
              ) : (
                <span>
                  Select rows to bulk delete, or clear inactive history.
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  disabled={!isCurrentSessionTrusted || isBulkDeleting}
                  onClick={() => setShowBulkDeleteModal(true)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#F38B94] bg-[#EB3D4D] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Selected ({selectedIds.length})</span>
                </button>
              )}
              <button
                type="button"
                disabled={
                  !isCurrentSessionTrusted ||
                  deletAllAcitivityLoading ||
                  loginActivities.length <= 1
                }
                onClick={() => setShowClearAllModal(true)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#FBD8DB] bg-white px-3 py-1.5 text-xs font-medium text-redColor transition-colors hover:bg-[#FEECEE]/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Activity History</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2.5">
              <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
            </div>
          ) : (
            <DataTable columns={columns} data={loginActivities} />
          )}

          {/* Backend Pagination */}
          {(data?.total_page || 1) > 1 && (
            <Pagination
              page={page}
              pageSize={limit}
              total={data?.total ?? 0}
              totalPages={data?.total_page || 1}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                setSelectedIds([]);
              }}
            />
          )}
        </div>
      )}

      <CustomModal
        open={isSessionActionConfirmationOpen}
        onOpenChange={(open) => {
          setIsSessionActionConfirmationOpen(open);
        }}
        title={
          sessionActionConfirmation?.action === "logout"
            ? "Sign out this session?"
            : "Delete this login activity?"
        }
        size="xsm"
        className="!pb-4"
      >
        <div className="px-3 pb-0">
          <p className="text-sm text-[#7B7B7B]">
            {sessionActionConfirmation?.action === "logout"
              ? "This will sign out the selected session. You can sign in again later."
              : "This will permanently remove the selected login activity from your history."}
          </p>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsSessionActionConfirmationOpen(false)}
              disabled={logoutLoading || deleteLoading}
              className="w-full rounded-sm border border-borderColor px-4 py-2 text-sm font-medium text-headerColor hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!sessionActionConfirmation) return;
                if (sessionActionConfirmation.action === "logout") {
                  void handleLogout(sessionActionConfirmation.activity.id);
                } else {
                  void handelDelete(sessionActionConfirmation.activity.id);
                }
              }}
              disabled={logoutLoading || deleteLoading}
              className={`w-full rounded-sm px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                sessionActionConfirmation?.action === "delete"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primaryColor hover:bg-primaryColor/90"
              }`}
            >
              {logoutLoading || deleteLoading
                ? "Please wait..."
                : sessionActionConfirmation?.action === "logout"
                  ? "Sign out"
                  : "Delete"}
            </button>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        open={selectedLoginActivity !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLoginActivity(null);
            setSecureAccountMessage(null);
          }
        }}
        title={
          secureAccountMessage
            ? "Account Secured"
            : "Confirm Login Activity"
        }
        size="xsm"
        className="!pb-4"
      >
        <div className="px-3 pb-0">
          {secureAccountMessage ? (
            <div>
              <p className="text-sm text-[#4A4C56]">{secureAccountMessage}</p>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSecureAccountMessage(null);
                    setSelectedLoginActivity(null);
                  }}
                  className="rounded-sm bg-primaryColor px-4 py-2 text-sm font-semibold text-white hover:bg-primaryColor/90"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#7B7B7B]">
                Confirm whether you recognize this login activity.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={
                    singeleSessionTrustedLoading || secureAccountLoading
                  }
                  onClick={() => {
                    if (selectedLoginActivity) {
                      void handleSingeleSessionTrusted(selectedLoginActivity.id);
                    }
                  }}
                  className="w-full rounded-sm bg-primaryColor px-4 py-2 text-sm font-semibold text-white hover:bg-primaryColor/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Yes, it’s me
                </button>
                <button
                  type="button"
                  disabled={
                    singeleSessionTrustedLoading || secureAccountLoading
                  }
                  onClick={() => {
                    if (selectedLoginActivity) {
                      void handleSecureAccount(selectedLoginActivity.id);
                    }
                  }}
                  className="w-full rounded-sm border border-[#F38B94] bg-white px-4 py-2 text-sm font-semibold text-redColor hover:bg-[#FEECEE] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  No, it’s not me
                </button>
              </div>
            </>
          )}
        </div>
      </CustomModal>

      {/* Bulk Delete Selected Confirmation Modal */}
      <CustomModal
        open={showBulkDeleteModal}
        onOpenChange={setShowBulkDeleteModal}
        title={`Delete ${selectedIds.length} Selected Activity?`}
        size="xsm"
        className="!pb-4"
      >
        <div className="px-3 pb-0">
          <p className="text-sm text-[#7B7B7B]">
            This will permanently remove the selected {selectedIds.length} login
            activity record(s) and sign out any active sessions among them.
          </p>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowBulkDeleteModal(false)}
              disabled={isBulkDeleting}
              className="w-full rounded-sm border border-borderColor px-4 py-2 text-sm font-medium text-headerColor hover:bg-gray-50 disabled:opacity-60 sm:w-auto cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleBulkDelete()}
              disabled={isBulkDeleting}
              className="w-full rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto cursor-pointer"
            >
              {isBulkDeleting ? "Deleting..." : "Delete Selected"}
            </button>
          </div>
        </div>
      </CustomModal>

      {/* Clear All Activities Confirmation Modal */}
      <CustomModal
        open={showClearAllModal}
        onOpenChange={setShowClearAllModal}
        title="Clear Activity History?"
        size="xsm"
        className="!pb-4"
      >
        <div className="px-3 pb-0">
          <p className="text-sm text-[#7B7B7B]">
            This will remove all other login activities and sign out those
            sessions. Your current device will remain signed in.
          </p>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowClearAllModal(false)}
              disabled={deletAllAcitivityLoading}
              className="w-full rounded-sm border border-borderColor px-4 py-2 text-sm font-medium text-headerColor hover:bg-gray-50 disabled:opacity-60 sm:w-auto cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handelDeleteAll()}
              disabled={deletAllAcitivityLoading}
              className="w-full rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto cursor-pointer"
            >
              {deletAllAcitivityLoading ? "Clearing..." : "Clear All"}
            </button>
          </div>
        </div>
      </CustomModal>
    </section>
  );
}
