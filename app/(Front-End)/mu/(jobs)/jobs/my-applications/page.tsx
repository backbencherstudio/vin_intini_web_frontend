import React from "react";
import MyJobApplicationsApply from "../_component/MyJobApplicationsApply";

export default function MyApplicationsPage() {
  return (
    <main className="w-full">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-borderColor pb-3 min-h-[66px]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-headerColor leading-tight">
            My Applications
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Track and manage your applied jobs and application statuses.
          </p>
        </div>
      </header>
      <MyJobApplicationsApply />
    </main>
  );
}
