"use client";

import React, { useState } from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { useCreateAdminCityMutation, type StateItem } from "@/feature/slice/admin/city/cityApi";
import toast from "react-hot-toast";

interface AddCityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  states: StateItem[];
  defaultStateId?: number | string;
}

export default function AddCityModal({
  open,
  onOpenChange,
  states,
  defaultStateId,
}: AddCityModalProps) {
  const [stateId, setStateId] = useState<string | number>(defaultStateId || "");
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [createCity, { isLoading }] = useCreateAdminCityMutation();

  // Reset form when modal opens or closes
  React.useEffect(() => {
    if (open) {
      setStateId(defaultStateId || (states.length > 0 ? states[0].id : ""));
      setCityName("");
      setError(null);
    }
  }, [open, defaultStateId, states]);

  const stateOptions = states.map((s) => ({
    label: `${s.name} (${s.code})`,
    value: s.id,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = cityName.trim();
    if (!trimmedName) {
      setError("Please enter a valid city name.");
      return;
    }

    if (!stateId) {
      setError("Please select a state for this city.");
      return;
    }

    try {
      const res = await createCity({
        state_id: Number(stateId),
        name: trimmedName,
      }).unwrap();

      toast.success(res?.message || `City '${trimmedName}' added successfully!`);
      onOpenChange(false);
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.data?.errors?.name?.[0] ||
        err?.data?.errors?.state_id?.[0] ||
        "Failed to add city. Please check if it already exists.";
      setError(apiMessage);
      toast.error(apiMessage);
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New City"
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
            Select which US state this city belongs to.
          </p>
        </div>

        <div>
          <CustomInput
            label="City Name"
            required
            placeholder="e.g. Austin, San Jose, Miami"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            error={error || undefined}
          />
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
            type="submit"
            variant="primary"
            loading={isLoading}
            loadingText="Adding City..."
          >
            Add City
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
}
