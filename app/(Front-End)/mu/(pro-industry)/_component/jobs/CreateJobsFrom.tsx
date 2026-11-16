"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import TagInputField from "@/components/reusable/InputFiled/TagInputField";
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
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar as CalendarIcon,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  HelpCircle,
  MapPin,
  Rocket,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import JobPostConfirmation from "./JobPostConfirmation";

interface CreateJobsFromProps {
  onSuccess?: () => void;
  id?: string;
}

const flatCategoryOptions = categoryOptions.flatMap((group) => group.options);

const STEPS = [
  {
    id: 1,
    title: "Basic Info",
    shortTitle: "Basic",
    subtitle: "Title & category",
    icon: Briefcase,
  },
  {
    id: 2,
    title: "Role & Salary",
    shortTitle: "Role",
    subtitle: "Mode, type & salary",
    icon: DollarSign,
  },
  {
    id: 3,
    title: "Location & Contact",
    shortTitle: "Location",
    subtitle: "Address & contacts",
    icon: MapPin,
  },
  {
    id: 4,
    title: "Job Description",
    shortTitle: "Description",
    subtitle: "Details & tags",
    icon: FileText,
  },
  {
    id: 5,
    title: "Schedule & Publish",
    shortTitle: "Publish",
    subtitle: "Timeline & launch",
    icon: Rocket,
  },
] as const;

type StepNumber = 1 | 2 | 3 | 4 | 5;

function CreateJobsFrom({ onSuccess, id }: CreateJobsFromProps) {
  const router = useRouter();
  const formTopRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [activeJobId, setActiveJobId] = useState<string | number | null>(id || null);
  const isInitialLoadedRef = useRef(false);
  const lastLoadedIdRef = useRef<string | undefined>(undefined);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const [isCreated, setIsCreated] = useState(false);
  const [jobId, setJobId] = useState<string | number | null>(null);

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
    trigger,
    clearErrors,
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
    mode: "onTouched",
  });

  const selectedStateId = watch("state_id");
  const selectedStartDate = watch("start_date");
  const selectedEndDate = watch("end_date");
  const selectedSalaryType = watch("salary_type");
  const isSalaryNegotiable = selectedSalaryType?.toLowerCase() === "negotiable";
  const showSalaryRange = Boolean(
    selectedSalaryType &&
      selectedSalaryType.trim() !== "" &&
      !isSalaryNegotiable
  );

  const salaryTypeOptions = [
    { value: "Hourly", label: "Hourly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
    { value: "Negotiable", label: "Negotiable" },
  ];

  useEffect(() => {
    if (!showSalaryRange) {
      clearErrors(["salary_min", "salary_max"]);
    }
  }, [showSalaryRange, clearErrors]);

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

  // Helper to parse numbers safely
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

  // Populate data when editing or resuming (only once on initial fetch)
  useEffect(() => {
    if (lastLoadedIdRef.current !== id) {
      lastLoadedIdRef.current = id;
      isInitialLoadedRef.current = false;
    }

    const job = (jobResponse?.data ?? jobResponse) as any;
    if (!job || !id) return;
    if (isInitialLoadedRef.current) return;
    isInitialLoadedRef.current = true;

    setActiveJobId(id);

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
      state_id: job.state?.id ? String(job.state.id) : (job.state_id ? String(job.state_id) : ""),
      city_id: job.city?.id ? String(job.city.id) : (job.city_id ? String(job.city_id) : ""),
      email: job.email || "",
      phone_number: job.phone_number || "",
      salary_min: job.salary_min != null ? String(job.salary_min) : "",
      salary_max: job.salary_max != null ? String(job.salary_max) : "",
      salary_type: getOptionValue(salaryTypeOptions, job.salary_type),
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

    // Detect resume step if draft (across 5 steps)
    if (job.status === "draft") {
      let step: StepNumber = 1;
      const strippedDesc = (job.job_description || "").replace(/<[^>]*>?/gm, "").trim();
      if (job.information_confirmed || job.announcement_start_date || job.announcement_end_date) {
        step = 5;
      } else if (strippedDesc.length > 20) {
        step = 4;
      } else if (job.state_id || job.email || job.phone_number) {
        step = 3;
      } else if (job.work_mode || job.employment_type || job.salary_type) {
        step = 2;
      }
      setCurrentStep(step);
      setMaxStepReached(5);
    } else {
      setMaxStepReached(5);
    }
  }, [jobResponse, id, reset]);

  const scrollToTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build draft payload from current form state
  const buildPayload = (statusVal: "draft" | "published") => {
    const data = watch();

    const finalStartDate = isScheduledMode && data.start_date
      ? format(data.start_date, "yyyy-MM-dd")
      : (!isScheduledMode && activeJobId && currentJob?.announcement_start_date && !isBefore(startOfDay(new Date()), startOfDay(new Date(`${currentJob.announcement_start_date}T00:00:00`)))
          ? currentJob.announcement_start_date
          : null);

    const finalEndDate = deadlineMode === "deadline" && data.end_date
      ? format(data.end_date, "yyyy-MM-dd")
      : null;

    const payload: Record<string, any> = {
      job_title: data.job_title?.trim() || undefined,
      position: data.position?.trim() || undefined,
      network_type: data.network_type || undefined,
      category: data.category || undefined,
      employment_offering: data.employment_offering || undefined,
      work_mode: data.work_mode || undefined,
      employment_type: data.employment_type || undefined,
      level: data.level || undefined,
      experience: data.experience?.trim() || undefined,
      state_id:
        parseId(data.state_id) ??
        (selectedStateObj?.id ? Number(selectedStateObj.id) : undefined),
      city_id: parseId(data.city_id),
      email: data.email?.trim() || undefined,
      phone_number: data.phone_number?.trim() || undefined,
      salary_min: showSalaryRange ? parseNumber(data.salary_min) : null,
      salary_max: showSalaryRange ? parseNumber(data.salary_max) : null,
      salary_type: data.salary_type || undefined,
      website: data.website?.trim() || undefined,
      job_description: data.job_description || undefined,
      start_date: finalStartDate,
      end_date: finalEndDate,
      tags: data.tags?.trim() || undefined,
      information_confirmed: data.information_confirmed ? 1 : 0,
      status: statusVal,
    };

    return payload;
  };

  // Auto-save draft or explicit "Save as Draft & Exit"
  const handleSaveDraft = async (exitAfterSave: boolean = false) => {
    const currentTitle = watch("job_title");
    if (!currentTitle || !currentTitle.trim()) {
      toast.error("Please enter a Job Title before saving as draft.");
      trigger("job_title");
      return false;
    }

    try {
      setIsDraftSaving(true);
      const payload = buildPayload("draft");

      if (activeJobId) {
        await updateJobs({ id: activeJobId, data: payload }).unwrap();
      } else {
        const res = await createJobs(payload).unwrap();
        const createdId = res?.data?.id;
        if (createdId) {
          setActiveJobId(createdId);
        }
      }

      const nowTime = format(new Date(), "h:mm a");
      setLastSavedTime(nowTime);

      if (exitAfterSave) {
        toast.success("Job position saved as draft successfully!");
        router.push("/mu/job-listing?status=draft");
      } else {
        toast.success(`Draft saved (${nowTime})`, { id: "draft-saved-toast" });
      }
      return true;
    } catch (err: any) {
      console.error("Draft save failed:", err);
      toast.error(err?.data?.message || "Failed to auto-save draft.");
      return false;
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Step 1 Validation
  const validateStep1 = async (): Promise<boolean> => {
    const valid = await trigger([
      "job_title",
      "position",
      "network_type",
      "category",
      "employment_offering",
    ]);
    return valid;
  };

  // Step 2 Validation
  const validateStep2 = async (): Promise<boolean> => {
    const fieldsToValidate: (keyof JobPositionFormData)[] = [
      "work_mode",
      "employment_type",
      "level",
      "experience",
      "salary_type",
    ];

    if (showSalaryRange) {
      fieldsToValidate.push("salary_min", "salary_max");
    }

    const valid = await trigger(fieldsToValidate);

    if (showSalaryRange) {
      const minVal = parseNumber(watch("salary_min"));
      const maxVal = parseNumber(watch("salary_max"));
      if (minVal !== undefined && maxVal !== undefined && minVal > maxVal) {
        toast.error("Maximum salary cannot be less than minimum salary.");
        return false;
      }
    }

    return valid;
  };

  // Step 3 Validation
  const validateStep3 = async (): Promise<boolean> => {
    const valid = await trigger([
      "state_id",
      "city_id",
      "email",
      "phone_number",
    ]);
    return valid;
  };

  // Step 4 Validation (Job Description)
  const validateStep4 = async (): Promise<boolean> => {
    const validForm = await trigger(["job_description"]);

    const desc = watch("job_description") || "";
    const strippedDesc = desc.replace(/<[^>]*>?/gm, "").trim();
    if (!strippedDesc || strippedDesc.length < 20) {
      toast.error("Job description is required (min 20 characters).");
      return false;
    }

    return validForm;
  };

  // Step 5 Validation (Schedule, Deadline & Confirmation)
  const validateStep5 = async (): Promise<boolean> => {
    const confirmed = watch("information_confirmed");
    if (!confirmed) {
      toast.error("Please confirm that all information provided is accurate.");
      return false;
    }

    if (isScheduledMode) {
      const sDate = watch("start_date");
      if (!sDate) {
        toast.error("Please select a start date to schedule this job.");
        return false;
      }
      if (isBefore(startOfDay(sDate), startOfDay(new Date()))) {
        toast.error("The scheduled start date must be today or a future date.");
        return false;
      }
    }

    if (deadlineMode === "deadline") {
      const eDate = watch("end_date");
      const sDate = watch("start_date");
      if (!eDate) {
        toast.error("Please select an application deadline end date.");
        return false;
      }
      if (!id && isBefore(startOfDay(eDate), startOfDay(new Date()))) {
        toast.error("The application end date must be today or a future date.");
        return false;
      }
      if (isScheduledMode && sDate && isBefore(eDate, sDate)) {
        toast.error("Application deadline cannot be earlier than start date.");
        return false;
      }
    }

    return true;
  };

  // Step Next Handler
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const ok = await validateStep1();
      if (!ok) {
        toast.error("Please fill in all required fields in Step 1.");
        return;
      }
      setCurrentStep(2);
      setMaxStepReached((prev) => Math.max(prev, 2));
      scrollToTop();
      handleSaveDraft(false);
    } else if (currentStep === 2) {
      const ok = await validateStep2();
      if (!ok) {
        toast.error("Please fill in all required fields in Step 2.");
        return;
      }
      setCurrentStep(3);
      setMaxStepReached((prev) => Math.max(prev, 3));
      scrollToTop();
      handleSaveDraft(false);
    } else if (currentStep === 3) {
      const ok = await validateStep3();
      if (!ok) {
        toast.error("Please fill in all required fields in Step 3.");
        return;
      }
      setCurrentStep(4);
      setMaxStepReached((prev) => Math.max(prev, 4));
      scrollToTop();
      handleSaveDraft(false);
    } else if (currentStep === 4) {
      const ok = await validateStep4();
      if (!ok) {
        toast.error("Please provide a job description (at least 20 characters).");
        return;
      }
      setCurrentStep(5);
      setMaxStepReached((prev) => Math.max(prev, 5));
      scrollToTop();
      handleSaveDraft(false);
    }
  };

  // Step Back Handler
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepNumber);
      scrollToTop();
    }
  };

  // Jump to specific step tab
  const handleStepClick = async (stepId: StepNumber) => {
    if (stepId === currentStep) return;

    // Allow jumping backward freely
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      scrollToTop();
      return;
    }

    // Jumping forward requires validation of preceding step
    if (currentStep === 1 && !(await validateStep1())) return;
    if (currentStep === 2 && !(await validateStep2())) return;
    if (currentStep === 3 && !(await validateStep3())) return;
    if (currentStep === 4 && !(await validateStep4())) return;

    if (stepId <= maxStepReached || id) {
      setCurrentStep(stepId);
      scrollToTop();
    }
  };

  // Final Publish Submission
  const onFinalPublish = async () => {
    // Validate all 5 steps to ensure complete integrity
    const step1Ok = await validateStep1();
    if (!step1Ok) {
      setCurrentStep(1);
      toast.error("Please complete all required fields in Step 1.");
      return;
    }

    const step2Ok = await validateStep2();
    if (!step2Ok) {
      setCurrentStep(2);
      toast.error("Please complete all required fields in Step 2.");
      return;
    }

    const step3Ok = await validateStep3();
    if (!step3Ok) {
      setCurrentStep(3);
      toast.error("Please complete all required fields in Step 3.");
      return;
    }

    const step4Ok = await validateStep4();
    if (!step4Ok) {
      setCurrentStep(4);
      toast.error("Please provide a job description (min 20 characters).");
      return;
    }

    const step5Ok = await validateStep5();
    if (!step5Ok) {
      return;
    }

    try {
      const payload = buildPayload("published");

      if (activeJobId || id) {
        const targetId = activeJobId || id!;
        const response = await updateJobs({ id: targetId, data: payload }).unwrap();
        const updatedStatus = response?.data?.status;

        if (updatedStatus === "expired") {
          toast.success("Job details updated successfully! (Job remains expired because deadline has passed)");
        } else {
          toast.success(response?.message || "Job position published successfully!");
        }

        setJobId(response?.data?.id ?? targetId);
        setIsCreated(true);
      } else {
        const response = await createJobs(payload).unwrap();
        toast.success("Job position posted successfully!");

        setJobId(response?.data?.id);
        setIsCreated(true);
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Error publishing job position:", error);
      const serverErrors = error?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const firstErrorMessage = Object.values(serverErrors).flat()[0] as string;
        toast.error(firstErrorMessage || "Validation error occurred.");
      } else {
        toast.error(
          error?.data?.message ||
            "Failed to publish job position. Please review all fields and try again.",
        );
      }
    }
  };

  const progressPercent = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div ref={formTopRef} className="w-full max-w-4xl mx-auto py-4">
      <div className="bg-white rounded-2xl border border-borderColor p-5 sm:p-7 md:p-9 shadow-xs">
        {/* Header - Cleaned up without the top-right button */}
        <div className="mb-6 border-b border-borderColor/60 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-headerColor">
                  {id ? "Update Job Position" : "Create New Job Position"}
                </h1>
                {currentJobStatus === "draft" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-descriptionColor mt-1">
                Complete the 5 simple steps below to publish a professional job
                opportunity and reach qualified candidates.
              </p>
            </div>

            {/* Subtle auto-save indicator */}
            {lastSavedTime && (
              <div className="self-start sm:self-center shrink-0">
                <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Draft saved at {lastSavedTime}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Expired Job Notice */}
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
                    This job had a deadline that has passed. You can update any job information below. To reactivate & publish this position, set the <strong>End Date</strong> in Step 5 to a future date.
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

        {/* Step Indicators - Matching MindUnite Boosting Plan style */}
        <div className="bg-white rounded-xl border border-borderColor p-3.5 sm:p-4 mb-6 shadow-2xs">
          <div className="flex items-center justify-between w-full mx-auto">
            {STEPS.map((step, idx) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const isPassed = step.id <= currentStep;
              const isAccessible = step.id <= maxStepReached || Boolean(id);

              return (
                <Fragment key={step.id}>
                  {/* Step Item */}
                  <button
                    type="button"
                    disabled={!isAccessible}
                    onClick={() => handleStepClick(step.id as StepNumber)}
                    className={cn(
                      "flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left transition-all",
                      isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                        isPassed
                          ? "bg-primaryColor text-white shadow-xs"
                          : "bg-slate-100 text-grayColor1"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs md:text-sm font-semibold whitespace-nowrap transition-colors",
                        isPassed ? "text-primaryColor" : "text-grayColor1"
                      )}
                    >
                      <span className="hidden lg:inline">{step.title}</span>
                      <span className="inline lg:hidden">{step.shortTitle || step.title}</span>
                    </span>
                  </button>

                  {/* Connecting Line between steps */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-1.5 sm:mx-2.5 md:mx-3 transition-colors self-start mt-3.5 sm:self-center sm:mt-0",
                        step.id < currentStep ? "bg-primaryColor" : "bg-borderColor"
                      )}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* Multi-Step Content Area */}
        <form onSubmit={handleSubmit(onFinalPublish)} className="space-y-6">
          {/* ================= STEP 1: Basic Information ================= */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-headerColor flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#009dae]" /> Step 1: Basic Information & Classification
                </h3>
                <p className="text-xs text-descriptionColor mt-0.5">
                  Provide primary details about this position and classify it into the correct domain.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Job Title */}
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

                {/* Position / Role */}
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

                {/* Network */}
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

                {/* Category */}
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

                {/* Employment Offerings */}
                <div className="space-y-1.5 md:col-span-2">
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
              </div>
            </div>
          )}

          {/* ================= STEP 2: Role Details & Compensation ================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-headerColor flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#009dae]" /> Step 2: Role Details & Compensation
                </h3>
                <p className="text-xs text-descriptionColor mt-0.5">
                  Define work arrangement, experience level, and salary structure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Work Mode */}
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

                {/* Employment Type */}
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

                {/* Level */}
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

                {/* Experience */}
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

                {/* Salary Type */}
                <div className={cn("space-y-1.5", !showSalaryRange && "md:col-span-2")}>
                  <Label
                    htmlFor="salary_type"
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
                        options={salaryTypeOptions}
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

                {/* Salary Range Min & Max (Visible only when Hourly/Monthly/Yearly) */}
                {showSalaryRange && (
                  <>
                    <ReusableInput
                      id="salary_min"
                      label="Salary Range min"
                      required
                      placeholder="e.g. $20,000 USD"
                      className="rounded-lg border-borderColor text-sm text-headerColor"
                      error={errors.salary_min?.message}
                      {...register("salary_min", {
                        required: showSalaryRange
                          ? "Minimum salary range is required"
                          : false,
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
                        required: showSalaryRange
                          ? "Maximum salary range is required"
                          : false,
                      })}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 3: Location & Contact Details ================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-headerColor flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#009dae]" /> Step 3: Location & Contact Details
                </h3>
                <p className="text-xs text-descriptionColor mt-0.5">
                  Specify physical job location and applicant contact channels.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* State */}
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

                {/* City */}
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

                {/* Email Address */}
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

                {/* Phone Number */}
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

                {/* Website */}
                <div className="md:col-span-2">
                  <ReusableInput
                    id="website"
                    label="Website"
                    placeholder="e.g., www.companywebsite.com"
                    className="rounded-lg border-borderColor text-sm text-headerColor"
                    error={errors.website?.message}
                    {...register("website")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: Job Description & Tags ================= */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-headerColor flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#009dae]" /> Step 4: Job Description & Requirements
                </h3>
                <p className="text-xs text-descriptionColor mt-0.5">
                  Describe key responsibilities, requirements, qualifications, and perks. Drag the bottom-right corner to expand the editor.
                </p>
              </div>

              <div className="space-y-4">
                {/* Job Description (Full width & Resizable) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="job_description"
                      className="text-sm text-descriptionColor font-medium"
                    >
                      Job Description <span className="text-redColor">*</span>
                    </Label>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> Drag bottom handle to expand
                    </span>
                  </div>

                  <Controller
                    control={control}
                    name="job_description"
                    render={({ field }) => (
                      <JoditEditor
                        value={field.value || ""}
                        placeholder="Describe the role, responsibilities, requirements, qualifications, and benefits..."
                        onChange={(content) => field.onChange(content)}
                        onBlur={() => field.onBlur()}
                        height={320}
                        minHeight={220}
                        allowResizeY={true}
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
                  <p className="text-[11px] text-gray-400">
                    💡 Minimum 20 characters required. Use rich formatting, bullet points, and headers to make your posting appealing.
                  </p>
                </div>

                {/* Add Tags with Interactive Badges */}
                <div>
                  <Controller
                    control={control}
                    name="tags"
                    render={({ field }) => (
                      <TagInputField
                        id="tags"
                        label="Job Tags & Keywords"
                        placeholder="Type tag (e.g. Clinical Psychologist) and press Enter..."
                        value={field.value || ""}
                        onChange={field.onChange}
                        error={errors.tags?.message}
                        helperText="Type a keyword and press Enter or comma (,) to add tags. Click the ✕ to remove."
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: Schedule & Final Publish ================= */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-headerColor flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-[#009dae]" /> Step 5: Posting Schedule & Final Publish
                </h3>
                <p className="text-xs text-descriptionColor mt-0.5">
                  Configure when this job goes live, set application deadlines, and confirm before publishing.
                </p>
              </div>

              <div className="space-y-5">
                {/* Posting Schedule & Application Deadline */}
                <div className="rounded-xl border border-borderColor bg-gray-50/60 p-4 sm:p-5 space-y-4">
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

                  {/* Quick Extension Presets */}
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

                  {/* Dynamic Date Inputs */}
                  {(isScheduledMode || deadlineMode === "deadline") ? (
                    <div
                      className={cn(
                        "grid gap-4 pt-1",
                        isScheduledMode && deadlineMode === "deadline"
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1"
                      )}
                    >
                      {/* Start Date */}
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

                      {/* End Date */}
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
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Immediate & Open-Ended: This job will go live immediately upon publishing and stay active until you manually pause or close it.
                      </span>
                    </div>
                  )}
                </div>

                {/* Review Before Publishing */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-semibold text-headerColor">
                    Review Before Publishing
                  </h3>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50">
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
                      className="text-xs md:text-sm text-gray-700 leading-snug cursor-pointer select-none"
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
              </div>
            </div>
          )}

          {/* Stepper Navigation Actions */}
          <div className="pt-6 border-t border-borderColor/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Back Button */}
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting || isDraftSaving || isCreating || isUpdating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Step {currentStep - 1}
                </button>
              ) : (
                <div className="text-xs text-gray-400 hidden sm:block">
                  Step 1 of 5 • Basic Info
                </div>
              )}
            </div>

            {/* Next / Draft / Publish Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Save Draft Button - Cleanly positioned here in footer */}
              <button
                type="button"
                onClick={() => handleSaveDraft(true)}
                disabled={isSubmitting || isDraftSaving || isCreating || isUpdating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-gray-500" />
                <span>Save Draft & Exit</span>
              </button>

              {/* Next Step or Publish */}
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting || isDraftSaving || isCreating || isUpdating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#009dae] hover:bg-[#008999] text-white text-sm font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {currentStep === 1
                      ? "Next: Role & Salary"
                      : currentStep === 2
                        ? "Next: Location & Contact"
                        : currentStep === 3
                          ? "Next: Job Description"
                          : "Next: Schedule & Publish"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <ButtonReuseable
                  type="submit"
                  disabled={isSubmitting || isCreating || isUpdating || isDraftSaving}
                  title={id ? "Update & Publish Position" : "Publish Position"}
                  sendingMsg={id ? "Updating Position..." : "Publishing Position..."}
                />
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
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
