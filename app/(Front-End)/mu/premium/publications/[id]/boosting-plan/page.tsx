"use client";

import Breadcrumb from "@/app/(Front-End)/_components/Breadcrumb";
import PublicationBoostingPlanPage from "@/app/(Front-End)/mu/(pro-industry)/publications/[id]/boosting-plan/page";

export default function PremiumPublicationBoostingPlanPage() {
  return (
    <div className="pb-10">
      <div className="pb-4">
        <Breadcrumb />
      </div>
      <PublicationBoostingPlanPage />
    </div>
  );
}
