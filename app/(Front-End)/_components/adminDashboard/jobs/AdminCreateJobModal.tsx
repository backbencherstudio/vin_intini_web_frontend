"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Building2, Check, Search, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect, {
  type SelectOption,
} from "@/components/reusable/dashboard/CustomSelect";
import JoditEditor from "@/components/reusable/InputFiled/JoditEditor";
import {
  useCreateAdminJobMutation,
  useGetVerifiedJobIndustriesQuery,
  type CreateAdminJobPayload,
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

interface AdminCreateJobModalProps {
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
  { label: "Published (Live immediately)", value: "published" },
  { label: "Draft", value: "draft" },
];

export default function AdminCreateJobModal({
  open,
  onOpenChange,
  onSuccess,
}: AdminCreateJobModalProps) {
  const [createAdminJob, { isLoading: isCreating }] = useCreateAdminJobMutation();
  const { data: industriesData, isLoading: isLoadingIndustries, refetch: refetchIndustries } =
    useGetVerifiedJobIndustriesQuery(undefined, { skip: !open });

  const {
    data: statesData,
    isLoading: isStateLoading,
    refetch: refetchStates,
  } = useGetAllStatesQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (open) {
      refetchStates();
      refetchIndustries();
    }
  }, [open, refetchStates, refetchIndustries]);

  const industries = useMemo(
    () => industriesData?.data ?? [],
    [industriesData?.data]
  );

  // Form states
  const [industrySearch, setIndustrySearch] = useState("");
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | null>(null);

  const [networkType, setNetworkType] = useState<string>("psychology");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [jobTitle, setJobTitle] = useState("");
  const [position, setPosition] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [employmentOffering, setEmploymentOffering] = useState<string>("state_institutions");
  const [workMode, setWorkMode] = useState<string>("remote");
  const [employmentType, setEmploymentType] = useState<string>("full_time");
  const [level, setLevel] = useState<string>("Mid-Level");
  const [experience, setExperience] = useState("");

  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [salaryMin, setSalaryMin] = useState<string>("");
  const [salaryMax, setSalaryMax] = useState<string>("");
  const [salaryType, setSalaryType] = useState<string>("Yearly");
  const [locationUrl, setLocationUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tags, setTags] = useState("");

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
    // If the current subCategory does not belong to the selected group, reset it
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
    // If category wasn't picked, auto-assign parent category
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

  const selectedIndustry = useMemo(
    () => industries.find((ind) => ind.id === selectedIndustryId),
    [industries, selectedIndustryId]
  );

  const handleSelectIndustry = (indId: number) => {
    setSelectedIndustryId(indId);
    const chosen = industries.find((i) => i.id === indId);
    if (chosen) {
      if (!email && chosen.owner?.email) {
        setEmail(chosen.owner.email);
      }
      if (!website && chosen.website) {
        setWebsite(chosen.website);
      }
    }
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy.industry_id;
      return copy;
    });
  };

  const handleReset = () => {
    setSelectedIndustryId(null);
    setIndustrySearch("");
    setNetworkType("psychology");
    setStatus("published");
    setJobTitle("");
    setPosition("");
    setCategory("");
    setSubCategory("");
    setEmploymentOffering("state_institutions");
    setWorkMode("remote");
    setEmploymentType("full_time");
    setLevel("Mid-Level");
    setExperience("");
    setSelectedStateId("");
    setSelectedCityId("");
    setStartDate("");
    setEndDate("");
    setEmail("");
    setPhoneNumber("");
    setWebsite("");
    setSalaryMin("");
    setSalaryMax("");
    setSalaryType("Yearly");
    setLocationUrl("");
    setJobDescription("");
    setTags("");
    setFormErrors({});
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!selectedIndustryId) {
      errors.industry_id = "Please select a verified industry.";
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
      const payload: CreateAdminJobPayload = {
        industry_id: selectedIndustryId!,
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
        state_id: selectedStateId && !isNaN(Number(selectedStateId)) ? Number(selectedStateId) : undefined,
        city_id: selectedCityId && !isNaN(Number(selectedCityId)) ? Number(selectedCityId) : undefined,
        email: email.trim(),
        phone_number: phoneNumber.trim() || undefined,
        website: website.trim() || undefined,
        salary_min: salaryMin ? Number(salaryMin) : undefined,
        salary_max: salaryMax ? Number(salaryMax) : undefined,
        salary_type: salaryType || undefined,
        location_url: locationUrl.trim() || undefined,
        job_description: jobDescription.trim(),
        announcement_start_date: startDate || undefined,
        announcement_end_date: endDate || undefined,
        tags: tags.trim() ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
        status,
      };

      await createAdminJob(payload).unwrap();
      toast.success("Job posted successfully on behalf of industry! Owner has been notified.");
      onOpenChange(false);
      onSuccess?.();
      handleReset();
    } catch (err: any) {
      const serverErrors = err?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const firstErrorMessage = Object.values(serverErrors).flat()[0] as string;
        toast.error(firstErrorMessage || "Validation error occurred.");
      } else {
        const msg = err?.data?.message || err?.message || "Failed to create job posting.";
        toast.error(msg);
      }
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(v) => {
        if (!isCreating) onOpenChange(v);
      }}
      title="Post Job for Verified Industry"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[82vh] overflow-y-auto px-1 py-2">
        {/* Industry Selection Section */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-[#04A1B7]" />
            <h4 className="text-sm font-bold text-gray-900">
              Select Verified Industry Company <span className="text-red-500">*</span>
            </h4>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Choose which verified partner company this job is posted for. The industry owner will receive instant notifications.
          </p>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search verified industry by name, owner or email..."
              value={industrySearch}
              onChange={(e) => setIndustrySearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#04A1B7] focus:outline-none focus:ring-1 focus:ring-[#04A1B7]"
            />
          </div>

          {isLoadingIndustries ? (
            <p className="text-xs text-gray-400 py-4 text-center">Loading verified industries...</p>
          ) : filteredIndustries.length === 0 ? (
            <p className="text-xs text-gray-500 py-3 text-center">No verified industries match your search.</p>
          ) : (
            <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
              {filteredIndustries.map((ind) => {
                const isSelected = selectedIndustryId === ind.id;
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => handleSelectIndustry(ind.id)}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-[#04A1B7] bg-[#04A1B7]/10 ring-1 ring-[#04A1B7]"
                        : "border-gray-200 bg-white hover:border-[#04A1B7]/50 hover:bg-gray-50"
                    }`}
                  >
                    {ind.logo_url ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <Image src={ind.logo_url} alt={ind.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-500">
                        <Building2 className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-900">{ind.name}</p>
                      <p className="truncate text-[11px] text-gray-500">
                        {ind.owner?.full_name || ind.industry || "Partner"}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#04A1B7] text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {formErrors.industry_id && (
            <p className="mt-2 text-xs font-medium text-red-500">{formErrors.industry_id}</p>
          )}

          {selectedIndustry && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-cyan-50/80 px-3 py-2 text-xs text-cyan-900">
              <span>
                Selected Partner: <strong>{selectedIndustry.name}</strong>
                {selectedIndustry.owner && ` (${selectedIndustry.owner.email})`}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIndustryId(null)}
                className="text-[11px] font-semibold text-cyan-700 underline hover:text-cyan-900"
              >
                Change
              </button>
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
              label="Publishing Status"
              required
              options={STATUS_OPTIONS}
              value={status}
              onChange={(val) => setStatus(val as any)}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CustomInput
              type="date"
              label="Announcement Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <CustomInput
              type="date"
              label="Announcement End Date (Application Deadline)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
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
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            loading={isCreating}
            loadingText="Posting Job..."
          >
            Publish Job for Industry
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
}
