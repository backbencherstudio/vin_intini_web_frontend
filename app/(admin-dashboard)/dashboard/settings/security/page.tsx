import LoginActivityTable from "@/app/(Front-End)/_components/adminDashboard/settings/LoginActivityTable";
import SecuritySettings from "@/app/(Front-End)/_components/adminDashboard/settings/SecuritySetting";

export default function Page() {
  return (
    <div className="space-y-8">
      <SecuritySettings />
      <LoginActivityTable />
    </div>
  );
}
