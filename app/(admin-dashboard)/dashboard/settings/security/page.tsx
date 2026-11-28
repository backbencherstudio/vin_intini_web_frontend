import LoginActivityTable from "@/app/(Front-End)/_components/adminDashboard/settings/LoginActivityTable";
import SecurityAuditLogs from "@/app/(Front-End)/_components/adminDashboard/settings/SecurityAuditLogs";
import SecuritySettings from "@/app/(Front-End)/_components/adminDashboard/settings/SecuritySetting";

export default function Page() {
  return (
    <div className="space-y-4 pb-8">
      <SecuritySettings />
      <LoginActivityTable />
      <SecurityAuditLogs />
    </div>
  );
}
