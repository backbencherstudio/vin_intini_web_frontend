"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarClock,
  Check,
  Clock,
  DollarSign,
  FileText,
  HelpCircle,
  MapPin,
  Pencil,
  Rocket,
  Save,
  Search,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect, {
  type SelectOption,
} from "@/components/reusable/dashboard/CustomSelect";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import TagInputField from "@/components/reusable/InputFiled/TagInputField";
import AdminDateField from "./AdminDateField";
import { isValidWebUrl } from "./jobHelpers";
import {
  useGetVerifiedJobIndustriesQuery,
  useUpdateAdminJobMutation,
  type AdminJobItem,
  type UpdateAdminJobPayload,
} from "@/feature/slice/admin/jobs";
import { useGetAllStatesQuery } from "@/feature/slice/settingSlice";
import { useGetStateByCityQuery } from "@/feature/slice/jobs/jobSlice";
import {
  categoryOptions,
  employmentOfferingOptions,
  employmentTypeOptions,
  levelOptions,
  locationTypeOptions,
  networkOptions,
} from "@/public/demoData/RealData";

interface AdminEditJobModalProps {
  job: AdminJobItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS: SelectOption[] = categoryOptions.map((c) => ({
  label: c.group,
  value: c.group,
}));

const NETWORK_OPTIONS: SelectOption[] = networkOptions.map((n) => ({
  label: n.label,
  value: n.value,
}));

const EMPLOYMENT_OFFERING_OPTIONS: SelectOption[] = employmentOfferingOptions.map((e) => ({
  label: e.label,
  value: e.value,
}));

const WORK_MODE_OPTIONS: SelectOption[] = locationTypeOptions.map((w) => ({
  label: w.label,
  value: w.value,
}));

const EMPLOYMENT_TYPE_OPTIONS: SelectOption[] = employmentTypeOptions.map((e) => ({
  label: e.label,
  value: e.value,
}));

const LEVEL_OPTIONS: SelectOption[] = levelOptions.map((l) => ({
  label: l.label,
  value: l.value,
}));

const SALARY_TYPE_OPTIONS: SelectOption[] = [
  { label: "Yearly", value: "Yearly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Hourly", value: "Hourly" },
  { label: "Negotiable", value: "Negotiable" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { label: "Active (Live)", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Expired", value: "expired" },
  { label: "Archive", value: "archive" },
  { label: "Rejected", value: "rejected" },
];

const ADMIN_STEPS = [
  { id: 1, title: "Company & Basics", shortTitle: "Company", subtitle: "Industry, title & role", icon: Briefcase },
  { id: 2, title: "Role & Salary", shortTitle: "Role", subtitle: "Mode, type & salary", icon: DollarSign },
  { id: 3, title: "Location & Contact", shortTitle: "Location", subtitle: "Address & contacts", icon: MapPin },
  { id: 4, title: "Job Description", shortTitle: "Description", subtitle: "Details & tags", icon: FileText },
  { id: 5, title: "Schedule & Publish", shortTitle: "Publish", subtitle: "Timeline & launch", icon: Rocket },
] as const;

type AdminStepNumber = 1 | 2 | 3 | 4 | 5;

const parseJobDate = (val?: string | null): Date | undefined => {
  if (!val) return undefined;
  try {
    const raw = String(val).split("T")[0];
    const [y, m, d] = raw.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  } catch {
    return undefined;
  }
};

const formatInitialTags = (tagsVal?: string[] | string | null): string => {
  if (!tagsVal) return "";
  if (Array.isArray(tagsVal)) return tagsVal.join(", ");
  try {
    const parsed = JSON.parse(tagsVal);
    if (Array.isArray(parsed)) return parsed.join(", ");
  } catch {
    // ignore
  }
  return String(tagsVal);
};

interface AdminEditJobFormProps {
  job: AdminJobItem;
  onClose: () => void;
  onSuccess?: () => void;
}

function AdminEditJobForm({ job, onClose, onSuccess }: AdminEditJobFormProps) {
  const [updateAdminJob, { isLoading: isUpdating }] = useUpdateAdminJobMutation();

  const { data: industriesData, isLoading: isLoadingIndustries } =
    useGetVerifiedJobIndustriesQuery();

  const { data: statesData, isLoading: isStateLoading } =
    useGetAllStatesQuery(undefined, { refetchOnMountOrArgChange: true });

  const industries = useMemo(
    () => industriesData?.data ?? [],
    [industriesData?.data]
  );

  // Stepper state
  const [currentStep, setCurrentStep] = useState<AdminStepNumber>(1);

  // Form states initialized directly from target job
  const [industrySearch, setIndustrySearch] = useState("");
  const [isChangingIndustry, setIsChangingIndustry] = useState(false);
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | null>(
    job.industry_id ?? null
  );

  const [networkType, setNetworkType] = useState<string>(job.network_type || "psychology");
  const [status, setStatus] = useState<string>(job.status || "published");
  const [jobTitle, setJobTitle] = useState(job.job_title || "");
  const [position, setPosition] = useState(job.position || "");
  const [category, setCategory] = useState(job.category || "");
  const [subCategory, setSubCategory] = useState(job.sub_category || "");
  const [employmentOffering, setEmploymentOffering] = useState<string>(
    job.employment_offering || "state_institutions"
  );
  const [workMode, setWorkMode] = useState<string>(
    job.work_mode === "onsite" ? "on_site" : (job.work_mode || "remote")
  );
  const [employmentType, setEmploymentType] = useState<string>(
    job.employment_type || "full_time"
  );
  const [level, setLevel] = useState<string>(job.level || "Mid-Level");
  const [experience, setExperience] = useState(job.experience || "");

  const [selectedStateId, setSelectedStateId] = useState<string>(
    job.state_id ? String(job.state_id) : ""
  );
  const [selectedCityId, setSelectedCityId] = useState<string>(
    job.city_id ? String(job.city_id) : ""
  );

  const initialHasFutureStartDate = Boolean(
    job.announcement_start_date &&
    isBefore(startOfDay(new Date()), startOfDay(new Date(job.announcement_start_date.includes("T") ? job.announcement_start_date : `${job.announcement_start_date}T00:00:00`)))
  );
  const [isScheduledMode, setIsScheduledMode] = useState<boolean>(initialHasFutureStartDate);
  const [deadlineMode, setDeadlineMode] = useState<"open" | "deadline">(
    job.announcement_end_date ? "deadline" : "open"
  );

  const [startDate, setStartDate] = useState<Date | undefined>(
    parseJobDate(job.announcement_start_date)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    parseJobDate(job.announcement_end_date)
  );

  useEffect(() => {
    if (job) {
      const hasFuture = Boolean(
        job.announcement_start_date &&
        isBefore(startOfDay(new Date()), startOfDay(new Date(job.announcement_start_date.includes("T") ? job.announcement_start_date : `${job.announcement_start_date}T00:00:00`)))
      );
      setIsScheduledMode(hasFuture);
      setDeadlineMode(job.announcement_end_date ? "deadline" : "open");
      setStartDate(parseJobDate(job.announcement_start_date));
      setEndDate(parseJobDate(job.announcement_end_date));
    }
  }, [job]);

  const [email, setEmail] = useState(job.email || "");
  const [phoneNumber, setPhoneNumber] = useState(job.phone_number || "");
  const [website, setWebsite] = useState(job.website || "");
  const [salaryMin, setSalaryMin] = useState<string>(
    job.salary_min != null ? String(job.salary_min) : ""
  );
  const [salaryMax, setSalaryMax] = useState<string>(
    job.salary_max != null ? String(job.salary_max) : ""
  );
  const [salaryType, setSalaryType] = useState<string>(job.salary_type || "Yearly");
  const [locationUrl, setLocationUrl] = useState(job.location_url || "");
  const [jobDescription, setJobDescription] = useState(job.job_description || "");
  const [tags, setTags] = useState(formatInitialTags(job.tags));

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dynamic Sub-Category options based on selected category
  const subCategoryOptions: SelectOption[] = useMemo(() => {
    if (!category) {
      return categoryOptions.flatMap((c) =>
        c.options.map((opt) => ({
          label: `${opt.label} (${c.group})`,
          value: opt.value,
        }))
      );
    }
    const group = categoryOptions.find((c) => c.group === category);
    return (
      group?.options.map((opt) => ({
        label: opt.label,
        value: opt.value,
      })) || []
    );
  }, [category]);

  const handleCategoryChange = (val: string | number) => {
    const strVal = String(val);
    setCategory(strVal);
    const group = categoryOptions.find((g) => g.group === strVal);
    if (group && !group.options.some((o) => o.value === subCategory)) {
      setSubCategory("");
    }
    if (formErrors.category) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.category;
        return copy;
      });
    }
  };

  const handleSubCategoryChange = (val: string | number) => {
    const strVal = String(val);
    setSubCategory(strVal);
    if (!category) {
      const parent = categoryOptions.find((g) =>
        g.options.some((o) => o.value === strVal)
      );
      if (parent) {
        setCategory(parent.group);
        if (formErrors.category) {
          setFormErrors((prev) => {
            const copy = { ...prev };
            delete copy.category;
            return copy;
          });
        }
      }
    }
  };

  const rawStates: any[] = useMemo(() => {
    if (Array.isArray(statesData?.data)) return statesData.data;
    if (Array.isArray(statesData)) return statesData;
    return [];
  }, [statesData]);

  const selectedStateObj = useMemo(() => {
    return rawStates.find(
      (s: any) =>
        String(s.id) === String(selectedStateId) ||
        s.name === selectedStateId ||
        s.code === selectedStateId
    );
  }, [rawStates, selectedStateId]);
  const selectedStateCode = selectedStateObj?.code;

  const { data: citiesData, isLoading: isCitiesLoading } = useGetStateByCityQuery(
    selectedStateCode,
    { skip: !selectedStateCode, refetchOnMountOrArgChange: true }
  );

  const stateOptions: SelectOption[] = useMemo(() => {
    return rawStates.map((s: any) => ({
      label: s.name,
      value: String(s.id),
    }));
  }, [rawStates]);

  const cityOptions: SelectOption[] = useMemo(() => {
    const rawCities = Array.isArray(citiesData?.data)
      ? citiesData.data
      : Array.isArray(citiesData)
        ? citiesData
        : [];
    return rawCities.map((c: any) => ({
      label: c?.name || c?.city || String(c),
      value: String(c?.id ?? c?.name ?? c),
    }));
  }, [citiesData]);

  const filteredIndustries = useMemo(() => {
    if (!industrySearch.trim()) return industries;
    const q = industrySearch.toLowerCase();
    return industries.filter(
      (ind) =>
        ind.name.toLowerCase().includes(q) ||
        (ind.owner?.full_name && ind.owner.full_name.toLowerCase().includes(q)) ||
        (ind.owner?.email && ind.owner.email.toLowerCase().includes(q))
    );
  }, [industries, industrySearch]);

  const currentPartner = useMemo(() => {
    if (selectedIndustryId) {
      const match = industries.find((i) => i.id === selectedIndustryId);
      if (match) return match;
    }
    return job.industry || null;
  }, [industries, selectedIndustryId, job.industry]);

  // Step Validation Helpers
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!jobTitle.trim()) {
      errors.job_title = "Job title is required.";
    } else if (jobTitle.trim().length > 255) {
      errors.job_title = "Job title cannot exceed 255 characters.";
    }
    if (status !== "draft") {
      if (!position.trim()) {
        errors.position = "Position / Role is required.";
      } else if (position.trim().length > 255) {
        errors.position = "Position / Role cannot exceed 255 characters.";
      }
      if (!category.trim()) {
        errors.category = "Category is required.";
      }
      if (!employmentOffering.trim()) {
        errors.employment_offering = "Employment offering is required.";
      }
    } else if (position.trim().length > 255) {
      errors.position = "Position / Role cannot exceed 255 characters.";
    }
    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (status !== "draft") {
      if (!workMode) {
        errors.work_mode = "Work mode is required.";
      }
      if (!employmentType) {
        errors.employment_type = "Employment type is required.";
      }
    }
    if (salaryType !== "Negotiable") {
      if (salaryMin && (isNaN(Number(salaryMin)) || Number(salaryMin) < 0)) {
        errors.salary_min = "Min salary must be a valid positive number.";
      }
      if (salaryMax && (isNaN(Number(salaryMax)) || Number(salaryMax) < 0)) {
        errors.salary_max = "Max salary must be a valid positive number.";
      }
      if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
        errors.salary_max = "Max salary must be greater than or equal to min salary.";
      }
    }
    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    if (status !== "draft") {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "A valid contact email is required.";
      }
    } else if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (website.trim() && !isValidWebUrl(website)) {
      errors.website = "Please provide a valid website URL (e.g. https://example.com).";
    }
    if (locationUrl.trim() && !isValidWebUrl(locationUrl)) {
      errors.location_url = "Please provide a valid map or location URL.";
    }
    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errors: Record<string, string> = {};
    if (status !== "draft") {
      const strippedDescription = jobDescription.replace(/<[^>]*>?/gm, "").trim();
      if (!strippedDescription || strippedDescription.length < 20) {
        errors.job_description = "Job description is required (min 20 characters).";
      }
    }
    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateStep5 = (): boolean => {
    const errors: Record<string, string> = {};
    if (isScheduledMode) {
      if (!startDate) {
        errors.start_date = "Please select a start date to schedule this job.";
      } else if (isBefore(startOfDay(startDate), startOfDay(new Date()))) {
        errors.start_date = "The scheduled start date must be today or a future date.";
      }
    }

    if (deadlineMode === "deadline") {
      if (!endDate) {
        errors.end_date = "Please select an application deadline end date.";
      } else {
        const today = startOfDay(new Date());
        if (endDate < today) {
          errors.end_date = "The application deadline must be today or a future date.";
        }
        if (isScheduledMode && startDate && isBefore(endDate, startDate)) {
          errors.end_date = "Application deadline cannot be earlier than start date.";
        }
      }
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (status !== "draft") {
      if (currentStep === 1 && !validateStep1()) {
        toast.error("Please fill all required fields in Step 1.");
        return;
      }
      if (currentStep === 2 && !validateStep2()) {
        toast.error("Please fill all required fields in Step 2.");
        return;
      }
      if (currentStep === 3 && !validateStep3()) {
        toast.error("Please fill all required fields in Step 3.");
        return;
      }
      if (currentStep === 4 && !validateStep4()) {
        toast.error("Please provide a job description (min 20 characters).");
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as AdminStepNumber);
    }
  };

  const handleStepJump = (targetStep: AdminStepNumber) => {
    if (targetStep === currentStep) return;
    if (targetStep < currentStep || status === "draft") {
      setCurrentStep(targetStep);
      return;
    }
    // Validate preceding steps before jumping forward when not draft
    if (currentStep === 1 && !validateStep1()) {
      toast.error("Please complete required fields in Step 1 first.");
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      toast.error("Please complete required fields in Step 2 first.");
      return;
    }
    if (currentStep === 3 && !validateStep3()) {
      toast.error("Please complete required fields in Step 3 first.");
      return;
    }
    if (currentStep === 4 && !validateStep4()) {
      toast.error("Please provide a job description in Step 4 first.");
      return;
    }
    setCurrentStep(targetStep);
  };

  const handleSubmit = async (e?: React.FormEvent, overrideStatus?: string) => {
    if (e) e.preventDefault();
    const finalStatus = overrideStatus || status;
    const isDraft = finalStatus === "draft";

    if (isDraft) {
      if (!jobTitle.trim()) {
        setCurrentStep(1);
        toast.error("Please provide at least a job title in Step 1 to save draft.");
        return;
      }
    } else {
      if (!validateStep1()) {
        setCurrentStep(1);
        toast.error("Please complete all required fields in Step 1 (Company & Basics).");
        return;
      }
      if (!validateStep2()) {
        setCurrentStep(2);
        toast.error("Please complete all required fields in Step 2 (Role & Salary).");
        return;
      }
      if (!validateStep3()) {
        setCurrentStep(3);
        toast.error("Please complete all required fields in Step 3 (Location & Contact).");
        return;
      }
      if (!validateStep4()) {
        setCurrentStep(4);
        toast.error("Please provide a job description (min 20 characters) in Step 4.");
        return;
      }
      if (!validateStep5()) {
        setCurrentStep(5);
        toast.error("Please check the schedule settings in Step 5.");
        return;
      }
    }

    try {
      const payload: UpdateAdminJobPayload = {
        id: job.id,
        job_title: jobTitle.trim(),
        position: position.trim() || undefined,
        category: category.trim() || undefined,
        sub_category: subCategory.trim() || undefined,
        network_type: networkType as any,
        employment_offering: employmentOffering || undefined,
        work_mode: workMode || undefined,
        employment_type: employmentType || undefined,
        level: level || undefined,
        experience: experience.trim() || undefined,
        state_id: selectedStateId && !isNaN(Number(selectedStateId)) ? Number(selectedStateId) : undefined,
        city_id: selectedCityId && !isNaN(Number(selectedCityId)) ? Number(selectedCityId) : undefined,
        email: email.trim() || undefined,
        phone_number: phoneNumber.trim() || undefined,
        website: website.trim() || undefined,
        salary_min: (salaryType === "Negotiable" || !salaryMin) ? undefined : Number(salaryMin),
        salary_max: (salaryType === "Negotiable" || !salaryMax) ? undefined : Number(salaryMax),
        salary_type: salaryType || undefined,
        location_url: locationUrl.trim() || undefined,
        job_description: jobDescription.trim() || undefined,
        announcement_start_date: isScheduledMode && startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        announcement_end_date: deadlineMode === "deadline" && endDate ? format(endDate, "yyyy-MM-dd") : undefined,
        tags: tags.trim() ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
        status: finalStatus as any,
      };

      if (selectedIndustryId && selectedIndustryId !== job.industry_id) {
        (payload as any).industry_id = selectedIndustryId;
      }

      await updateAdminJob(payload).unwrap();
      toast.success(
        finalStatus === "draft"
          ? "Job saved as draft successfully."
          : "Job posting updated successfully."
      );
      onClose();
      onSuccess?.();
    } catch (err: any) {
      const serverErrors = err?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const firstErrorMessage = Object.values(serverErrors).flat()[0] as string;
        toast.error(firstErrorMessage || "Validation error occurred.");
      } else {
        const msg = err?.data?.message || err?.message || "Failed to update job posting.";
        toast.error(msg);
      }
    }
  };

  const progressPercent = Math.round((currentStep / ADMIN_STEPS.length) * 100);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[82vh] overflow-y-auto px-1 py-1">
      {/* Industry Partner Info / Switcher Card */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {"logo" in (currentPartner || {}) && (currentPartner as any)?.logo ? (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <Image
                  src={(currentPartner as any).logo}
                  alt={currentPartner?.name || "Logo"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : "logo_url" in (currentPartner || {}) && (currentPartner as any)?.logo_url ? (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <Image
                  src={(currentPartner as any).logo_url}
                  alt={currentPartner?.name || "Logo"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-500">
                <Building2 className="h-6 w-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-gray-900">
                  {currentPartner?.name || "Verified Partner"}
                </p>
                <span className="rounded-md bg-cyan-100 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-800">
                  Job ID: {job.job_id}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {("owner" in (currentPartner || {}) && (currentPartner as any)?.owner?.email) ||
                  job.email ||
                  "Industry Partner"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsChangingIndustry((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs transition-colors hover:border-[#04A1B7] hover:text-[#04A1B7] cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>{isChangingIndustry ? "Keep Current" : "Reassign Partner"}</span>
          </button>
        </div>

        {/* Expandable Partner Search List if admin wants to reassign */}
        {isChangingIndustry && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search partner by name or email to reassign..."
                value={industrySearch}
                onChange={(e) => setIndustrySearch(e.target.value)}
                className="h-9 w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#04A1B7] focus:outline-none"
              />
            </div>

            {isLoadingIndustries ? (
              <p className="py-2 text-center text-xs text-gray-400">Loading industries...</p>
            ) : (
              <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
                {filteredIndustries.map((ind) => {
                  const isSelected = selectedIndustryId === ind.id;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => {
                        setSelectedIndustryId(ind.id);
                        setIsChangingIndustry(false);
                      }}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "border-[#04A1B7] bg-[#04A1B7]/10"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-gray-900">{ind.name}</p>
                        <p className="truncate text-[10px] text-gray-500">
                          {ind.owner?.email || "Partner"}
                        </p>
                      </div>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-[#04A1B7]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step Indicators - Matching MindUnite Boosting Plan style */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-3.5 mb-2 shadow-2xs">
        <div className="flex items-center justify-between w-full mx-auto">
          {ADMIN_STEPS.map((step, idx) => {
            const isCompleted = step.id < currentStep;
            const isPassed = step.id <= currentStep;

            return (
              <Fragment key={step.id}>
                {/* Step Item */}
                <button
                  type="button"
                  onClick={() => handleStepJump(step.id as AdminStepNumber)}
                  className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left shrink-0 transition-colors duration-150 cursor-pointer focus:outline-hidden"
                >
                  <div
                    className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                      isPassed
                        ? "bg-[#04A1B7] text-white shadow-xs"
                        : "bg-slate-100 text-gray-400"
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
                      isPassed ? "text-[#04A1B7]" : "text-gray-400"
                    )}
                  >
                    <span className="hidden lg:inline">{step.title}</span>
                    <span className="inline lg:hidden">{step.shortTitle || step.title}</span>
                  </span>
                </button>

                {/* Connecting Line between steps */}
                {idx < ADMIN_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-1.5 sm:mx-2.5 transition-colors self-start mt-3 sm:self-center sm:mt-0",
                      step.id < currentStep ? "bg-[#04A1B7]" : "bg-gray-200"
                    )}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Company & Basics */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CustomInput
              label="Job Title"
              required
              placeholder="e.g. Assistant Professor of Psychology"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                if (formErrors.job_title) {
                  setFormErrors((prev) => {
                    const c = { ...prev };
                    delete c.job_title;
                    return c;
                  });
                }
              }}
              error={formErrors.job_title}
            />

            <CustomInput
              label="Position / Role"
              required
              placeholder="e.g. Clinical Psychologist"
              value={position}
              onChange={(e) => {
                setPosition(e.target.value);
                if (formErrors.position) {
                  setFormErrors((prev) => {
                    const c = { ...prev };
                    delete c.position;
                    return c;
                  });
                }
              }}
              error={formErrors.position}
            />
          </div>

          <CustomSelect
            label="Network Platform"
            required
            options={NETWORK_OPTIONS}
            value={networkType}
            onChange={(val) => setNetworkType(String(val))}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CustomSelect
              label="Category"
              required
              placeholder="Select Category"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={handleCategoryChange}
              error={formErrors.category}
            />

            <CustomSelect
              label="Sub-Category"
              placeholder={category ? `Select Sub-Category for ${category}` : "Select Sub-Category"}
              options={subCategoryOptions}
              value={subCategory}
              onChange={handleSubCategoryChange}
              helperText={category ? `Showing positions under ${category}` : "Auto-selects Category if chosen directly"}
            />
          </div>

          <CustomSelect
            label="Employment Offerings"
            required
            placeholder="Select Employment Offering"
            options={EMPLOYMENT_OFFERING_OPTIONS}
            value={employmentOffering}
            onChange={(val) => setEmploymentOffering(String(val))}
            error={formErrors.employment_offering}
          />
        </div>
      )}

      {/* STEP 2: Role Details & Compensation */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Work Arrangement & Compensation
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CustomSelect
              label="Work Mode"
              required
              options={WORK_MODE_OPTIONS}
              value={workMode}
              onChange={(val) => setWorkMode(String(val))}
              error={formErrors.work_mode}
            />

            <CustomSelect
              label="Employment Type"
              required
              options={EMPLOYMENT_TYPE_OPTIONS}
              value={employmentType}
              onChange={(val) => setEmploymentType(String(val))}
              error={formErrors.employment_type}
            />

            <CustomSelect
              label="Career Level"
              options={LEVEL_OPTIONS}
              value={level}
              onChange={(val) => setLevel(String(val))}
            />
          </div>

          <CustomInput
            label="Experience Required"
            placeholder="e.g. 1 year, 3-5 years"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          {/* Salary Structure */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-4">
            <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Salary Structure
            </h5>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className={!(salaryType && salaryType !== "Negotiable") ? "sm:col-span-3" : ""}>
                <CustomSelect
                  label="Salary Frequency / Type"
                  placeholder="Select salary type"
                  options={SALARY_TYPE_OPTIONS}
                  value={salaryType}
                  onChange={(val) => {
                    const newType = String(val);
                    setSalaryType(newType);
                    if (newType === "Negotiable" || !newType) {
                      setSalaryMin("");
                      setSalaryMax("");
                    }
                  }}
                />
              </div>

              {salaryType && salaryType !== "Negotiable" && (
                <>
                  <CustomInput
                    label="Salary Range Min ($)"
                    type="number"
                    placeholder="e.g. 50000"
                    value={salaryMin}
                    onChange={(e) => {
                      setSalaryMin(e.target.value);
                      if (formErrors.salary_min || formErrors.salary_max) {
                        setFormErrors((prev) => {
                          const c = { ...prev };
                          delete c.salary_min;
                          delete c.salary_max;
                          return c;
                        });
                      }
                    }}
                    error={formErrors.salary_min}
                  />

                  <CustomInput
                    label="Salary Range Max ($)"
                    type="number"
                    placeholder="e.g. 90000"
                    value={salaryMax}
                    onChange={(e) => {
                      setSalaryMax(e.target.value);
                      if (formErrors.salary_max) {
                        setFormErrors((prev) => {
                          const c = { ...prev };
                          delete c.salary_max;
                          return c;
                        });
                      }
                    }}
                    error={formErrors.salary_max}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Location & Contact Channels */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Location & Contact Channels
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CustomSelect
              label="State"
              placeholder={isStateLoading ? "Loading states..." : "Select State"}
              options={stateOptions}
              value={selectedStateId}
              disabled={isStateLoading}
              onChange={(val) => {
                setSelectedStateId(String(val));
                setSelectedCityId("");
              }}
              helperText={
                isStateLoading
                  ? "Loading available states..."
                  : stateOptions.length > 0
                    ? `${stateOptions.length} states available`
                    : undefined
              }
            />

            <CustomSelect
              label="City"
              placeholder={
                !selectedStateId
                  ? "Select State first"
                  : isCitiesLoading
                    ? "Loading cities..."
                    : "Select City"
              }
              options={cityOptions}
              value={selectedCityId}
              disabled={!selectedStateId || isCitiesLoading}
              onChange={(val) => setSelectedCityId(String(val))}
              helperText={
                !selectedStateId
                  ? "Choose a state first to view cities"
                  : isCitiesLoading
                    ? "Loading cities..."
                    : cityOptions.length > 0
                      ? `${cityOptions.length} cities found in ${selectedStateObj?.name || "selected state"}`
                      : undefined
              }
            />
          </div>

          <CustomInput
            label="Location Map / Portal URL"
            placeholder="https://maps.google.com/..."
            value={locationUrl}
            onChange={(e) => {
              setLocationUrl(e.target.value);
              if (formErrors.location_url) {
                setFormErrors((prev) => {
                  const c = { ...prev };
                  delete c.location_url;
                  return c;
                });
              }
            }}
            error={formErrors.location_url}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CustomInput
              label="Contact Email"
              type="email"
              required
              placeholder="person@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email) {
                  setFormErrors((prev) => {
                    const c = { ...prev };
                    delete c.email;
                    return c;
                  });
                }
              }}
              error={formErrors.email}
            />

            <CustomInput
              label="Contact Phone"
              placeholder="Enter contact phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <CustomInput
              label="Company Website / Career URL"
              placeholder="https://example.com"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                if (formErrors.website) {
                  setFormErrors((prev) => {
                    const c = { ...prev };
                    delete c.website;
                    return c;
                  });
                }
              }}
              error={formErrors.website}
            />
          </div>
        </div>
      )}

      {/* STEP 4: Job Description & Tags */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[#4A4C56]">
                Job Description <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Drag bottom handle to resize
              </span>
            </div>

            <div className={formErrors.job_description ? "[&_.jodit-container]:border-red-500! rounded-lg" : ""}>
              <JoditEditor
                value={jobDescription}
                placeholder="Describe the role, responsibilities, requirements, qualifications, and benefits..."
                onChange={(content) => {
                  setJobDescription(content);
                  if (formErrors.job_description) {
                    setFormErrors((prev) => {
                      const c = { ...prev };
                      delete c.job_description;
                      return c;
                    });
                  }
                }}
                height={300}
                minHeight={220}
                allowResizeY={true}
              />
            </div>
            {formErrors.job_description && (
              <p className="text-xs text-red-500">{formErrors.job_description}</p>
            )}
            <p className="text-[11px] text-gray-400">
              Minimum 20 characters required. Use headers and bullet points for readability.
            </p>
          </div>

          {/* Tags with Interactive Badges */}
          <TagInputField
            id="admin_edit_tags"
            label="Job Tags & Keywords"
            placeholder="Type tag (e.g. Neuroscience) and press Enter..."
            value={tags}
            onChange={(val) => setTags(val)}
            helperText="Press Enter or comma (,) to add each tag. Click ✕ to remove."
          />
        </div>
      )}

      {/* STEP 5: Schedule & Publish */}
      {currentStep === 5 && (
        <div className="space-y-4">
          {/* Publishing Status Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-2">
            <div>
              <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Publishing Status <span className="text-red-500">*</span>
              </h5>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Manage the live visibility and publication state of this job post.
              </p>
            </div>
            <div className="pt-1">
              <CustomSelect
                label="Publishing Status"
                required
                options={STATUS_OPTIONS}
                value={status}
                onChange={(val) => setStatus(String(val))}
                helperText={
                  status === "published"
                    ? "This job will be published and visible to all candidates."
                    : status === "draft"
                      ? "This job will remain as a private draft and will not be visible publicly."
                      : status === "archive"
                        ? "This job will be archived and hidden from public search."
                        : status === "expired"
                          ? "This job will be marked as expired."
                          : status === "rejected"
                            ? "This job is marked as rejected."
                            : undefined
                }
              />
            </div>
          </div>

          {/* Posting Schedule & Application Deadline */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-4">
            <div>
              <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Posting Schedule & Deadline
              </h5>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Set recruitment timeline or leave open-ended.
              </p>
            </div>

            {/* Schedule Option Toggle/Card */}
            <div
              onClick={() => {
                const next = !isScheduledMode;
                setIsScheduledMode(next);
                if (!next) {
                  setStartDate(undefined);
                } else if (!startDate) {
                  setStartDate(addDays(new Date(), 1));
                }
              }}
              className={cn(
                "flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer select-none",
                isScheduledMode
                  ? "border-[#04A1B7] bg-cyan-50/60 ring-1 ring-[#04A1B7]/20"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              )}
            >
              <input
                type="checkbox"
                id="admin_edit_schedule_mode"
                checked={isScheduledMode}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsScheduledMode(checked);
                  if (!checked) {
                    setStartDate(undefined);
                  } else if (!startDate) {
                    setStartDate(addDays(new Date(), 1));
                  }
                }}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#04A1B7] focus:ring-[#04A1B7] cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5 text-[#04A1B7]" />
                  <span className="text-xs font-bold text-gray-800">
                    Schedule for Future Release
                  </span>
                  <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Specify a future date when this job post will go live.
                </p>
              </div>
            </div>

            {/* Deadline Mode Radio */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Application Deadline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setDeadlineMode("open");
                    setEndDate(undefined);
                  }}
                  className={cn(
                    "flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer select-none",
                    deadlineMode === "open"
                      ? "border-[#04A1B7] bg-cyan-50/60 ring-1 ring-[#04A1B7]/20"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <input
                    type="radio"
                    name="admin_edit_deadline_mode"
                    checked={deadlineMode === "open"}
                    onChange={() => {
                      setDeadlineMode("open");
                      setEndDate(undefined);
                    }}
                    className="mt-0.5 text-[#04A1B7] focus:ring-[#04A1B7] cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800">
                        Open Until Filled
                      </span>
                      <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      No fixed deadline. Stays active until manually closed.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setDeadlineMode("deadline");
                    if (!endDate) {
                      setEndDate(addDays(startDate || new Date(), 30));
                    }
                  }}
                  className={cn(
                    "flex items-start gap-2.5 p-3 rounded-xl border transition cursor-pointer select-none",
                    deadlineMode === "deadline"
                      ? "border-[#04A1B7] bg-cyan-50/60 ring-1 ring-[#04A1B7]/20"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <input
                    type="radio"
                    name="admin_edit_deadline_mode"
                    checked={deadlineMode === "deadline"}
                    onChange={() => {
                      setDeadlineMode("deadline");
                      if (!endDate) {
                        setEndDate(addDays(startDate || new Date(), 30));
                      }
                    }}
                    className="mt-0.5 text-[#04A1B7] focus:ring-[#04A1B7] cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800">
                      Set Application Deadline
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Automatically close on a specific closing date.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            {deadlineMode === "deadline" && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#04A1B7]" /> Presets:
                </span>
                {[14, 30, 60, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      const base = startDate || new Date();
                      setEndDate(addDays(base, days));
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:border-[#04A1B7] hover:bg-cyan-50 hover:text-[#04A1B7] transition cursor-pointer"
                  >
                    +{days} Days
                  </button>
                ))}
              </div>
            )}

            {/* Dynamic Dates */}
            {(isScheduledMode || deadlineMode === "deadline") ? (
              <div
                className={cn(
                  "grid gap-4 pt-1",
                  isScheduledMode && deadlineMode === "deadline"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                )}
              >
                {isScheduledMode && (
                  <div>
                    <AdminDateField
                      label="Start Date (Scheduled Publish Date)"
                      placeholder="Select start date"
                      value={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        if (date && endDate && isBefore(endDate, date)) {
                          setEndDate(undefined);
                        }
                      }}
                      error={formErrors.start_date}
                    />
                    {startDate && isBefore(startOfDay(new Date()), startOfDay(startDate)) ? (
                      <p className="text-indigo-600 text-xs mt-1 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Scheduled: Goes live on {format(startDate, "MMM dd, yyyy")}.
                      </p>
                    ) : (
                      <p className="text-gray-400 text-xs mt-1">
                        Select a future date when this job post will go live.
                      </p>
                    )}
                  </div>
                )}

                {deadlineMode === "deadline" && (
                  <div>
                    <AdminDateField
                      label="End Date (Application Deadline)"
                      placeholder="Select application deadline"
                      value={endDate}
                      minDate={startDate}
                      onChange={setEndDate}
                      error={formErrors.end_date}
                    />
                    {endDate ? (
                      <p className="text-gray-500 text-xs mt-1">
                        Applications close on {format(endDate, "MMM dd, yyyy")}.
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
                  Immediate & Open-Ended: This job will stay active until manually paused or closed.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Bottom Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          {currentStep > 1 ? (
            <CustomButton
              type="button"
              variant="ghost"
              onClick={() => setCurrentStep((prev) => (prev - 1) as AdminStepNumber)}
              disabled={isUpdating}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Step {currentStep - 1}
            </CustomButton>
          ) : (
            <CustomButton
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </CustomButton>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save as Draft button */}
          {(status === "draft" || job.status === "draft") && (
            <button
              type="button"
              onClick={() => handleSubmit(undefined, "draft")}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-gray-500" />
              <span>Save as Draft</span>
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#04A1B7] hover:bg-[#03899c] text-white text-xs font-bold transition cursor-pointer"
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
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <CustomButton
              type="button"
              variant="primary"
              loading={isUpdating}
              loadingText="Publishing Job..."
              onClick={() => {
                if (status === "draft") {
                  setStatus("published");
                  handleSubmit(undefined, "published");
                } else {
                  handleSubmit(undefined, status);
                }
              }}
            >
              <Rocket className="w-4 h-4 mr-1.5" />
              {status === "draft" || job.status === "draft"
                ? "Update & Publish Position"
                : status === "published"
                  ? "Update & Publish Position"
                  : "Save Changes"}
            </CustomButton>
          )}
        </div>
      </div>
    </form>
  );
}

export default function AdminEditJobModal({
  job,
  open,
  onOpenChange,
  onSuccess,
}: AdminEditJobModalProps) {
  if (!job) return null;

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit Job Post — #${job.job_id || job.id}`}
      size="xl"
    >
      <AdminEditJobForm
        job={job}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </CustomModal>
  );
}
