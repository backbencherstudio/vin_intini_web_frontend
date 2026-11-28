"use client";

import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  AlertTriangle,
  ChevronDown,
  Clock,
  Globe,
  History,
  KeyRound,
  LogIn,
  LogOut,
  MailCheck,
  Monitor,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import Pagination from "@/components/reusable/Pagination";
import { useGetSecurityAuditLogsQuery } from "@/feature/slice/admin/securitySettings";

dayjs.extend(relativeTime);

interface AuditItem {
  id: number;
  event: string;
  severity: "info" | "warning" | "critical";
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

function formatEventDetails(item: AuditItem): {
  title: string;
  summary: string | null;
} {
  const meta = item.metadata || {};

  if (item.event === "login_success") {
    const trusted = meta.trusted !== false;
    const device = typeof meta.device === "string" ? meta.device : null;
    const browser = typeof meta.browser === "string" ? meta.browser : null;
    const location =
      typeof meta.location === "string" && meta.location !== "Unknown"
        ? meta.location
        : null;
    const parts = [
      [device, browser].filter(Boolean).join(" • "),
      location,
    ].filter(Boolean);

    return {
      title: trusted
        ? "Signed in from trusted device"
        : "Sign-in from unverified device",
      summary: parts.length > 0 ? parts.join(" • ") : null,
    };
  }

  const labels: Record<string, string> = {
    login_failed: "Failed sign-in attempt",
    logout: "Signed out of session",
    session_revoked: "Remote session signed out",
    sessions_signed_out_all: "Signed out all other sessions",
    login_activity_deleted: "Removed a login activity record",
    login_activities_bulk_deleted: "Bulk-deleted login activity records",
    login_activities_cleared: "Cleared login activity history",
    device_trusted: "Device marked as trusted",
    device_trusted_via_email: "Device verified via security email",
    devices_trusted_all: "Trusted pending login alerts",
    suspicious_session_blocked: "Suspicious session blocked",
    password_changed: "Account password updated",
    password_reset: "Account password reset",
    password_reset_via_alert: "Emergency password reset from alert",
    "2fa_enabled": "Two-factor authentication enabled",
    "2fa_disabled": "Two-factor authentication disabled",
    "2fa_recovery_codes_regenerated": "2FA backup codes regenerated",
    "2fa_login_verified": "Two-factor login verified",
    "2fa_recovery_login": "Signed in using recovery OTP",
    recovery_email_verified: "Recovery email verified",
    account_delete_requested: "Account deletion requested",
    account_restored: "Account reactivated",
    refresh_token_reuse_detected: "Refresh token reuse detected & blocked",
  };

  let summary: string | null = null;
  if (typeof meta.device === "string" && meta.device) {
    summary = meta.device;
  } else if (typeof meta.deleted_count === "number") {
    summary = `${meta.deleted_count} record(s) removed`;
  } else if (typeof meta.count === "number") {
    summary = `${meta.count} session(s) affected`;
  } else if (meta.backup_code === true) {
    summary = "Verified with backup recovery code";
  } else if (typeof meta.recovery_email === "string") {
    summary = meta.recovery_email;
  }

  return {
    title: labels[item.event] || item.event.replaceAll("_", " "),
    summary,
  };
}

function getEventIcon(event: string) {
  switch (event) {
    case "login_success":
    case "2fa_login_verified":
    case "2fa_recovery_login":
      return LogIn;
    case "logout":
    case "session_revoked":
    case "sessions_signed_out_all":
      return LogOut;
    case "password_changed":
    case "password_reset":
    case "password_reset_via_alert":
    case "2fa_recovery_codes_regenerated":
      return KeyRound;
    case "login_activity_deleted":
    case "login_activities_bulk_deleted":
    case "login_activities_cleared":
      return Trash2;
    case "recovery_email_verified":
      return MailCheck;
    case "account_delete_requested":
      return UserX;
    case "account_restored":
      return UserCheck;
    case "suspicious_session_blocked":
    case "refresh_token_reuse_detected":
    case "login_failed":
    case "2fa_disabled":
      return ShieldAlert;
    default:
      return ShieldCheck;
  }
}

const SEVERITY_STYLES: Record<
  string,
  {
    badgeLabel: string;
    badgeClass: string;
    iconBg: string;
    iconColor: string;
    borderHover: string;
  }
> = {
  info: {
    badgeLabel: "Info",
    badgeClass: "border-[#287F6E]/25 bg-[#EDF8F6] text-[#287F6E]",
    iconBg: "bg-[#EDF8F6] ring-1 ring-[#287F6E]/15",
    iconColor: "text-[#287F6E]",
    borderHover: "hover:border-[#287F6E]/30",
  },
  warning: {
    badgeLabel: "Notice",
    badgeClass: "border-amber-300/80 bg-amber-50 text-amber-800",
    iconBg: "bg-amber-50 ring-1 ring-amber-200",
    iconColor: "text-amber-600",
    borderHover: "hover:border-amber-300/80",
  },
  critical: {
    badgeLabel: "Critical",
    badgeClass: "border-red-300 bg-red-50 text-red-700",
    iconBg: "bg-red-50 ring-1 ring-red-200",
    iconColor: "text-red-600",
    borderHover: "hover:border-red-300",
  },
};

export default function SecurityAuditLogs() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetSecurityAuditLogsQuery({
    page,
    per_page: 6,
  });

  const logs = (data?.data || []) as AuditItem[];
  const meta = data?.meta;
  const totalEvents = meta?.total ?? logs.length;

  return (
    <section className="rounded-md border border-[#E8E8E8] bg-white">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-[#FAFAFA] sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EDF8F6] text-[#287F6E]">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold leading-[130%] tracking-[0.1px] text-headerColor sm:text-[20px]">
              Security Audit Log
            </h2>
            <p className="mt-1 text-sm text-[#4A4C56]">
              Immutable timeline of authentication and account-security events.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <span className="hidden rounded-full border border-[#E8E8E8] bg-[#F8F9FA] px-2.5 py-0.5 text-xs font-medium text-[#4A4C56] sm:inline-block">
            {totalEvents} {totalEvents === 1 ? "event" : "events"}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-[#4A4C56] transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-[#F0F1F3] px-5 pb-6 pt-5 sm:px-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-16 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-16 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-16 animate-pulse rounded-lg bg-gray-100" />
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#E8E8E8] bg-[#FAFAFA] py-8 text-center">
              <History className="mx-auto h-6 w-6 text-[#9CA3AF]" />
              <p className="mt-2 text-sm text-[#7B7B7B]">
                No security audit events recorded yet.
              </p>
            </div>
          ) : (
            <div className="relative space-y-2.5">
              {logs.map((item, idx) => {
                const style =
                  SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.info;
                const EventIcon = getEventIcon(item.event);
                const { title, summary } = formatEventDetails(item);
                const isLast = idx === logs.length - 1;

                return (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col justify-between gap-3 rounded-lg border border-[#ECEEF2] bg-[#FCFCFD] px-4 py-3.5 transition-all hover:bg-white hover:shadow-xs sm:flex-row sm:items-center ${style.borderHover}`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Fixed-width timeline icon rail */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}
                        >
                          <EventIcon className="h-4 w-4" />
                        </div>
                        {!isLast && (
                          <span
                            aria-hidden="true"
                            className="mt-1.5 hidden h-4 w-px bg-[#E5E7EB] sm:block"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[14px] font-semibold text-[#1D1F2C]">
                            {title}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${style.badgeClass}`}
                          >
                            {item.severity === "warning" && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                            {item.severity === "critical" && (
                              <ShieldAlert className="h-3 w-3" />
                            )}
                            {style.badgeLabel}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7280]">
                          {summary && (
                            <span className="inline-flex items-center gap-1">
                              <Monitor className="h-3.5 w-3.5 text-[#9CA3AF]" />
                              <span>{summary}</span>
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded bg-[#F3F4F6] px-1.5 py-0.5 font-mono text-[11px] text-[#4B5563]">
                            <Globe className="h-3 w-3 text-[#9CA3AF]" />
                            {item.ip_address || "Unknown IP"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 pl-12 text-xs text-[#6B7280] sm:flex-col sm:items-end sm:gap-0.5 sm:pl-0">
                      <span className="font-medium text-[#374151]">
                        {dayjs(item.created_at).format("DD MMM YYYY, hh:mm A")}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                        <Clock className="h-3 w-3" />
                        {dayjs(item.created_at).fromNow()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {meta && meta.last_page > 1 && (
            <Pagination
              page={page}
              pageSize={meta.per_page || 6}
              total={meta.total}
              totalPages={meta.last_page}
              onPageChange={(nextPage) => setPage(nextPage)}
            />
          )}
        </div>
      )}
    </section>
  );
}
