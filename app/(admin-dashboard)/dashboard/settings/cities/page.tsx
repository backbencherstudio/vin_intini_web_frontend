"use client";

import React from "react";
import CityOverviewCards from "@/app/(Front-End)/_components/adminDashboard/city/CityOverviewCards";
import CityDataTable from "@/app/(Front-End)/_components/adminDashboard/city/CityDataTable";
import { useGetAdminCitiesQuery } from "@/feature/slice/admin/city/cityApi";

export default function CitiesSettingsPage() {
  const { data: citiesResponse, isLoading } = useGetAdminCitiesQuery({
    page: 1,
    per_page: 1,
  });

  const totalCities = citiesResponse?.summary?.total_cities ?? 0;
  const totalStates = citiesResponse?.summary?.total_states ?? 51;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Cities & Locations Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage supported cities across the 51 fixed US states. Cities link to Job Postings and Candidate Preferences.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <CityOverviewCards
        totalCities={totalCities}
        totalStates={totalStates}
        isLoading={isLoading}
      />

      {/* Main Cities Table */}
      <CityDataTable />
    </div>
  );
}
