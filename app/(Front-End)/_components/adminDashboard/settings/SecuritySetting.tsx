"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useGetSecurityOverviewQuery } from "@/feature/slice/admin/securitySettings";
import SecurityOverview from "./SecurityOverview";
import ChangePassword from "./ChangePassword";
import ActiveSessions from "./ActiveSessions";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import AuthenticationMethods from "./AuthenticationMethods";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const { data: overviewRes, isLoading: isOverviewLoading } =
    useGetSecurityOverviewQuery({});
  const isUntrustedSession =
    !isOverviewLoading &&
    overviewRes?.data?.is_current_session_trusted === false;

  return (
    <div className="w-full space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderColor min-h-[66px] pb-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor leading-tight">
            Security Settings
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Manage your account security, access, and authentication settings.
          </p>
        </div>
      </div>

      {isUntrustedSession && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <p className="font-semibold">Unverified Device Session</p>
            <p className="mt-0.5 text-amber-800">
              For your protection, sensitive actions (revoking sessions, trusting
              devices, clearing login history, changing password, 2FA updates,
              or deleting your account) are disabled from an unverified session.
              Please confirm this login via the security alert email sent to
              your inbox, or sign in from a trusted device.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Security Overview */}
        <SecurityOverview twoFactorEnabled={twoFactorEnabled} />

        {/* Password + Sessions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-stretch">
          <ChangePassword />
          <ActiveSessions />
        </div>

        {/* 2FA + Authentication Methods */}
        <div className=" ">
          <TwoFactorAuthentication />
        </div>
      </div>
    </div>
  );
}
