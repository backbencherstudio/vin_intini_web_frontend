import OverViewStatusCard from "@/app/(Front-End)/_components/adminDashboard/subscription/OverViewStatus";
import OverViewTable from "@/app/(Front-End)/_components/adminDashboard/subscription/OverViewTable";

export default function Page() {
  return (
    <div>
      <div>
        <OverViewStatusCard />
      </div>
      <div className="mt-8">
        <OverViewTable />
      </div>
    </div>
  );
}
