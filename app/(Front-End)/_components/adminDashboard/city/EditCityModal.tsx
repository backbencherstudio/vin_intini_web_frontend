"use client";

import React, { useState, useEffect } from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { useUpdateAdminCityMutation, type CityItem, type StateItem } from "@/feature/slice/admin/city/cityApi";
import toast from "react-hot-toast";

interface EditCityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: CityItem | null;
  states: StateItem[];
}

export default function EditCityModal({
  open,
  onOpenChange,
  city,
  states,
}: EditCityModalProps) {
  const [stateId, setStateId] = useState<string | number>("");
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [updateCity, { isLoading }] = useUpdateAdminCityMutation();

  useEffect(() => {
    if (city && open) {
      setStateId(city.state_id);
      setCityName(city.name);
      setError(null);
    }
  }, [city, open]);

  const stateOptions = states.map((s) => ({
    label: `${s.name} (${s.code})`,
    value: s.id,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;

    setError(null);
    const trimmedName = cityName.trim();
    if (!trimmedName) {
      setError("Please enter a valid city name.");
      return;
    }

    try {
      const res = await updateCity({
        id: city.id,
        state_id: Number(stateId),
        name: trimmedName,
      }).unwrap();

      toast.success(res?.message || `City updated to '${trimmedName}' successfully!`);
      onOpenChange(false);
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.data?.errors?.name?.[0] ||
        err?.data?.errors?.state_id?.[0] ||
        "Failed to update city. Please try again.";
      setError(apiMessage);
      toast.error(apiMessage);
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit City"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <CustomSelect
            label="State"
            required
            options={stateOptions}
            value={stateId}
            onChange={(val) => setStateId(val)}
            placeholder="Select a state"
          />
          <p className="mt-1 text-xs text-gray-500">
            You can reassign this city to another state if it was mistakenly categorized.
          </p>
        </div>

        <div>
          <CustomInput
            label="City Name"
            required
            placeholder="City Name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            error={error || undefined}
          />
        </div>

        {city && (city.industry_job_posts_count ?? 0) > 0 && (
          <div className="rounded-lg bg-teal-50 border border-teal-200 p-3 text-xs text-teal-800">
            ℹ️ <strong>Note:</strong> This city is currently linked to{" "}
            <strong>{city.industry_job_posts_count} active job post(s)</strong>.
            Editing the name will cleanly update the location shown across all those job listings without breaking any links.
          </div>
        )}

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
            type="submit"
            variant="primary"
            loading={isLoading}
            loadingText="Saving..."
          >
            Save Changes
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
}
