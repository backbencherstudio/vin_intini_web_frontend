"use client";

import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import RootDialog from "@/components/reusable/RootDialog";
import { DeleteIcon } from "@/public/svgIcons/Icons";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type ProfileUpdateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  description: string;
  positions: { value: string }[];
  schools: { value: string }[];
  skills: string[];
};

const roleOptions = [
  { value: "CEO at MindUnite", label: "CEO at MindUnite" },
  { value: "Product Manager", label: "Product Manager" },
  { value: "Software Engineer", label: "Software Engineer" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "Marketing Specialist", label: "Marketing Specialist" },
];

const schoolOptions = [
  { value: "Dhaka University", label: "Dhaka University" },
  { value: "University of Dhaka", label: "University of Dhaka" },
  { value: "North South University", label: "North South University" },
  { value: "BRAC University", label: "BRAC University" },
  {
    value: "United International University",
    label: "United International University",
  },
];

const skillOptions = [
  { value: "User Experience", label: "User Experience" },
  { value: "User Experience Design", label: "User Experience Design" },
  { value: "User Interface", label: "User Interface" },
  { value: "User Interface Design", label: "User Interface Design" },
  { value: "User Analytics", label: "User Analytics" },
  { value: "User Behavior", label: "User Behavior" },
];

function ProfileUpdateForm({ open, setOpen }: ProfileUpdateFormProps) {
  const [showSkillsPicker, setShowSkillsPicker] = useState(false);

  const { control, register, handleSubmit, watch } = useForm<ProfileFormValues>(
    {
      defaultValues: {
        firstName: "Vin",
        lastName: "Intini",
        title: "CEO at MindUnite",
        location: "United States",
        description: "",
        positions: [{ value: "" }],
        schools: [{ value: "" }],
        skills: [],
      },
    },
  );

  const {
    fields: positionFields,
    append: appendPosition,
    remove: removePosition,
  } = useFieldArray({
    control,
    name: "positions",
  });

  const {
    fields: schoolFields,
    append: appendSchool,
    remove: removeSchool,
  } = useFieldArray({
    control,
    name: "schools",
  });

  const descriptionCount = watch("description")?.length || 0;
  const selectedSkills = watch("skills") || [];

  const onSubmit = (_values: ProfileFormValues) => {
    setOpen(false);
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-205 rounded-xl"
    >
      <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-5">
        <h2 className="text-base md:text-lg font-semibold leading-[1.1] text-headerColor ">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
              First Name <span className="text-redColor">*</span>
            </label>
            <input
              {...register("firstName")}
              className="h-12 w-full rounded-lg border border-borderColor px-4 text-base text-headerColor outline-none transition focus:ring-2 focus:ring-primaryColor/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
              Last Name <span className="text-redColor">*</span>
            </label>
            <input
              {...register("lastName")}
              className="h-12 w-full rounded-lg border border-borderColor px-4 text-base text-headerColor outline-none transition focus:ring-2 focus:ring-primaryColor/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
              Title <span className="text-redColor">*</span>
            </label>
            <input
              {...register("title")}
              className="h-12 w-full rounded-lg border border-borderColor px-4 text-base text-headerColor outline-none transition focus:ring-2 focus:ring-primaryColor/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
              Location <span className="text-redColor">*</span>
            </label>
            <input
              {...register("location")}
              className="h-12 w-full rounded-lg border border-borderColor px-4 text-base text-headerColor outline-none transition focus:ring-2 focus:ring-primaryColor/20"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[14px] font-semibold text-descriptionColor">
              Current Position
            </label>
            {positionFields.map((positionField, index) => (
              <div key={positionField.id} className="flex items-center gap-2.5">
                <Controller
                  name={`positions.${index}.value`}
                  control={control}
                  render={({ field }) => (
                    <CreatableSelectField
                      value={field.value || undefined}
                      onChange={field.onChange}
                      options={roleOptions}
                      placeholder="Select Role here..."
                      allowCustomInput
                      className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                    />
                  )}
                />
                {positionFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePosition(index)}
                    aria-label="Remove position"
                    className="shrink-0 cursor-pointer rounded-full border-borderColor bg-redColor/10 p-2 text-descriptionColor transition-colors hover:text-redColor"
                  >
                    <DeleteIcon className="h-4 w-4 text-redColor" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendPosition({ value: "" })}
              className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-2! mt-3! px-3! `}
            >
              <Plus className="h-4 w-4" />
              Add new position
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-[14px] font-semibold text-descriptionColor">
              School
            </label>
            {schoolFields.map((schoolField, index) => (
              <div key={schoolField.id} className="flex items-center gap-2.5">
                <Controller
                  name={`schools.${index}.value`}
                  control={control}
                  render={({ field }) => (
                    <CreatableSelectField
                      value={field.value || undefined}
                      onChange={field.onChange}
                      options={schoolOptions}
                      placeholder="Select Role here..."
                      allowCustomInput
                      className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3! [&_.ant-select-selection-placeholder]:text-descriptionColor!"
                    />
                  )}
                />
                {schoolFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchool(index)}
                    aria-label="Remove school"
                    className="shrink-0 cursor-pointer rounded-full border-borderColor bg-redColor/10 p-2 text-descriptionColor transition-colors hover:text-redColor"
                  >
                    <DeleteIcon className="h-4 w-4 text-redColor" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSchool({ value: "" })}
              className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-2! mt-3! px-3! `}
            >
              <Plus className="h-4 w-4" />
              Add new school
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-descriptionColor">
              Description <span className="text-redColor">*</span>
            </label>
            <textarea
              {...register("description")}
              maxLength={2500}
              placeholder="What is the purpose of the group?"
              className="min-h-28 w-full rounded-lg border border-borderColor p-4 text-base text-headerColor outline-none transition placeholder:text-descriptionColor/80 focus:ring-2 focus:ring-primaryColor/20"
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
              className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-2! mt-3! px-3! `}
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

export default ProfileUpdateForm;
