"use client";

import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import RootDialog from "@/components/reusable/RootDialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export type EducationFormValues = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
  grade: string;
  activities: string;
  description: string;
  skills: string[];
};

type ProfileEducationFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValues?: Partial<EducationFormValues>;
};

const defaultEducationValues: EducationFormValues = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isCurrent: false,
  grade: "",
  activities: "",
  description: "",
  skills: [],
};

const degreeOptions = [
  { value: "High School", label: "High School" },
  { value: "Associates Degree", label: "Associates Degree" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "PsyD", label: "PsyD" },
  { value: "PhD", label: "PhD" },
  { value: "DO", label: "DO" },
  { value: "MD", label: "MD" },
  { value: "MD-DO", label: "MD-DO" },
  { value: "MD-PhD", label: "MD-PhD" },
  { value: "Other", label: "Other" },
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

const yearOptions = [
  "2027",
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
].map((year) => ({ value: year, label: year }));

const skillOptions = [
  { value: "User Interface Design", label: "User Interface Design" },
  { value: "User Experience Design", label: "User Experience Design" },
  { value: "Research", label: "Research" },
  { value: "Academic Writing", label: "Academic Writing" },
  { value: "Data Analysis", label: "Data Analysis" },
  { value: "Team Leadership", label: "Team Leadership" },
];

function ProfileEducationForm({
  open,
  setOpen,
  initialValues,
}: ProfileEducationFormProps) {
  const [showSkillsPicker, setShowSkillsPicker] = useState(false);

  const { control, register, handleSubmit, watch, reset } =
    useForm<EducationFormValues>({
      defaultValues: defaultEducationValues,
    });

  useEffect(() => {
    if (!open) return;

    const mergedValues: EducationFormValues = {
      ...defaultEducationValues,
      ...initialValues,
      skills: initialValues?.skills || [],
    };

    reset(mergedValues);
    setShowSkillsPicker(mergedValues.skills.length > 0);
  }, [open, initialValues, reset]);

  const descriptionCount = watch("description")?.length || 0;
  const selectedSkills = watch("skills") || [];

  const onSubmit = (values: EducationFormValues) => {
    console.log("Education Form Values:", values);
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
          {initialValues ? "Edit Education" : "Add Education"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <ReusableInput
            id="school"
            label="School"
            placeholder="School"
            required
            {...register("school")}
            className="rounded-lg border-borderColor"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
              Degree <span className="text-redColor">*</span>
            </label>
            <Controller
              name="degree"
              control={control}
              render={({ field }) => (
                <CreatableSelectField
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={degreeOptions}
                  placeholder="Select degree here..."
                  allowCustomInput
                  className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                />
              )}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
              Field of study <span className="text-redColor">*</span>
            </label>
            <Controller
              name="fieldOfStudy"
              control={control}
              render={({ field }) => (
                <CreatableSelectField
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={skillOptions}
                  placeholder="Select field here..."
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
                name="startMonth"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={monthOptions}
                    placeholder="Month"
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
              <Controller
                name="startYear"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={yearOptions}
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
                name="endMonth"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={monthOptions}
                    placeholder="Month"
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
              <Controller
                name="endYear"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={yearOptions}
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
                {...register("isCurrent")}
                className="h-4 w-4"
              />
              I&apos;m currently studying here
            </label>
          </div>

          <ReusableInput
            id="grade"
            label="Grade"
            type="number"
            placeholder="Grade"
            {...register("grade")}
            className="rounded-lg border-borderColor"
          />

          <div>
            <ReusableTextarea
              label="Activities and societies"
              placeholder="Activities and societies"
              maxLength={2500}
              {...register("activities")}
              className="min-h-28 w-full rounded-lg border border-borderColor bg-white px-3 py-2 text-base text-descriptionColor outline-none"
            />
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

          <div>
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
                    className="mb-2.5 w-full [&_.ant-select-selector]:min-h-13! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
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

export default ProfileEducationForm;
