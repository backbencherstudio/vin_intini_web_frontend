import LoginActivityTable from "@/app/(Front-End)/_components/adminDashboard/settings/LoginActivityTable";
import SecurityAuditLogs from "@/app/(Front-End)/_components/adminDashboard/settings/SecurityAuditLogs";
import SecuritySettings from "@/app/(Front-End)/_components/adminDashboard/settings/SecuritySetting";
import DeleteAccountAction from "../_component/DeleteAccountAction";

function Page() {
  return (
    <div className="space-y-4 pb-8">
      <SecuritySettings />
      <LoginActivityTable />
      <SecurityAuditLogs />
      <DeleteAccountAction />
    </div>
  );
}

export default Page;
