"use client";

import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import RootDialog from "@/components/reusable/RootDialog";
import { useGetSkillSuggestionsQuery } from "@/feature/slice/user/experienceSlice";
import {
  useAddStudyMutation,
  useGetInstitutionSuggestionsQuery,
  useUpdateStudyMutation,
} from "@/feature/slice/user/studySlice";
import { EducationType } from "@/lib/type";
import {
  degreeOptions,
  monthOptions,
  yearOptions,
} from "@/public/demoData/RealData";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export type EducationFormValues = {
  institution: string;
  degree: string;
  field_study: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  is_current: boolean;
  grade: string;
  activities: string;
  description: string;
  skills: string[];
};

type ProfileEducationFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValues?: EducationType;
};

function normalizeSkillsList(skills?: unknown): string[] {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => {
      if (typeof skill === "string") return skill;

      if (skill && typeof skill === "object") {
        const typedSkill = skill as Record<string, unknown>;
        const value =
          typedSkill.value ??
          typedSkill.label ??
          typedSkill.name ??
          typedSkill.skill_name ??
          typedSkill.title;

        return typeof value === "string" ? value : "";
      }

      return "";
    })
    .filter(Boolean);
}

function ProfileEducationForm({
  open,
  setOpen,
  initialValues,
}: ProfileEducationFormProps) {
  const [showSkillsPicker, setShowSkillsPicker] = useState(
    initialValues ? true : false,
  );
  const { data: skillsData } = useGetSkillSuggestionsQuery("skill-suggestions");
  const { data: schoolData } =
    useGetInstitutionSuggestionsQuery("school-suggestions");
  const [addStudy, { isLoading }] = useAddStudyMutation();
  const [updateStudy, { isLoading: isUpdating }] = useUpdateStudyMutation();
  const { control, register, handleSubmit, watch, reset } =
    useForm<EducationFormValues>({
      defaultValues: {
        institution: initialValues?.institution?.name || "",
        degree: initialValues?.degree || "",
        field_study: initialValues?.field_study || "",
        start_month: initialValues?.start_month || "",
        start_year: initialValues?.start_year || "",
        end_month: initialValues?.end_month || "",
        end_year: initialValues?.end_year || "",
        is_current: initialValues?.is_current || false,
        grade: initialValues?.grade || "",
        activities: initialValues?.activities || "",
        description: initialValues?.description || "",
        skills: normalizeSkillsList(initialValues?.skills_data),
      },
    });

  const descriptionCount = watch("description")?.length || 0;
  const selectedSkills =
    watch("skills") || normalizeSkillsList(initialValues?.skills_data);

  const onSubmit = async (values: EducationFormValues) => {
    try {
      const response = initialValues
        ? await updateStudy({ id: initialValues.id, payload: values }).unwrap()
        : await addStudy(values).unwrap();
      toast.success(
        response?.message || initialValues
          ? "Education updated successfully."
          : "Education saved successfully.",
      );
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.data?.message || "Failed to save education. Please try again.",
      );
    }
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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-descriptionColor">
              Institution <span className="text-redColor">*</span>
            </label>
            <Controller
              name="institution"
              control={control}
              render={({ field }) => (
                <CreatableSelectField
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={
                    schoolData?.data?.map((school: { name: string }) => ({
                      value: school.name,
                      label: school.name,
                    })) || []
                  }
                  placeholder="Select school here..."
                  allowCustomInput
                  className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                />
              )}
            />
          </div>

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
            <ReusableInput
              id="field_study"
              label="Field of Study"
              placeholder="Field of Study"
              required
              {...register("field_study")}
              className="rounded-lg border-borderColor"
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
                    type="number"
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
                name="end_month"
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
                name="end_year"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                     type="number"
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
                {...register("is_current")}
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
                    options={
                      skillsData?.data?.map((skill: { name: string }) => ({
                        value: skill.name,
                        label: skill.name,
                      })) || []
                    }
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
                disabled={isLoading || isUpdating}
                type="submit"
                className="min-w-28 disabled:cursor-not-allowed disabled:bg-bgColor disabled:text-grayColor1  cursor-pointer rounded-full bg-primaryColor px-8 py-2 text-base font-semibold text-whiteColor transition-opacity hover:opacity-90"
              >
                {isLoading || isUpdating
                  ? "Saving..."
                  : initialValues
                    ? "Update Education"
                    : "Add Education"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </RootDialog>
  );
}

export default ProfileEducationForm;
