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
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <CustomTitleDescription
          title="Security Settings"
          description="Manage your account security, access, and authentication settings."
        />
      </div>

      <div className="space-y-6">
        {/* Security Overview */}
        <SecurityOverview twoFactorEnabled={twoFactorEnabled} />

        {/* Password + Sessions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
