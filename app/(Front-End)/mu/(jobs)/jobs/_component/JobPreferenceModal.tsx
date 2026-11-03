"use client";

import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import RootDialog from "@/components/reusable/RootDialog";
import { Label } from "@/components/ui/label";
import { useGetStateByCityQuery } from "@/feature/slice/jobs/jobSlice";
import {
  useClearUserJobPreferenceMutation,
  useGetUserJobPreferenceQuery,
  useSaveUserJobPreferenceMutation,
} from "@/feature/slice/jobs/userJobSlice";
import { useGetAllStatesQuery } from "@/feature/slice/settingSlice";
import {
  categoryOptions,
  employmentTypeOptions,
  levelOptions,
  locationTypeOptions,
  networkOptions,
} from "@/public/demoData/RealData";
import { Loader2, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface JobPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

interface PreferenceFormData {
  job_title: string;
  network_type: string;
  category: string;
  work_mode: string;
  employment_type: string;
  level: string;
  salary_min: string;
  salary_max: string;
  state_id: string;
  city_id: string;
}

export default function JobPreferenceModal({
  isOpen,
  onClose,
  onSaved,
}: JobPreferenceModalProps) {
  const { data: prefResponse, isLoading: isPrefLoading } =
    useGetUserJobPreferenceQuery(undefined, { skip: !isOpen });

  const [savePreference, { isLoading: isSaving }] =
    useSaveUserJobPreferenceMutation();
  const [clearPreference, { isLoading: isClearing }] =
    useClearUserJobPreferenceMutation();

  const { data: statesData } = useGetAllStatesQuery(undefined, {
    skip: !isOpen,
  });

  const stateOptions = useMemo(() => {
    return (statesData?.data || []).map((s: any) => ({
      value: String(s.id),
      label: s.name,
      code: s.code,
    }));
  }, [statesData]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
  } = useForm<PreferenceFormData>({
    defaultValues: {
      job_title: "",
      network_type: "",
      category: "",
      work_mode: "",
      employment_type: "",
      level: "",
      salary_min: "",
      salary_max: "",
      state_id: "",
      city_id: "",
    },
  });

  const selectedStateId = watch("state_id");

  const selectedStateObj = stateOptions.find(
    (s: any) => String(s.value) === String(selectedStateId),
  );
  const selectedStateCode = selectedStateObj?.code;

  const { data: citiesData, isLoading: isCitiesLoading } =
    useGetStateByCityQuery(selectedStateCode, {
      skip: !selectedStateCode || !isOpen,
    });

  const cityOptions = useMemo(() => {
    const rawCities = citiesData?.data ?? citiesData ?? [];
    if (!Array.isArray(rawCities)) return [];
    return rawCities.map((c: any) => {
      if (typeof c === "string") {
        return { value: c, label: c };
      }
      return {
        value: String(c?.id ?? c?.name ?? c?.city ?? c),
        label: c?.name || c?.city || c?.label || String(c),
      };
    });
  }, [citiesData]);

  // Pre-fill form when preference data loads
  useEffect(() => {
    if (prefResponse?.data) {
      const p = prefResponse.data;
      reset({
        job_title: p.job_title || "",
        network_type: p.network_type || "",
        category: p.category || "",
        work_mode: p.work_mode || "",
        employment_type: p.employment_type || "",
        level: p.level || "",
        salary_min: p.salary_min ? String(Number(p.salary_min)) : "",
        salary_max: p.salary_max ? String(Number(p.salary_max)) : "",
        state_id: p.state_id ? String(p.state_id) : "",
        city_id: p.city_id ? String(p.city_id) : "",
      });
    } else if (prefResponse && !prefResponse.data) {
      reset({
        job_title: "",
        network_type: "",
        category: "",
        work_mode: "",
        employment_type: "",
        level: "",
        salary_min: "",
        salary_max: "",
        state_id: "",
        city_id: "",
      });
    }
  }, [prefResponse, reset]);

  const onSubmit = async (data: PreferenceFormData) => {
    try {
      const parseNumber = (val: string) => {
        if (!val) return undefined;
        const cleaned = val.replace(/[^0-9.]/g, "");
        return cleaned !== "" ? Number(cleaned) : undefined;
      };

      const parseId = (val: string) => {
        if (!val) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      };

      const payload = {
        job_title: data.job_title?.trim() || null,
        network_type: data.network_type || null,
        category: data.category || null,
        work_mode: data.work_mode || null,
        employment_type: data.employment_type || null,
        level: data.level || null,
        salary_min: parseNumber(data.salary_min) ?? null,
        salary_max: parseNumber(data.salary_max) ?? null,
        state_id: parseId(data.state_id) ?? null,
        city_id: parseId(data.city_id) ?? null,
      };

      const res = await savePreference(payload).unwrap();
      toast.success(res?.message || "Job preferences saved!");
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error("Save preference error:", err);
      toast.error(
        err?.data?.message || "Failed to save preferences. Please try again.",
      );
    }
  };

  const handleClear = async () => {
    try {
      await clearPreference().unwrap();
      reset({
        job_title: "",
        network_type: "",
        category: "",
        work_mode: "",
        employment_type: "",
        level: "",
        salary_min: "",
        salary_max: "",
        state_id: "",
        city_id: "",
      });
      toast.success("Job preferences cleared!");
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error("Clear preference error:", err);
      toast.error("Failed to clear preferences.");
    }
  };

  return (
    <RootDialog
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      ariaLabel="Job Preferences"
      ariaDescription="Customize your job preferences for personalized recommendations"
      className="max-w-2xl! rounded-2xl! overflow-hidden p-0 flex flex-col max-h-[88vh]"
    >
      <div className="flex flex-col h-full max-h-[88vh] bg-white overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between w-full px-6 py-4 border-b border-borderColor/60 bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-bold text-headerColor">
              Job Preferences
            </h3>
            <p className="text-xs text-descriptionColor mt-0.5">
              Set the criteria you prefer. Leave any field blank to keep it open.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-descriptionColor hover:bg-gray-100 hover:text-headerColor transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 px-6 py-5 overflow-y-auto">
          {isPrefLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primaryColor" />
              <p className="text-sm">Loading your preferences...</p>
            </div>
          ) : (
            <form id="job-preference-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4.5">
                {/* Row 1: Desired Job Title & Network */}
                <ReusableInput
                  id="job_title"
                  label="Desired Job Title"
                  placeholder="e.g., Clinical Psychologist, Professor"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  {...register("job_title")}
                />

                <div className="space-y-1.5">
                  <Label
                    htmlFor="network_type"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Network
                  </Label>
                  <Controller
                    control={control}
                    name="network_type"
                    render={({ field }) => (
                      <SelecteInputField
                        id="network_type"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder="Select Network"
                        options={networkOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                </div>

                {/* Row 2: Category & Work Mode */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="category"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Category
                  </Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <SelecteInputField
                        id="category"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder="Select Category"
                        options={categoryOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="work_mode"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Work Mode
                  </Label>
                  <Controller
                    control={control}
                    name="work_mode"
                    render={({ field }) => (
                      <SelecteInputField
                        id="work_mode"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder="Select work mode"
                        options={locationTypeOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                </div>

                {/* Row 3: Employment Type & Level */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="employment_type"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Employment Type
                  </Label>
                  <Controller
                    control={control}
                    name="employment_type"
                    render={({ field }) => (
                      <SelecteInputField
                        id="employment_type"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder="Select Type"
                        options={employmentTypeOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="level"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Experience Level
                  </Label>
                  <Controller
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <SelecteInputField
                        id="level"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder="e.g., Mid-Level"
                        options={levelOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                </div>

                {/* Row 4: Salary Min & Max */}
                <ReusableInput
                  id="salary_min"
                  label="Minimum Salary"
                  placeholder="e.g. $20,000 USD"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  {...register("salary_min")}
                />

                <ReusableInput
                  id="salary_max"
                  label="Maximum Salary"
                  placeholder="e.g. $90,000 USD"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  {...register("salary_max")}
                />

                {/* Row 5: State & City */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="state_id"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    State
                  </Label>
                  <Controller
                    control={control}
                    name="state_id"
                    render={({ field }) => (
                      <SelecteInputField
                        id="state_id"
                        value={field.value || undefined}
                        onChange={(val) => {
                          field.onChange(val);
                          setValue("city_id", "");
                        }}
                        placeholder="Select State"
                        options={stateOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="city_id"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    City
                  </Label>
                  <Controller
                    control={control}
                    name="city_id"
                    render={({ field }) => (
                      <SelecteInputField
                        id="city_id"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder={
                          !selectedStateCode
                            ? "Select a State first"
                            : isCitiesLoading
                              ? "Loading cities..."
                              : "Select City"
                        }
                        disabled={!selectedStateCode || isCitiesLoading}
                        options={cityOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor disabled:opacity-60"
                      />
                    )}
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-between w-full px-6 py-4 border-t border-borderColor/60 bg-white sticky bottom-0 z-10">
          <button
            type="button"
            onClick={handleClear}
            disabled={isClearing || isSaving}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Preferences</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isClearing}
              className="px-4 py-2 text-sm font-medium text-headerColor border border-borderColor rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="job-preference-form"
              disabled={isSaving || isClearing}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </RootDialog>
  );
}
