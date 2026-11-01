"use client";

import { useState } from "react";
import AdvertisementTable from "@/app/(Front-End)/_components/adminDashboard/advertisement/AdvertisementDataTable";
import AdvertisementStatusCard from "@/app/(Front-End)/_components/adminDashboard/advertisement/AdvertisementStatusCard";
import BoostSettingsPanel from "@/app/(Front-End)/_components/adminDashboard/advertisement/BoostSettingsPanel";
import CustomModal from "@/components/reusable/dashboard/CustomModal";

export default function Page() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AdvertisementStatusCard />
      <AdvertisementTable onOpenSettings={() => setSettingsOpen(true)} />
      <CustomModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        title="Boost settings"
        size="xl"
      >
        <BoostSettingsPanel embedded />
      </CustomModal>
    </div>
  );
}
