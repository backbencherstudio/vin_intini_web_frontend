"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import { useProfileSetupMutation } from "@/feature/slice/auth/authSlice";
import { UploadIcon, UploadUserIcon } from "@/public/svgIcons/Icons";

import {
  setStep,
  updateFormData,
} from "@/feature/slice/onboarding/onboardingSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

interface StepSixData {
  title: string;
  about: string;
}

function page() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const stepSixData = useSelector((state: any) => state.onboarding.formData);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(
    stepSixData?.profile_image || "",
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [profileSetup, { isLoading }] = useProfileSetupMutation();
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<StepSixData>({
    defaultValues: {
      title: stepSixData?.title || "",
      about: stepSixData?.about || "",
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
      return toast.error(
        "Invalid file type. Please upload a JPG, PNG, or GIF file.",
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size must be less than 5MB");
    }

    setSelectedImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const onSubmit = async (data: StepSixData) => {
    try {
      const formData = new FormData();

      Object.entries(stepSixData || {}).forEach(([key, value]) => {
        if (key === "profile_image") return;
        if (value === undefined || value === null) return;
        formData.append(key, String(value));
      });

      formData.set("title", data.title);
      formData.set("about", data.about || "");

      if (selectedImageFile) {
        formData.set("profile_image", selectedImageFile);
      }

      const response = await profileSetup(formData).unwrap();
      if (response.status) {
        // Handle success (e.g., navigate to next step)
        toast.success(response?.message || "Profile setup successful!");
        dispatch(setStep(7));
        dispatch(
          updateFormData({
            title: data.title,
            about: data.about,
            profile_image: photoPreview,
          }),
        );

        router.push("/onboarding/step-seven");
      }
    } catch (error) {
      console.error("Error setting up profile:", error);
      toast.error(error?.message || "Failed to set up profile.");
    }
  };

  return (
    <div className="">
      <OnboardingWrapper
        title="Build Your Profile"
        description="Add a photo and bio for your profile."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 lg:mt-10 space-y-5"
        >
          <div>
            <label className="text-sm text-descriptionColor font-semibold block mb-2">
              Profile Photo
            </label>

            <div className="flex items-center gap-3">
              <div className="w-[74px] h-[74px] rounded-full bg-bgColor flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Profile preview"
                    width={74}
                    height={74}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UploadUserIcon className="w-8 h-8 text-descriptionColor" />
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="h-10 px-5 rounded-full border border-borderColor flex items-center gap-2 text-sm font-semibold text-descriptionColor! cursor-pointer"
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
                <ReusableTextarea
                  label="About"
                  {...field}
                  rows={5}
                  maxLength={250}
                  placeholder="Tell us about your background, interests and profile summary."
                  className="w-full rounded-md border border-borderColor px-3 py-2.5 text-base text-headerColor placeholder:text-grayColor1 focus:outline-none "
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
