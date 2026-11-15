"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCreateJobsMutation,
  useGetJobDetailsQuery,
  useGetStateByCityQuery,
  useUpdateJobsMutation,
} from "@/feature/slice/jobs/jobSlice";
import { useGetAllStatesQuery } from "@/feature/slice/settingSlice";
import { JobPositionFormData } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  categoryOptions,
  employmentOfferingOptions,
  employmentTypeOptions,
  levelOptions,
  locationTypeOptions,
  networkOptions,
} from "@/public/demoData/RealData";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, CalendarClock, Clock, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import JobPostConfirmation from "./JobPostConfirmation";

interface CreateJobsFromProps {
  onSuccess?: () => void;
  id?: string;
}

const flatCategoryOptions = categoryOptions.flatMap((group) => group.options);

function CreateJobsFrom({ onSuccess, id }: CreateJobsFromProps) {
  const router = useRouter();
  const [isCreated, setIsCreated] = useState(false);
  const [createJobs, { isLoading: isCreating }] = useCreateJobsMutation();
  const [updateJobs, { isLoading: isUpdating }] = useUpdateJobsMutation();
  const { data: jobResponse } = useGetJobDetailsQuery(id, { skip: !id });
  const currentJob = (jobResponse?.data ?? jobResponse) as any;
  const currentJobStatus = currentJob?.status;
  const { data: statesData, isLoading: isStateLoading } =
    useGetAllStatesQuery(undefined);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [isScheduledMode, setIsScheduledMode] = useState(false);
  const [deadlineMode, setDeadlineMode] = useState<"open" | "deadline">("open");
  const [jobId, setJobId] = useState<string | number | null>(null);
  const stateOptions = (statesData?.data || []).map((s: any) => ({
    value: String(s.id),
    label: s.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobPositionFormData>({
    defaultValues: {
      job_title: "",
      position: "",
      network_type: "",
      category: "",
      employment_offering: "",
      work_mode: "",
      employment_type: "",
      level: "",
      experience: "",
      state_id: "",
      city_id: "",
      email: "",
      phone_number: "",
      salary_min: "",
      salary_max: "",
      salary_type: "",
      website: "",
      job_description: "",
      tags: "",
      information_confirmed: false,
    },
  });

  const selectedStateId = watch("state_id");
  const selectedStartDate = watch("start_date");
  const selectedEndDate = watch("end_date");

  // Find the selected state's code from statesData
  const selectedStateObj = (statesData?.data || []).find(
    (s: any) =>
      String(s.id) === String(selectedStateId) ||
      s.name === selectedStateId ||
      s.code === selectedStateId,
  );
  const selectedStateCode = selectedStateObj?.code;

  const { data: citiesData, isLoading: isCitiesLoading } =
    useGetStateByCityQuery(selectedStateCode, {
      skip: !selectedStateCode,
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

  const getOptionValue = (
    options: { value: string; label: string }[],
    value: unknown,
  ) => {
    if (!value) return "";
    const normalized = String(value).trim().toLowerCase();
    return (
      options.find(
        (option) =>
          option.value.trim().toLowerCase() === normalized ||
          option.label.trim().toLowerCase() === normalized,
      )?.value || String(value)
    );
  };

  useEffect(() => {
    const job = (jobResponse?.data ?? jobResponse) as any;
    if (!job || !id) return;

    const hasFutureStartDate = Boolean(
      job.announcement_start_date &&
      isBefore(startOfDay(new Date()), startOfDay(new Date(`${job.announcement_start_date}T00:00:00`)))
    );
    setIsScheduledMode(hasFutureStartDate);

    const hasEndDate = Boolean(job.announcement_end_date);
    setDeadlineMode(hasEndDate ? "deadline" : "open");

    reset({
      job_title: job.job_title || "",
      position: job.position || "",
      network_type: getOptionValue(networkOptions, job.network_type),
      category: getOptionValue(flatCategoryOptions, job.category),
      employment_offering: getOptionValue(
        employmentOfferingOptions,
        job.employment_offering,
      ),
      work_mode: getOptionValue(locationTypeOptions, job.work_mode),
      employment_type: getOptionValue(
        employmentTypeOptions,
        job.employment_type,
      ),
      level: getOptionValue(levelOptions, job.level),
      experience: job.experience || "",
      state_id: job.state?.id ? String(job.state.id) : "",
      city_id: job.city?.id ? String(job.city.id) : "",
      email: job.email || "",
      phone_number: job.phone_number || "",
      salary_min: job.salary_min || "",
      salary_max: job.salary_max || "",
      salary_type: job.salary_type || "",
      website: job.website || "",
      job_description: job.job_description || "",
      start_date: job.announcement_start_date
        ? new Date(`${job.announcement_start_date}T00:00:00`)
        : undefined,
      end_date: job.announcement_end_date
        ? new Date(`${job.announcement_end_date}T00:00:00`)
        : undefined,
      tags: Array.isArray(job.tags) ? job.tags.join(", ") : job.tags || "",
      information_confirmed: Boolean(job.information_confirmed),
    });
  }, [jobResponse, id, reset]);

  const onSubmit = async (data: JobPositionFormData) => {
    try {
      const parseNumber = (val: any) => {
        if (val === undefined || val === null || val === "") return undefined;
        if (typeof val === "number") return val;
        const cleaned = String(val).replace(/[^0-9.]/g, "");
        return cleaned !== "" ? Number(cleaned) : undefined;
      };

      const parseId = (val: any) => {
        if (val === undefined || val === null || val === "") return undefined;
        const num = Number(val);
        return isNaN(num) ? val : num;
      };

      if (isScheduledMode) {
        if (!data.start_date) {
          toast.error("Please select a start date to schedule this job.");
          return;
        }
        const today = startOfDay(new Date());
        if (isBefore(startOfDay(data.start_date), today)) {
          toast.error("The scheduled start date must be today or a future date.");
          return;
        }
      }

      if (deadlineMode === "deadline") {
        if (!data.end_date) {
          toast.error("Please select an application deadline end date.");
          return;
        }
        const today = startOfDay(new Date());
        if (!id && isBefore(startOfDay(data.end_date), today)) {
          toast.error("The application end date must be today or a future date to post a new job.");
          return;
        }
        if (isScheduledMode && data.start_date && isBefore(data.end_date, data.start_date)) {
          toast.error("The application deadline cannot be earlier than the start date.");
          return;
        }
      }

      const finalStartDate = isScheduledMode && data.start_date
        ? format(data.start_date, "yyyy-MM-dd")
        : (!isScheduledMode && id && currentJob?.announcement_start_date && !isBefore(startOfDay(new Date()), startOfDay(new Date(`${currentJob.announcement_start_date}T00:00:00`)))
            ? currentJob.announcement_start_date
            : null);

      const finalEndDate = deadlineMode === "deadline" && data.end_date
        ? format(data.end_date, "yyyy-MM-dd")
        : null;

      const payload = {
        job_title: data.job_title,
        position: data.position,
        network_type: data.network_type,
        category: data.category,
        employment_offering: data.employment_offering,
        work_mode: data.work_mode,
        employment_type: data.employment_type,
        level: data.level,
        experience: data.experience,
        state_id:
          parseId(data.state_id) ??
          (selectedStateObj?.id ? Number(selectedStateObj.id) : undefined),
        city_id: parseId(data.city_id),
        email: data.email,
        phone_number: data.phone_number,
        salary_min: parseNumber(data.salary_min),
        salary_max: parseNumber(data.salary_max),
        salary_type: data.salary_type,
        website: data.website || undefined,
        job_description: data.job_description,
        start_date: finalStartDate,
        end_date: finalEndDate,
        tags: data.tags || undefined,
        information_confirmed: data.information_confirmed ? 1 : 0,
      };

      if (id) {
        const response = await updateJobs({ id, data: payload }).unwrap();
        const updatedStatus = response?.data?.status;

        if (updatedStatus === "expired") {
          toast.success("Job details updated successfully! (Job remains expired because deadline has passed)");
        } else {
          toast.success(response?.message || "Job position updated successfully!");
        }

        setJobId(response.data?.id);
        setIsCreated(true);
      } else {
        const response = await createJobs(payload).unwrap();
        toast.success("Job position posted successfully!");

        setJobId(response.data?.id);
        setIsCreated(true);
      }
      reset();
      setIsScheduledMode(false);
      setDeadlineMode("open");
    } catch (error: any) {
      console.error("Error creating job position:", error);
      const serverErrors = error?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const firstErrorMessage = Object.values(
          serverErrors,
        ).flat()[0] as string;
        toast.error(firstErrorMessage || "Validation error occurred.");
      } else {
        toast.error(
          error?.data?.message ||
            "Failed to create job position. Please try again.",
        );
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="bg-white rounded-2xl border border-borderColor p-6 sm:p-8 md:p-10 shadow-xs">
        {/* Header */}
        <div className="mb-6 md:mb-8 border-b border-borderColor/60 pb-5">
          <h1 className="text-xl md:text-2xl font-bold text-headerColor">
            {id ? "Update position" : "Create new position"}
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Complete the information below to publish a professional job
            opportunity and connect with qualified candidates.
          </p>
        </div>

        {id && currentJobStatus === "expired" && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
            <CalendarClock className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-900 text-sm">
                This job posting is currently Expired
              </p>
              <p className="text-amber-800 leading-relaxed text-xs">
                {currentJob?.announcement_end_date ? (
                  <>
                    This job had a deadline that has passed. You can update any job information below. To reactivate & publish this position, set the <strong>End Date</strong> to a future date.
                  </>
                ) : (
                  <>
                    This job was marked as expired. You can update its information or reactivate it anytime. Dates are optional.
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="md:grid space-y-4 grid-cols-1 md:grid-cols-2 md:space-y-0 md:gap-6">
          {/* Row 1: Job Title & Position */}
          <ReusableInput
            id="job_title"
            label="Job Title"
            required
            placeholder="e.g., Assistant Professor of Psychology"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.job_title?.message}
            {...register("job_title", {
              required: "Job title is required",
            })}
          />

          <ReusableInput
            id="position"
            label="Position"
            required
            placeholder="e.g., Clinical Psychologist"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.position?.message}
            {...register("position", {
              required: "Position is required",
            })}
          />

          {/* Row 2: Network & Employment Offerings */}
          <div className="space-y-1.5">
            <Label
              htmlFor="network_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Network <span className="text-redColor">*</span>
            </Label>

            <Controller
              control={control}
              name="network_type"
              rules={{ required: "Network is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`network-${field.value || "empty"}`}
                  id="network_type"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Network"
                  options={networkOptions}
                  className="h-12! md:h-13! rounded-lg bg-white w-full text-sm font-normal text-headerColor"
                  error={errors.network_type?.message}
                />
              )}
            />
            {errors.network_type && (
              <p className="text-redColor text-xs">
                {errors.network_type.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="category"
              className="text-sm text-descriptionColor font-medium"
            >
              Categories <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`category-${field.value || "empty"}`}
                  id="category"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Category"
                  options={categoryOptions}
                  className="h-12! md:h-13! rounded-lg bg-white w-full text-sm font-normal text-headerColor"
                  error={errors.category?.message}
                />
              )}
            />
            {errors.category && (
              <p className="text-redColor text-xs">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="employment_offering"
              className="text-sm text-descriptionColor font-medium"
            >
              Employment Offerings <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="employment_offering"
              rules={{ required: "Employment offering is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`employment_offering-${field.value || "empty"}`}
                  id="employment_offering"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Employment"
                  options={employmentOfferingOptions}
                  className="h-12! md:h-13! rounded-lg bg-white w-full text-sm font-normal text-headerColor"
                  error={errors.employment_offering?.message}
                />
              )}
            />
            {errors.employment_offering && (
              <p className="text-redColor text-xs">
                {errors.employment_offering.message}
              </p>
            )}
          </div>

          {/* Row 3: Work mode & Employment Type */}
          <div className="space-y-1.5">
            <Label
              htmlFor="work_mode"
              className="text-sm text-descriptionColor font-medium"
            >
              Work mode <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="work_mode"
              rules={{ required: "Work mode is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`work_mode-${field.value || "empty"}`}
                  id="work_mode"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select work mode"
                  options={locationTypeOptions}
                  className="h-12! md:h-13! rounded-lg bg-white w-full text-sm font-normal text-headerColor"
                  error={errors.work_mode?.message}
                />
              )}
            />
            {errors.work_mode && (
              <p className="text-redColor text-xs">
                {errors.work_mode.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="employment_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Employment Type <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="employment_type"
              rules={{ required: "Employment type is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`employment_type-${field.value || "empty"}`}
                  id="employment_type"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select Type"
                  options={employmentTypeOptions}
                  className="h-12! md:h-13! rounded-lg bg-white w-full text-sm font-normal text-headerColor"
                  error={errors.employment_type?.message}
                />
              )}
            />
            {errors.employment_type && (
              <p className="text-redColor text-xs">
                {errors.employment_type.message}
              </p>
            )}
          </div>

          {/* Row 4: Level & Experience */}
          <div className="space-y-1.5">
            <Label
              htmlFor="level"
              className="text-sm text-descriptionColor font-medium"
            >
              Level <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="level"
              rules={{ required: "Level is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`level-${field.value || "empty"}`}
                  id="level"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="e.g., Mid-Level"
                  options={levelOptions}
                  className="h-12! md:h-13! rounded-lg bg-white w-full text-sm font-normal text-headerColor"
                  error={errors.level?.message}
                />
              )}
            />
            {errors.level && (
              <p className="text-redColor text-xs">{errors.level.message}</p>
            )}
          </div>
          <ReusableInput
            id="experience"
            label="Experience"
            required
            placeholder="e.g., 1 year"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.experience?.message}
            {...register("experience", {
              required: "Experience is required",
            })}
          />
          <div className="space-y-1.5">
            <Label
              htmlFor="network_type"
              className="text-sm text-descriptionColor font-medium"
            >
              Salary Type <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="salary_type"
              rules={{ required: "Salary type is required" }}
              render={({ field }) => (
                <SelecteInputField
                  key={`salary_type-${field.value || "empty"}`}
                  id="salary_type"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Select salary type"
                  options={[
                    { value: "Hourly", label: "Hourly" },
                    { value: "Monthly", label: "Monthly" },
                    { value: "Yearly", label: "Yearly" },
                  ]}
                  className="h-12! md:h-13! rounded-lg bg-white w-full text-sm font-normal text-headerColor"
                  error={errors.salary_type?.message}
                />
              )}
            />
            {errors.salary_type && (
              <p className="text-redColor text-xs">
                {errors.salary_type.message}
              </p>
            )}
          </div>
          {/* Row 7: Salary Range min & Salary Range Max */}
          <ReusableInput
            id="salary_min"
            label="Salary Range min"
            required
            placeholder="e.g. $20,000 USD"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.salary_min?.message}
            {...register("salary_min", {
              required: "Minimum salary range is required",
            })}
          />

          <ReusableInput
            id="salary_max"
            label="Salary Range Max"
            required
            placeholder="e.g. $90,000 USD"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.salary_max?.message}
            {...register("salary_max", {
              required: "Maximum salary range is required",
            })}
          />

          {/* Row 5: State & City */}
          <div className="space-y-1.5">
            <Label
              htmlFor="state_id"
              className="text-sm text-descriptionColor font-medium"
            >
              State <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="state_id"
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  value={field.value || undefined}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("city_id", "");
                  }}
                  options={stateOptions}
                  placeholder={
                    isStateLoading ? "Loading states..." : "Select State"
                  }
                  isDisabled={isStateLoading}
                  className="w-full text-sm"
                  error={errors.state_id?.message}
                />
              )}
            />
            {errors.state_id && (
              <p className="text-redColor text-xs">{errors.state_id.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="city_id"
              className="text-sm text-descriptionColor font-medium"
            >
              City <span className="text-redColor">*</span>
            </Label>
            <Controller
              control={control}
              name="city_id"
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  key={`city-select-${selectedStateCode || "none"}`}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={cityOptions}
                  placeholder={
                    !selectedStateId
                      ? "Select State first"
                      : isCitiesLoading
                        ? "Loading cities..."
                        : "Select City"
                  }
                  isDisabled={!selectedStateId || isCitiesLoading}
                  className="w-full text-sm"
                  error={errors.city_id?.message}
                />
              )}
            />
            {errors.city_id && (
              <p className="text-redColor text-xs">{errors.city_id.message}</p>
            )}
          </div>

          {/* Row 6: Email Address & Phone Number */}
          <ReusableInput
            id="email"
            type="email"
            label="Email Address"
            required
            placeholder="person@email.com"
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.email?.message}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />

          <ReusableInput
            id="phone_number"
            type="tel"
            label="Phone Number"
            required
            placeholder="Enter your phone number."
            className="rounded-lg border-borderColor text-sm text-headerColor"
            error={errors.phone_number?.message}
            {...register("phone_number", {
              required: "Phone number is required",
            })}
          />

          <div className="col-span-2">
            <ReusableInput
              id="website"
              label="Website"
              placeholder="e.g., www.companywebsite.com"
              className="rounded-lg border-borderColor text-sm text-headerColor"
              error={errors.website?.message}
              {...register("website")}
            />
          </div>

          {/* Row 9: Job Description (Full width) */}
          <div className="space-y-1.5 md:col-span-2">
            <Label
              htmlFor="job_description"
              className="text-sm text-descriptionColor font-medium"
            >
              Job Description
            </Label>
            <Controller
              control={control}
              name="job_description"
              render={({ field }) => (
                <JoditEditor
                  value={field.value || ""}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  onChange={(content) => field.onChange(content)}
                  onBlur={() => field.onBlur()}
                  className={cn(
                    Boolean(errors.job_description) &&
                      "[&_.jodit-container]:border-red-500!",
                  )}
                />
              )}
            />
            {errors.job_description && (
              <p className="text-redColor text-xs">
                {errors.job_description.message}
              </p>
            )}
          </div>

          {/* Row 10: Posting Schedule & Application Deadline */}
          <div className="md:col-span-2 rounded-xl border border-borderColor bg-gray-50/60 p-4 sm:p-5 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-headerColor">
                Posting Schedule & Application Deadline
              </h4>
              <p className="text-xs text-descriptionColor mt-0.5">
                Configure whether this job goes live immediately or at a scheduled date, and manage application deadlines.
              </p>
            </div>

            {/* Schedule Option Toggle/Card */}
            <div
              onClick={() => {
                const next = !isScheduledMode;
                setIsScheduledMode(next);
                if (!next) {
                  setValue("start_date", undefined);
                } else if (!selectedStartDate) {
                  setValue("start_date", addDays(new Date(), 1));
                }
              }}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none",
                isScheduledMode
                  ? "border-[#009dae] bg-[#009dae]/5 ring-1 ring-[#009dae]/20"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              )}
            >
              <input
                type="checkbox"
                id="create_job_schedule_mode"
                checked={isScheduledMode}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsScheduledMode(checked);
                  if (!checked) {
                    setValue("start_date", undefined);
                  } else if (!selectedStartDate) {
                    setValue("start_date", addDays(new Date(), 1));
                  }
                }}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#009dae] focus:ring-[#009dae] cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4 text-[#009dae]" />
                  <span className="text-xs font-bold text-headerColor">
                    Schedule for Future Release
                  </span>
                  <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] text-descriptionColor mt-0.5">
                  Specify a future date when this job post will go live. If unchecked, the job goes live immediately upon publishing.
                </p>
              </div>
            </div>

            {/* Deadline Selection */}
            <div>
              <label className="text-xs font-semibold text-headerColor block mb-2">
                Application Deadline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setDeadlineMode("open");
                    setValue("end_date", undefined);
                  }}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none",
                    deadlineMode === "open"
                      ? "border-[#009dae] bg-[#009dae]/5 ring-1 ring-[#009dae]/20"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <input
                    type="radio"
                    name="industry_deadline_mode"
                    checked={deadlineMode === "open"}
                    onChange={() => {
                      setDeadlineMode("open");
                      setValue("end_date", undefined);
                    }}
                    className="mt-0.5 text-[#009dae] focus:ring-[#009dae] cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-headerColor">
                        Open Until Filled
                      </span>
                      <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-descriptionColor mt-0.5">
                      No fixed deadline. Stays active until you manually pause or close it.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setDeadlineMode("deadline");
                    if (!selectedEndDate) {
                      setValue("end_date", addDays(selectedStartDate || new Date(), 30));
                    }
                  }}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none",
                    deadlineMode === "deadline"
                      ? "border-[#009dae] bg-[#009dae]/5 ring-1 ring-[#009dae]/20"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <input
                    type="radio"
                    name="industry_deadline_mode"
                    checked={deadlineMode === "deadline"}
                    onChange={() => {
                      setDeadlineMode("deadline");
                      if (!selectedEndDate) {
                        setValue("end_date", addDays(selectedStartDate || new Date(), 30));
                      }
                    }}
                    className="mt-0.5 text-[#009dae] focus:ring-[#009dae] cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-headerColor">
                      Set Application Deadline
                    </span>
                    <p className="text-[11px] text-descriptionColor mt-0.5">
                      Automatically close applications on a specific closing date.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Extension Presets (visible ONLY if deadline mode is active) */}
            {deadlineMode === "deadline" && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#009dae]" /> Quick Presets:
                </span>
                {[14, 30, 60, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      const base = selectedStartDate || new Date();
                      setValue("end_date", addDays(base, days));
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:border-[#009dae] hover:bg-cyan-50 hover:text-[#009dae] transition cursor-pointer"
                  >
                    +{days} Days
                  </button>
                ))}
              </div>
            )}

            {/* Dynamic Date Inputs: Shown ONLY if isScheduledMode or deadlineMode === "deadline" */}
            {(isScheduledMode || deadlineMode === "deadline") ? (
              <div
                className={cn(
                  "grid gap-4 pt-1",
                  isScheduledMode && deadlineMode === "deadline"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                )}
              >
                {/* Start Date: ONLY SHOWN IF isScheduledMode IS TRUE */}
                {isScheduledMode && (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="start_date"
                      className="text-sm text-descriptionColor font-medium"
                    >
                      Start Date (Scheduled Publish Date)
                    </Label>
                    <Controller
                      control={control}
                      name="start_date"
                      render={({ field }) => (
                        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                          <PopoverTrigger asChild>
                            <button
                              id="start_date"
                              type="button"
                              className={cn(
                                "h-12! md:h-13! w-full px-3.5 border rounded-lg bg-white flex items-center justify-between text-sm hover:bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition-all cursor-pointer",
                                errors.start_date
                                  ? "border-red-500! ring-1 ring-red-500/20!"
                                  : "border-borderColor",
                                field.value
                                  ? "text-headerColor font-normal"
                                  : "text-muted-foreground font-normal",
                              )}
                            >
                              <span className="truncate">
                                {field.value
                                  ? format(field.value, "MMM dd, yyyy")
                                  : "Select Start Date"}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {field.value && (
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      field.onChange(undefined);
                                    }}
                                    title="Clear date"
                                    className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </span>
                                )}
                                <CalendarIcon
                                  className={cn(
                                    "w-4 h-4 shrink-0",
                                    field.value ? "text-headerColor" : "text-muted-foreground",
                                  )}
                                />
                              </div>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-white z-100000 rounded-xl shadow-xl border border-borderColor"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                if (
                                  date &&
                                  selectedEndDate &&
                                  isBefore(selectedEndDate, date)
                                ) {
                                  setValue("end_date", undefined);
                                }
                                setStartDateOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.start_date && (
                      <p className="text-redColor text-xs">
                        {errors.start_date.message}
                      </p>
                    )}
                    {selectedStartDate && isBefore(startOfDay(new Date()), startOfDay(selectedStartDate)) ? (
                      <p className="text-indigo-600 text-xs mt-1 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Scheduled: Position will go live on {format(selectedStartDate, "MMM dd, yyyy")}.
                      </p>
                    ) : (
                      <p className="text-gray-400 text-xs mt-1">
                        Select a future date when this job post will go live.
                      </p>
                    )}
                  </div>
                )}

                {/* End Date: ONLY SHOWN IF deadlineMode === "deadline" */}
                {deadlineMode === "deadline" && (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="end_date"
                      className="text-sm text-descriptionColor font-medium"
                    >
                      End Date (Application Deadline)
                    </Label>
                    <Controller
                      control={control}
                      name="end_date"
                      render={({ field }) => (
                        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                          <PopoverTrigger asChild>
                            <button
                              id="end_date"
                              type="button"
                              className={cn(
                                "h-12! md:h-13! w-full px-3.5 border rounded-lg bg-white flex items-center justify-between text-sm hover:bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition-all cursor-pointer",
                                errors.end_date
                                  ? "border-red-500! ring-1 ring-red-500/20!"
                                  : "border-borderColor",
                                field.value
                                  ? "text-headerColor font-normal"
                                  : "text-muted-foreground font-normal",
                              )}
                            >
                              <span className="truncate">
                                {field.value
                                  ? format(field.value, "MMM dd, yyyy")
                                  : "Select Application Deadline"}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {field.value && (
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      field.onChange(undefined);
                                    }}
                                    title="Clear date"
                                    className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </span>
                                )}
                                <CalendarIcon
                                  className={cn(
                                    "w-4 h-4 shrink-0",
                                    field.value ? "text-headerColor" : "text-muted-foreground",
                                  )}
                                />
                              </div>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-white z-100000 rounded-xl shadow-xl border border-borderColor"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              disabled={
                                selectedStartDate
                                  ? { before: selectedStartDate }
                                  : undefined
                              }
                              onSelect={(date) => {
                                field.onChange(date);
                                setEndDateOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.end_date && (
                      <p className="text-redColor text-xs">{errors.end_date.message}</p>
                    )}
                    {selectedEndDate ? (
                      <p
                        className={cn(
                          "text-xs mt-1 font-medium",
                          isBefore(startOfDay(selectedEndDate), startOfDay(new Date()))
                            ? "text-amber-600"
                            : "text-emerald-600"
                        )}
                      >
                        {isBefore(startOfDay(selectedEndDate), startOfDay(new Date()))
                          ? "Deadline is in the past. Job info will update, but post will remain expired."
                          : `Applications will automatically close on ${format(selectedEndDate, "MMM dd, yyyy")}.`}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-xs mt-1">
                        Select a date when applications will automatically close.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* When NEITHER is selected/checked: Clean default status message */
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Immediate & Open-Ended: This job will go live immediately upon publishing and stay active until you manually pause or close it.
                </span>
              </div>
            )}
          </div>

          {/* Row 11: Add Tags (Full width) */}
          <div className="md:col-span-2">
            <ReusableInput
              id="tags"
              label="Add Tags"
              placeholder="e.g., Clinical Psychologist, Research Assistant, Professor of Psychology"
              className="rounded-lg border-borderColor text-sm text-headerColor"
              error={errors.tags?.message}
              {...register("tags")}
            />
          </div>

          {/* Row 12: Review Before Publishing */}
          <div className="space-y-2 pt-2 md:col-span-2">
            <h3 className="text-sm font-semibold text-headerColor">
              Review Before Publishing
            </h3>
            <div className="flex items-start gap-3">
              <Controller
                control={control}
                name="information_confirmed"
                rules={{
                  required:
                    "You must confirm that all information provided is accurate",
                }}
                render={({ field }) => (
                  <Checkbox
                    id="information_confirmed"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={cn(
                      "mt-0.5 border data-[state=checked]:bg-primaryColor data-[state=checked]:text-white data-[state=checked]:border-primaryColor rounded",
                      errors.information_confirmed
                        ? "border-red-500! ring-1 ring-red-500/20!"
                        : "border-primaryColor",
                    )}
                  />
                )}
              />
              <label
                htmlFor="information_confirmed"
                className="text-xs md:text-sm text-gray-600 leading-snug cursor-pointer select-none"
              >
                I confirm that all information provided is accurate and that I
                am authorized to publish this position on behalf of my
                organization.
              </label>
            </div>
            {errors.information_confirmed && (
              <p className="text-redColor text-xs">
                {errors.information_confirmed.message}
              </p>
            )}
          </div>

          {/* Row 13: Submit Button */}
          <div className="flex justify-center pt-4 pb-2 md:col-span-2">
            <ButtonReuseable
              type="submit"
              disabled={isSubmitting || isCreating || isUpdating}
              title={id ? "Update this Position" : "Post this Position"}
              sendingMsg={id ? "Updating Position..." : "Posting Position..."}
            />
          </div>
        </div>
      </form>
      </div>
      {isCreated && (
        <JobPostConfirmation
          open={isCreated}
          title={id ? " Updated" : " created"}
          setOpen={setIsCreated}
          jobId={jobId}
        />
      )}
    </div>
  );
}

export default CreateJobsFrom;
