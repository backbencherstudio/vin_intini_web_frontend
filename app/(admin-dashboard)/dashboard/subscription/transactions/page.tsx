import TransactionStatusCard from "@/app/(Frond-End)/_components/adminDashboard/subscription/transaction/TransactionSatusCard";
import TransactionTable from "@/app/(Frond-End)/_components/adminDashboard/subscription/transaction/TransactionTable";

export default function page() {
    return (
        <div>
            <div className="pb-5">
                <TransactionStatusCard />
            </div>
            <TransactionTable />
        </div>
    )
}
