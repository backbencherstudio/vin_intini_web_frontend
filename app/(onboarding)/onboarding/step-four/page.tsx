"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import {
  setStep,
  updateFormData,
} from "@/feature/slice/onboarding/onboardingSlice";
import { useGetInstitutionQuery } from "@/feature/slice/user/userSlice";
import { monthOptions, yearOptions } from "@/public/demoData/RealData";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

interface StepFourData {
  highest_degree: string;
  field_study: string;
  institution: string;
  graduation_year: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  is_current: boolean;
}
interface OptionType {
  value: string;
  label: string;
}
interface GroupedOptionType {
  label: string;
  options: OptionType[];
}

const degreeOptions: OptionType[] = [
  { value: "Other", label: "Other" },
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
];

const fieldOfStudyOptions: GroupedOptionType[] = [
  {
    label: "Other",
    options: [{ value: "Other", label: "Other" }],
  },
  {
    label: "Psychology",
    options: [
      {
        value: "Generic degree in Psychology",
        label: "Psychology",
      },
      { value: "Clinical Psychology", label: "Clinical Psychology" },
      { value: "Counseling Psychology", label: "Counseling Psychology" },
      { value: "Abnormal Psychology", label: "Abnormal Psychology" },
      {
        value: "Developmental Psychology",
        label: "Developmental Psychology",
      },
      { value: "Educational Psychology", label: "Educational Psychology" },
      { value: "Personality Psychology", label: "Personality Psychology" },
      { value: "Behavioral Psychology", label: "Behavioral Psychology" },
      {
        value: "Cross-cultural Psychology",
        label: "Cross-cultural Psychology",
      },
      { value: "Experimental Psychology", label: "Experimental Psychology" },
      { value: "Cognitive Psychology", label: "Cognitive Psychology" },
      { value: "Biopsychology", label: "Biopsychology" },
    ],
  },
  {
    label: "Counseling",
    options: [
      {
        value: "Generic degree in Counseling",
        label: "Counseling",
      },
      { value: "Mental Health Counseling", label: "Mental Health Counseling" },
      {
        value: "Marriage and Family Therapy",
        label: "Marriage and Family Therapy",
      },
      { value: "School Counseling", label: "School Counseling" },
      { value: "Educational Counseling", label: "Educational Counseling" },
      {
        value: "Rehabilitation Counseling",
        label: "Rehabilitation Counseling",
      },
      {
        value: "Substance Abuse Counseling",
        label: "Substance Abuse Counseling",
      },
      {
        value: "Child and Adolescent Counseling",
        label: "Child and Adolescent Counseling",
      },
    ],
  },
  {
    label: "Neuroscience",
    options: [
      {
        value: "Generic degree in Neuroscience",
        label: "Neuroscience",
      },
      {
        value: "Molecular and Cellular Neuroscience",
        label: "Molecular and Cellular Neuroscience",
      },
      {
        value: "Neurophysiology, Neuroanatomy",
        label: "Neurophysiology, Neuroanatomy",
      },
      {
        value: "Developmental Neuroscience",
        label: "Developmental Neuroscience",
      },
      {
        value: "Computational Neuroscience",
        label: "Computational Neuroscience",
      },
      { value: "Clinical Neuroscience", label: "Clinical Neuroscience" },
      { value: "Neuroengineering", label: "Neuroengineering" },
      { value: "Neurogenetics", label: "Neurogenetics" },
      { value: "Neuroeconomics", label: "Neuroeconomics" },
    ],
  },
  {
    label: "Psychiatry",
    options: [
      { value: "Addiction Psychiatry", label: "Addiction Psychiatry" },
      { value: "Forensic Psychiatry", label: "Forensic Psychiatry" },
      { value: "Neuropsychiatry", label: "Neuropsychiatry" },
      {
        value: "Child and Adolescent Psychiatry",
        label: "Child and Adolescent Psychiatry",
      },
      { value: "Geriatric Psychiatry", label: "Geriatric Psychiatry" },
      {
        value: "Consultation-Liaison Psychiatry",
        label: "Consultation-Liaison Psychiatry",
      },
      { value: "Sleep Psychiatry", label: "Sleep Psychiatry" },
      { value: "Pain Psychiatry", label: "Pain Psychiatry" },
    ],
  },
];

function page() {
  const stepFourData = useSelector((state: any) => state.onboarding.formData);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { data: institutionOptions } = useGetInstitutionQuery("");

  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepFourData>({
    defaultValues: {
      highest_degree: stepFourData?.highest_degree || "",
      field_study: stepFourData?.field_study || "",
      institution: stepFourData?.institution || "",
      graduation_year: stepFourData?.graduation_year || "",
      start_month: stepFourData?.start_month || "",
      start_year: stepFourData?.start_year || "",
      end_month: stepFourData?.end_month || "",
      end_year: stepFourData?.end_year || "",
      is_current: stepFourData?.is_current || false,
    },
  });

  const isCurrent = watch("is_current");

  useEffect(() => {
    if (isCurrent) {
      setValue("end_month", "");
      setValue("end_year", "");
    }
  }, [isCurrent, setValue]);

  const onSubmit = (data: StepFourData) => {
    setIsLoading(true);

    dispatch(
      updateFormData(
        data.is_current ? { ...data, end_month: "", end_year: "" } : data,
      ),
    );
    dispatch(setStep(5));
    router.push("/onboarding/step-five");

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="">
      <OnboardingWrapper
        title="Your Education Background"
        description="Please select your highest degree achieved."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 lg:mt-10 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm text-headerColor font-medium block">
              Highest Degree In-Progress/Completed{" "}
              <span className="text-redColor">*</span>
            </label>
            <Controller
              name="highest_degree"
              control={control}
              rules={{ required: "Highest degree is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  placeholder="Select degree"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={degreeOptions as any}
                  allowCustomInput
                  className="w-full h-12! md:h-13! rounded-md"
                />
              )}
            />
            {errors.highest_degree && (
              <p className="text-red-500 text-xs">
                {errors.highest_degree.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-headerColor font-medium block">
              Field of Study <span className="text-redColor">*</span>
            </label>
            <Controller
              name="field_study"
              control={control}
              rules={{ required: "Field of study is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  placeholder="Select field of study"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={fieldOfStudyOptions as any}
                  allowCustomInput
                  className="w-full h-12! md:h-13! rounded-md"
                />
              )}
            />
            {errors.field_study && (
              <p className="text-red-500 text-xs">
                {errors.field_study.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-headerColor font-medium block">
              Current/Last Institution <span className="text-redColor">*</span>
            </label>
            <Controller
              name="institution"
              control={control}
              rules={{ required: "Institution is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  placeholder="Select institution"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={institutionOptions?.data?.map((inst: any) => ({
                    value: inst.name,
                    label: inst.name,
                  }))}
                  allowCustomInput
                  className="w-full h-12! md:h-13! focus:ring-2 focus:ring-primaryColor! focus:outline-none rounded-md"
                />
              )}
            />
            {errors.institution && (
              <p className="text-red-500 text-xs">
                {errors.institution.message}
              </p>
            )}
          </div>
          {/* <div className="space-y-1.5">
            <label className="text-sm text-headerColor font-medium block">
              Graduated/Expected Graduation Year{" "}
              <span className="text-redColor">*</span>
            </label>
            <Controller
              name="graduation_year"
              control={control}
              rules={{ required: "Graduation year is required" }}
              render={({ field }) => (
                <CreatableSelectField
                  placeholder="Select year"
                  type="number"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={yearOptions as any}
                  allowCustomInput
                  className="w-full h-12! md:h-13! focus:ring-2 focus:ring-primaryColor! focus:outline-none rounded-md"
                />
              )}
            />
            {errors.graduation_year && (
              <p className="text-red-500 text-xs">
                {errors.graduation_year.message}
              </p>
            )}
          </div> */}

          <div className="space-y-1.5">
            <label className="text-sm text-headerColor font-medium block">
              Start date <span className="text-redColor">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="start_month"
                control={control}
                rules={{ required: "Start month is required" }}
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
                rules={{ required: "Start year is required" }}
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

          <div className="space-y-1.5">
            <label className="text-sm text-headerColor font-medium block">
              End date <span className="text-redColor">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="end_month"
                control={control}
                rules={{
                  required: isCurrent ? false : "End month is required",
                }}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={monthOptions}
                    placeholder="Month"
                    isDisabled={isCurrent}
                    className="h-12 w-full [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-borderColor! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
              <Controller
                name="end_year"
                control={control}
                rules={{
                  required: isCurrent ? false : "End year is required",
                }}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    type="number"
                    options={yearOptions}
                    placeholder="Year"
                    isDisabled={isCurrent}
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

          <ButtonReuseable
            type="submit"
            loading={isLoading}
            sendingMsg="Saving..."
            title="Continue"
            className="w-full lg:py-4!"
          />
        </form>
      </OnboardingWrapper>
    </div>
  );
}

export default page;
