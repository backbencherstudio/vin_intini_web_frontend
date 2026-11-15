"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { Building2, CalendarClock, Check, Clock, Pencil, Search, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect, {
  type SelectOption,
} from "@/components/reusable/dashboard/CustomSelect";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import AdminDateField from "./AdminDateField";
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
];

const STATUS_OPTIONS: SelectOption[] = [
  { label: "Active (Live)", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Expired", value: "expired" },
  { label: "Archive", value: "archive" },
  { label: "Rejected", value: "rejected" },
];

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

  // Safely extract states array
  const rawStates: any[] = useMemo(() => {
    if (Array.isArray(statesData?.data)) return statesData.data;
    if (Array.isArray(statesData)) return statesData;
    return [];
  }, [statesData]);

  // State code for dynamic city fetching
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
      const fromList = industries.find((ind) => ind.id === selectedIndustryId);
      if (fromList) return fromList;
    }
    return job.industry || null;
  }, [industries, selectedIndustryId, job.industry]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!selectedIndustryId && !job.industry_id) {
      errors.industry_id = "Industry reference is required.";
    }
    if (!jobTitle.trim()) {
      errors.job_title = "Job title is required.";
    }
    if (!position.trim()) {
      errors.position = "Position / Role is required.";
    }
    if (!category.trim()) {
      errors.category = "Category is required.";
    }
    if (!employmentOffering.trim()) {
      errors.employment_offering = "Employment offering is required.";
    }
    if (!workMode) {
      errors.work_mode = "Work mode is required.";
    }
    if (!employmentType) {
      errors.employment_type = "Employment type is required.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "A valid contact email is required.";
    }
    const strippedDescription = jobDescription.replace(/<[^>]*>?/gm, "").trim();
    if (!strippedDescription || strippedDescription.length < 20) {
      errors.job_description = "Job description is required (min 20 characters).";
    }
    if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
      errors.salary_max = "Max salary must be greater than or equal to min salary.";
    }

    if (isScheduledMode) {
      if (!startDate) {
        errors.start_date = "Please select a start date to schedule this job.";
      }
    }

    if (deadlineMode === "deadline") {
      if (!endDate) {
        errors.end_date = "Please select an application deadline end date.";
      } else {
        if (isScheduledMode && startDate && isBefore(endDate, startDate)) {
          errors.end_date = "Application deadline cannot be earlier than start date.";
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in all required fields properly.");
      return;
    }

    try {
      const payload: UpdateAdminJobPayload = {
        id: job.id,
        industry_id: selectedIndustryId ?? job.industry_id,
        job_title: jobTitle.trim(),
        position: position.trim() || undefined,
        category: category.trim() || undefined,
        sub_category: subCategory.trim() || undefined,
        network_type: networkType as any,
        employment_offering: employmentOffering || undefined,
        work_mode: workMode,
        employment_type: employmentType,
        level: level || undefined,
        experience: experience.trim() || undefined,
        state_id: selectedStateId && !isNaN(Number(selectedStateId)) ? Number(selectedStateId) : null,
        city_id: selectedCityId && !isNaN(Number(selectedCityId)) ? Number(selectedCityId) : null,
        email: email.trim(),
        phone_number: phoneNumber.trim() || null,
        website: website.trim() || null,
        salary_min: salaryMin ? Number(salaryMin) : null,
        salary_max: salaryMax ? Number(salaryMax) : null,
        salary_type: salaryType || null,
        location_url: locationUrl.trim() || null,
        job_description: jobDescription.trim(),
        announcement_start_date: isScheduledMode && startDate
          ? format(startDate, "yyyy-MM-dd")
          : (!isScheduledMode && initialHasFutureStartDate ? null : (job.announcement_start_date ?? null)),
        announcement_end_date: deadlineMode === "deadline" && endDate
          ? format(endDate, "yyyy-MM-dd")
          : null,
        tags: tags.trim() ? tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
        status,
      };

      await updateAdminJob(payload).unwrap();
      toast.success("Job posting updated successfully.");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[82vh] overflow-y-auto px-1 py-2">
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

      {/* Section 1: Job Details & Categorization */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Job Details & Classification
        </h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CustomSelect
            label="Network Platform"
            required
            options={NETWORK_OPTIONS}
            value={networkType}
            onChange={(val) => setNetworkType(String(val))}
          />

          <CustomSelect
            label="Listing Status"
            required
            options={STATUS_OPTIONS}
            value={status}
            onChange={(val) => setStatus(String(val))}
          />
        </div>

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

        {/* Category & Sub-Category linked dropdowns */}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
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
      </div>

      {/* Section 2: Work Arrangement & Experience */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Work Arrangement & Experience
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CustomInput
            label="Experience Required"
            placeholder="e.g. 1 year, 3-5 years"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          <CustomInput
            label="Location Map / Portal URL"
            placeholder="https://maps.google.com/..."
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
          />
        </div>
      </div>

      {/* Section 3: Location & Dates */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Location & Posting Schedule
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

        {/* Timeline & Deadline Selector */}
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
                Specify a future date when this job post will go live. If unchecked, the job goes live immediately upon publishing.
              </p>
            </div>
          </div>

          {/* Radio Mode Selection for Deadline */}
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

          {/* Quick Extension Presets (visible ONLY if deadline mode is active) */}
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

              {/* End Date: ONLY SHOWN IF deadlineMode === "deadline" */}
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
            /* When NEITHER is selected/checked: Clean default status message */
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Immediate & Open-Ended: This job will go live immediately upon publishing and stay active until manually paused or closed.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Compensation & Contact */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Compensation & Contact Info
        </h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CustomInput
            label="Salary Range Min ($)"
            type="number"
            placeholder="e.g. 50000"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />

          <CustomInput
            label="Salary Range Max ($)"
            type="number"
            placeholder="e.g. 90000"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            error={formErrors.salary_max}
          />

          <CustomSelect
            label="Salary Frequency"
            options={SALARY_TYPE_OPTIONS}
            value={salaryType}
            onChange={(val) => setSalaryType(String(val))}
          />
        </div>

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
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>

      {/* Section 5: Job Description (WYSIWYG) & Tags */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Job Description & Tags
        </h4>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#4A4C56]">
            Job Description <span className="text-red-500">*</span>
          </label>
          <div className={cn(
            "[&_.jodit-add-new-line]:hidden!",
            "[&_.jodit-add-new-line]:!hidden",
            "[&_.jodit-status-bar]:hidden!",
            "[&_.jodit-resizer]:hidden!",
            formErrors.job_description ? "[&_.jodit-container]:border-red-500! rounded-lg" : ""
          )}>
            <JoditEditor
              value={jobDescription}
              placeholder="Describe the role, responsibilities, requirements, and benefits..."
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
              height={220}
            />
          </div>
          {formErrors.job_description && (
            <p className="text-xs text-red-500">{formErrors.job_description}</p>
          )}
        </div>

        <CustomInput
          label="Tags & Keywords (Comma-separated)"
          placeholder="e.g. Neuroscience, Clinical Trials, MRI, Psychology"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          helperText="Separate tags with commas."
        />
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <CustomButton
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isUpdating}
        >
          Cancel
        </CustomButton>
        <CustomButton
          type="submit"
          variant="primary"
          loading={isUpdating}
          loadingText="Saving Changes..."
        >
          Save Changes
        </CustomButton>
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
      title={`Edit Job Post: ${job.job_title}`}
      size="xl"
    >
      <AdminEditJobForm
        key={job.id}
        job={job}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </CustomModal>
  );
}
