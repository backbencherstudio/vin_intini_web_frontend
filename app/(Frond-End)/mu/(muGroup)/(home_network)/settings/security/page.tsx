import LoginActivityTable from "@/app/(Frond-End)/_components/adminDashboard/settings/LoginActivityTable";
import SecuritySettings from "@/app/(Frond-End)/_components/adminDashboard/settings/SecuritySetting";
import DeleteAccountAction from "../_component/DeleteAccountAction";

function page() {
  return (
    <div>
      <div>
        <SecuritySettings />
        <div>
          <LoginActivityTable />
        </div>
        <div className="pt-4 mt-8 border-t border-borderColor">
          <DeleteAccountAction />
        </div>
      </div>
    </div>
  );
}

export default page;
