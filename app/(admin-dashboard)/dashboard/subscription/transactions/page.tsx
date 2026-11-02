import TransactionStatusCard from "@/app/(Front-End)/_components/adminDashboard/subscription/transaction/TransactionSatusCard";
import TransactionTable from "@/app/(Front-End)/_components/adminDashboard/subscription/transaction/TransactionTable";

export default function Page() {
  return (
    <div>
      <div>
        <TransactionStatusCard />
      </div>
      <TransactionTable />
    </div>
  );
}
