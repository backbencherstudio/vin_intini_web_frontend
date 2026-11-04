"use client";

import { useState } from "react";
import SecurityOverview from "./SecurityOverview";
import ChangePassword from "./ChangePassword";
import ActiveSessions from "./ActiveSessions";
import TwoFactorAuthentication from "./TwoFactorAuthentication";
import AuthenticationMethods from "./AuthenticationMethods";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="w-full space-y-6 pb-12">
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
