"use client";

import React from "react";
import { MapPin, Globe2, Briefcase } from "lucide-react";

interface CityOverviewCardsProps {
  totalCities?: number;
  totalStates?: number;
  citiesWithJobs?: number;
  isLoading?: boolean;
}

export default function CityOverviewCards({
  totalCities = 0,
  totalStates = 51,
  citiesWithJobs = 0,
  isLoading = false,
}: CityOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Cities Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Total Cities
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-gray-200" />
              ) : (
                totalCities.toLocaleString()
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Cities managed across US states
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#04A1B7]">
            <MapPin className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Fixed US States Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              US States (Fixed)
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {isLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-gray-200" />
              ) : (
                totalStates
              )}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              50 States + DC • Immutable Master Anchor
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Globe2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Relational Safety / Jobs Linked Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Data Integrity Guard
            </p>
            <p className="mt-2 text-lg font-bold text-gray-900">
              Active Job Protection
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Cities linked to live job posts are protected from accidental deletion
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
