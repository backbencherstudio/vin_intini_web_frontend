"use client";

import React from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import { useDeleteAdminCityMutation, type CityItem } from "@/feature/slice/admin/city/cityApi";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteCityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: CityItem | null;
  onSwitchToEdit?: (city: CityItem) => void;
}

export default function DeleteCityModal({
  open,
  onOpenChange,
  city,
  onSwitchToEdit,
}: DeleteCityModalProps) {
  const [deleteCity, { isLoading }] = useDeleteAdminCityMutation();

  if (!city) return null;

  const jobsCount = city.industry_job_posts_count ?? 0;
  const prefsCount = city.user_job_preferences_count ?? 0;
  const isInUse = jobsCount > 0 || prefsCount > 0;

  const handleDelete = async () => {
    try {
      const res = await deleteCity(city.id).unwrap();
      toast.success(res?.message || `City '${city.name}' deleted successfully.`);
      onOpenChange(false);
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        "Failed to delete city. Please ensure it is not referenced by existing jobs.";
      toast.error(apiMessage);
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title={isInUse ? "Cannot Delete City" : "Confirm City Deletion"}
      size="sm"
    >
      <div className="space-y-4 pt-2">
        {isInUse ? (
          <>
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900">
                  Data Protection Guard Active
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  <strong>{city.name}</strong> ({city.state?.name || "State"}) is currently referenced by:
                </p>
                <ul className="mt-2 list-disc list-inside text-xs font-medium text-amber-900 space-y-1">
                  {jobsCount > 0 && <li>{jobsCount} active job post(s)</li>}
                  {prefsCount > 0 && <li>{prefsCount} candidate job preference(s)</li>}
                </ul>
                <p className="mt-2 text-xs text-amber-700">
                  Deleting this city would erase the location data on those job listings. To maintain relational data integrity, in-use cities cannot be deleted.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <CustomButton
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Close
              </CustomButton>
              {onSwitchToEdit && (
                <CustomButton
                  type="button"
                  variant="primary"
                  onClick={() => {
                    onOpenChange(false);
                    onSwitchToEdit(city);
                  }}
                >
                  Edit City Instead
                </CustomButton>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
              <div>
                <h4 className="text-sm font-semibold text-red-900">
                  Are you sure you want to delete this city?
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-red-700">
                  You are about to delete <strong>{city.name}</strong> from{" "}
                  <strong>{city.state?.name || "State"}</strong>. This city currently has 0 linked job posts.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <CustomButton
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="button"
                variant="destructive"
                loading={isLoading}
                loadingText="Deleting..."
                onClick={handleDelete}
              >
                Delete City
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </CustomModal>
  );
}
