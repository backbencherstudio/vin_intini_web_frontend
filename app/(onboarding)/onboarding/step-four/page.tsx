"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SmartSelectField from "@/components/reusable/InputFiled/SmartSelectField";
import {
  setStep,
  updateFormData,
} from "@/feature/slice/onboarding/onboardingSlice";
import { LeftArrowIcon } from "@/public/svgIcons/Icons";
import type { SelectProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

interface StepFourData {
  highest_degree: string;
  field_study: string;
  institution: string;
  graduation_year: string;
}

const degreeOptions: SelectProps["options"] = [
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

const fieldOfStudyOptions: SelectProps["options"] = [
  {
    label: "Psychology",
    options: [
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
      { value: "Other", label: "Other" },
    ],
  },
];

const yearOptions: SelectProps["options"] = Array.from(
  { length: 18 },
  (_, index) => {
    const year = 2010 + index;
    return { value: String(year), label: String(year) };
  },
);

function page() {
  const stepFourData = useSelector((state: any) => state.onboarding.formData);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepFourData>({
    defaultValues: {
      highest_degree: stepFourData?.highest_degree || "",
      field_study: stepFourData?.field_study || "",
      institution: stepFourData?.institution || "",
      graduation_year: stepFourData?.graduation_year || "",
    },
  });

  const onSubmit = (data: StepFourData) => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(updateFormData(data));
      dispatch(setStep(5));
      router.push("/onboarding/step-five");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-[638px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/onboarding/step-three"
          className="flex items-center text-sm font-medium text-headerColor"
        >
          <LeftArrowIcon />
          Back
        </Link>
        <p className="text-sm font-medium text-headerColor">Step 4/7</p>
      </div>

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
              Highest Degree Completed <span className="text-redColor">*</span>
            </label>
            <Controller
              name="highest_degree"
              control={control}
              rules={{ required: "Highest degree is required" }}
              render={({ field }) => (
                <SmartSelectField
                  placeholder="Select degree"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={degreeOptions}
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
                <SmartSelectField
                  placeholder="Select field of study"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={fieldOfStudyOptions}
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

          <ReusableInput
            id="institution"
            label="Current/Last Institution"
            placeholder="Stanford University"
            {...register("institution")}
            className="rounded-md"
          />

          <div className="space-y-1.5">
            <label className="text-sm text-headerColor font-medium block">
              Completed Graduation/ Expected Year{" "}
              <span className="text-redColor">*</span>
            </label>
            <Controller
              name="graduation_year"
              control={control}
              rules={{ required: "Graduation year is required" }}
              render={({ field }) => (
                <SmartSelectField
                  placeholder="Select year"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={yearOptions}
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
