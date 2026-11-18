"use client";

import { useState } from "react";
import TransactionStatusCard from "@/app/(Front-End)/_components/adminDashboard/subscription/transaction/TransactionSatusCard";
import TransactionTable from "@/app/(Front-End)/_components/adminDashboard/subscription/transaction/TransactionTable";
import { TransactionTypeFilter } from "@/feature/slice/admin/subscription/subscriptionType";

export default function Page() {
  const [activeType, setActiveType] = useState<TransactionTypeFilter>("all");

  return (
    <div>
      <TransactionStatusCard
        activeType={activeType}
        onSelectType={setActiveType}
      />
      <TransactionTable
        activeType={activeType}
        onTypeChange={setActiveType}
      />
    </div>
  );
}
