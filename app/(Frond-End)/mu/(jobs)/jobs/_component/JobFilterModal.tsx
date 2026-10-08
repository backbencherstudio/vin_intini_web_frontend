"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import RootDialog from "@/components/reusable/RootDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface JobFilterModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const JOB_TYPE_OPTIONS = [
  { label: "Full-Time", value: "Full-Time" },
  { label: "Short-Term", value: "Short-Term" },
  { label: "Remote", value: "Remote" },
  { label: "Part-Time", value: "Part-Time" },
];

const INDUSTRY_OPTIONS = [
  { label: "Psychology", value: "Psychology" },
  { label: "Neuroscience", value: "Neuroscience" },
  { label: "Psychiatry", value: "Psychiatry" },
  { label: "Counseling", value: "Counseling" },
];

const EXPERIENCE_LEVEL_OPTIONS = [
  { label: "Entry-level", value: "Entry-level" },
  { label: "Senior-level", value: "Senior-level" },
  { label: "Mid-level", value: "Mid-level" },
  { label: "Executive-level", value: "Executive-level" },
];

function JobFilterModal({ open, setOpen }: JobFilterModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<
    string[]
  >([]);

  // Synchronize state with current URL search params whenever modal opens
  useEffect(() => {
    if (open) {
      const jobTypeParam = searchParams.get("job_type");
      const industryParam = searchParams.get("industry");
      const experienceParam = searchParams.get("experience_level");

      setSelectedJobTypes(jobTypeParam ? jobTypeParam.split(",") : []);
      setSelectedIndustries(industryParam ? industryParam.split(",") : []);
      setSelectedExperienceLevels(
        experienceParam ? experienceParam.split(",") : [],
      );
    }
  }, [open, searchParams]);

  const toggleSelection = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleApply = () => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (selectedJobTypes.length > 0) {
      nextParams.set("job_type", selectedJobTypes.join(","));
    } else {
      nextParams.delete("job_type");
    }

    if (selectedIndustries.length > 0) {
      nextParams.set("industry", selectedIndustries.join(","));
    } else {
      nextParams.delete("industry");
    }

    if (selectedExperienceLevels.length > 0) {
      nextParams.set("experience_level", selectedExperienceLevels.join(","));
    } else {
      nextParams.delete("experience_level");
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
    setOpen(false);
  };

  const handleReset = () => {
    setSelectedJobTypes([]);
    setSelectedIndustries([]);
    setSelectedExperienceLevels([]);

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("job_type");
    nextParams.delete("industry");
    nextParams.delete("experience_level");

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
    setOpen(false);
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      ariaLabel="Filter Type"
      ariaDescription="Filter jobs by job type, industry and experience level"
      className="max-w-111! rounded-2xl! overflow-hidden p-0 flex flex-col max-h-[85vh]"
    >
      <div className="flex flex-col h-full max-h-[85vh] bg-white overflow-hidden">
        {/* Header - Fixed / Sticky */}
        <div className="shrink-0 px-5 sm:px-6 pt-5 pb-4 border-b border-borderColor/60 pr-12 bg-white sticky top-0 z-10">
          <h3 className="text-base sm:text-lg font-bold text-headerColor">
            Filter Type
          </h3>
        </div>

        {/* Content Body - Only this section scrolls */}
        <div className="flex-1 px-5 sm:px-6 py-5 space-y-6 overflow-y-auto">
          {/* Section: Job Type */}
          <div>
            <h4 className="text-sm font-semibold text-headerColor mb-3">
              Job Type
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              {JOB_TYPE_OPTIONS.map((item) => {
                const isChecked = selectedJobTypes.includes(item.value);
                return (
                  <label
                    key={item.value}
                    className="flex items-center gap-2.5 cursor-pointer text-sm text-descriptionColor hover:text-headerColor select-none transition-colors"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() =>
                        toggleSelection(
                          item.value,
                          selectedJobTypes,
                          setSelectedJobTypes,
                        )
                      }
                      className="data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor data-[state=checked]:text-white rounded-sm w-4.5 h-4.5"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section: Industry */}
          <div>
            <h4 className="text-sm font-semibold text-headerColor mb-3">
              Industry
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              {INDUSTRY_OPTIONS.map((item) => {
                const isChecked = selectedIndustries.includes(item.value);
                return (
                  <label
                    key={item.value}
                    className="flex items-center gap-2.5 cursor-pointer text-sm text-descriptionColor hover:text-headerColor select-none transition-colors"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() =>
                        toggleSelection(
                          item.value,
                          selectedIndustries,
                          setSelectedIndustries,
                        )
                      }
                      className="data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor data-[state=checked]:text-white rounded-sm w-4.5 h-4.5"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section: Experience Level */}
          <div>
            <h4 className="text-sm font-semibold text-headerColor mb-3">
              Experience Level
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              {EXPERIENCE_LEVEL_OPTIONS.map((item) => {
                const isChecked = selectedExperienceLevels.includes(item.value);
                return (
                  <label
                    key={item.value}
                    className="flex items-center gap-2.5 cursor-pointer text-sm text-descriptionColor hover:text-headerColor select-none transition-colors"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() =>
                        toggleSelection(
                          item.value,
                          selectedExperienceLevels,
                          setSelectedExperienceLevels,
                        )
                      }
                      className="data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor data-[state=checked]:text-white rounded-sm w-4.5 h-4.5"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions - Fixed / Sticky */}
        <div className="shrink-0 px-5 sm:px-6 py-3 border-t border-borderColor/60 flex items-center justify-between bg-white sticky bottom-0 z-10">
          <ButtonReuseable
            type="button"
            onClick={handleReset}
            title={" Reset to Default"}
            className="bg-transparent! text-primaryColor! shadow-none!"
          />

          <ButtonReuseable
            type="button"
            onClick={handleApply}
            title=" Apply"
            className=" px-7! py-2.5! rounded-lg transition-colors cursor-pointer"
          />
        </div>
      </div>
    </RootDialog>
  );
}

export default JobFilterModal;
