"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import { setStepData } from "@/feature/slice/onboarding/onboardingSlice";
import {
  LeftArrowIcon,
  UploadIcon,
  UploadUserIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

interface StepSixData {
  title: string;
  about: string;
  photo: string;
}

function page() {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const stepSixData = useSelector((state: any) => state.onboarding.stepSix);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>(
    stepSixData?.photo || "",
  );

  const {
    control,
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<StepSixData>({
    defaultValues: {
      title: stepSixData?.title || "",
      about: stepSixData?.about || "",
      photo: stepSixData?.photo || "",
    },
  });

  const titleValue = watch("title") || "";
  const aboutValue = watch("about") || "";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidType = ["image/jpeg", "image/png", "image/gif"].includes(
      file.type,
    );

    if (!isValidType) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      setPhotoPreview(result);
      setValue("photo", result, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: StepSixData) => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        setStepData({
          step: "stepSix",
          data,
        }),
      );
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-[532px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/onboarding/step-five"
          className="flex items-center text-sm font-medium text-headerColor"
        >
          <LeftArrowIcon />
          Back
        </Link>
        <p className="text-sm font-medium text-headerColor">Step 6/7</p>
      </div>

      <OnboardingWrapper
        title="Build Your Profile"
        description="Add a photo and bio for your profile."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 lg:mt-10 space-y-5"
        >
          <div>
            <label className="text-sm text-headerColor font-semibold block mb-2">
              Profile Photo
            </label>

            <div className="flex items-center gap-3">
              <div className="w-[74px] h-[74px] rounded-full bg-[#E7E8EC] flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Profile preview"
                    width={74}
                    height={74}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UploadUserIcon className="w-8 h-8 text-[#757A86]" />
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="h-10 px-5 rounded-full border border-borderColor flex items-center gap-2 text-sm font-semibold text-descriptionColor cursor-pointer"
                >
                  <UploadIcon className="w-4 h-4 " />
                  Upload Photo
                </button>
                <p className="text-sm text-grayColor1 mt-1.5">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />

            <input type="hidden" {...register("photo")} />
          </div>

          <div>
            <ReusableInput
              id="title"
              label="Title"
              required
              maxLength={120}
              placeholder="Clinical Psychologist | Trauma Specialist | Arizona"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 120,
                  message: "Title cannot exceed 120 characters",
                },
              })}
              className="rounded-md"
              error={errors.title?.message}
            />
            <p className="text-sm text-grayColor1 mt-1.5">
              {titleValue.length}/120 characters
            </p>
          </div>

          <div>
            <label className="text-sm text-headerColor font-medium block mb-1.5">
              About
            </label>
            <Controller
              control={control}
              name="about"
              rules={{
                maxLength: {
                  value: 250,
                  message: "About cannot exceed 250 characters",
                },
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={5}
                  maxLength={250}
                  placeholder="Tell us about your background, interests and profile summary."
                  className="w-full rounded-md border border-borderColor px-3 py-2.5 text-base text-headerColor placeholder:text-grayColor1 focus:outline-none focus:ring-2 focus:ring-primaryColor/20"
                />
              )}
            />
            {errors.about?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.about.message}
              </p>
            )}
            <p className="text-sm text-grayColor1 mt-1.5">
              {aboutValue.length}/250 characters
            </p>
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
