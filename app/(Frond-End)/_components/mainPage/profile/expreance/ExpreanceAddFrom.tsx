"use client";

import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useAddExperienceMutation,
  useGetCompanySuggestionsQuery,
} from "@/feature/slice/user/experienceSlice";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export type ExperienceFormValues = {
  title: string;
  employment_type: string;
  company_name: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  is_current: boolean;
  location: string;
  location_type: string;
  description: string;
  skills: string[];
};

type ExpreanceAddFromProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmitData?: (values: ExperienceFormValues) => void;
  initialValues?: Partial<ExperienceFormValues>;
};

const defaultExperienceValues: ExperienceFormValues = {
  title: "",
  employment_type: "",
  company_name: "",
  start_month: "",
  start_year: "",
  end_month: "",
  end_year: "",
  is_current: false,
  location: "",
  location_type: "",
  description: "",
  skills: [],
};

const employmentTypeOptions = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Freelance", label: "Freelance" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Apprenticeship", label: "Apprenticeship" },
  { value: "Seasonal", label: "Seasonal" },
];

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((month) => ({ value: month, label: month }));

const yearOptions = ["2026", "2025", "2024", "2023", "2022", "2021"].map(
  (year) => ({ value: year, label: year }),
);

const locationTypeOptions = [
  { value: "On-site", label: "On-site" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Remote", label: "Remote" },
];

const skillOptions = [
  { value: "User Experience", label: "User Experience" },
  { value: "User Experience Design", label: "User Experience Design" },
  { value: "User Interface", label: "User Interface" },
  { value: "User Interface Design", label: "User Interface Design" },
  { value: "User Analytics", label: "User Analytics" },
  { value: "User Behavior", label: "User Behavior" },
];

function ExpreanceAddFrom({
  open,
  setOpen,
  onSubmitData,
  initialValues,
}: ExpreanceAddFromProps) {
  const [showSkillsPicker, setShowSkillsPicker] = useState(false);
  const [addExperience] = useAddExperienceMutation();
  const { control, register, handleSubmit, watch, reset } =
    useForm<ExperienceFormValues>({
      defaultValues: defaultExperienceValues,
    });
  const {
    data: companyOptions,
    isLoading,
    isError,
  } = useGetCompanySuggestionsQuery("company");
  useEffect(() => {
    if (!open) return;

    const mergedValues: ExperienceFormValues = {
      ...defaultExperienceValues,
      ...initialValues,
      skills: initialValues?.skills || [],
    };

    setShowSkillsPicker(mergedValues.skills.length > 0);
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;

    reset({
      ...defaultExperienceValues,
      ...initialValues,
      skills: initialValues?.skills || [],
    });
  }, [open, initialValues, reset]);

  const descriptionCount = watch("description")?.length || 0;
  const selectedSkills = watch("skills") || [];

  const onSubmit = async (values: ExperienceFormValues) => {
    try {
      const response = await addExperience(values).unwrap();
      console.log("Experience added successfully:", response);
      toast.success(response.message || "Experience added successfully");
    } catch (error) {
      console.log(error, "An error occurs");
      toast.error("An error occurred while adding the experience");
    }

    console.log("Add Experience Form Values:", values);
    setOpen(false);
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-205 rounded-xl"
    >
      <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-5">
        <h2 className="text-[32px] font-semibold leading-[1.1] text-headerColor sm:text-[30px]">
          {initialValues ? "Edit Experience" : "Add Experience"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <ReusableInput
            id="title"
            label="Title"
            placeholder="Title"
            required
            {...register("title")}
            className="rounded-lg border-borderColor"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
              Employment type
            </label>
            <Controller
              name="employment_type"
              control={control}
              render={({ field }) => (
                <CreatableSelectField
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={employmentTypeOptions}
                   allowCustomInput
                  placeholder="Select Industry here..."
                  className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                />
              )}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
              Company or Organization
            </label>
            <Controller
              name="company_name"
              control={control}
              render={({ field }) => (
                <CreatableSelectField
                  placeholder="Select company or organization"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={companyOptions?.data?.map((inst: any) => ({
                    value: inst.name,
                    label: inst.name,
                  }))}
                  allowCustomInput
                  className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                />
              )}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
              Start date <span className="text-redColor">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="start_month"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={monthOptions}
                     allowCustomInput
                    placeholder="Month"
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
              <Controller
                name="start_year"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={yearOptions}
                     allowCustomInput
                    placeholder="Year"
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
              End date <span className="text-redColor">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="end_month"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={monthOptions}
                     allowCustomInput
                    placeholder="Month"
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
              <Controller
                name="end_year"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={yearOptions}
                     allowCustomInput
                    placeholder="Year"
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 text-base text-descriptionColor">
              <input
                type="checkbox"
                {...register("is_current")}
                className="h-4 w-4"
              />
              I&apos;m currently working in this position
            </label>
          </div>

          <ReusableInput
            id="location"
            label="Location"
            placeholder="Location"
            required
            {...register("location")}
            className="rounded-lg border-borderColor"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
              Location type
            </label>
            <Controller
              name="location_type"
              control={control}
              render={({ field }) => (
                <CreatableSelectField
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={locationTypeOptions}
                  placeholder="Select here..."
                  className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                />
              )}
            />
            <p className="mt-1 text-sm text-descriptionColor">
              Select a location ex. hybrid
            </p>
          </div>

          <div>
            <ReusableTextarea
              label="Description"
              placeholder="Description"
              maxLength={2500}
              {...register("description")}
              className="min-h-32 w-full rounded-lg border border-borderColor bg-white px-3 py-2 text-base text-descriptionColor outline-none"
            />
            <p className="mt-1 text-sm text-descriptionColor">
              {descriptionCount}/2500
            </p>
          </div>

          <div className="">
            <label className="mb-0.5 block text-[14px] font-semibold text-descriptionColor">
              Skills
            </label>
            <p className="mb-2 text-sm text-descriptionColor">
              Up to 5 skills in this experience.
            </p>

            {showSkillsPicker && (
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    isMulti
                    allowCustomInput
                    maxCount={5}
                    values={field.value || []}
                    onChangeValues={field.onChange}
                    options={skillOptions}
                    placeholder="Select skill here..."
                    className="mb-2.5 w-full  [&_.ant-select-selector]:min-h-13! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                  />
                )}
              />
            )}

            <button
              type="button"
              onClick={() => setShowSkillsPicker(true)}
              disabled={selectedSkills.length >= 5}
              className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-full border border-primaryColor px-4 py-1.5 text-base font-semibold text-primaryColor transition-colors hover:bg-primaryColor hover:text-whiteColor disabled:cursor-not-allowed disabled:border-borderColor disabled:text-descriptionColor"
            >
              <Plus className="h-4 w-4" />
              Add skill
            </button>
          </div>

          <div className="border-t border-borderColor pt-5">
            <div className="flex justify-center">
              <button
                type="submit"
                className="min-w-28 cursor-pointer rounded-full bg-primaryColor px-8 py-2 text-base font-semibold text-whiteColor transition-opacity hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </RootDialog>
  );
}

export default ExpreanceAddFrom;
