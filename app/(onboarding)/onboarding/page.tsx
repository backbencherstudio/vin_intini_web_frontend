"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import {
  setStep,
  updateFormData,
} from "@/feature/slice/onboarding/onboardingSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../_component/OnboardingWrapper";
interface StepOneData {
  first_name: string;
  last_name: string;
}
function page() {
  const onboardingData = useSelector(
    (state: any) => state.onboarding?.formData,
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepOneData>({
    defaultValues: {
      first_name: onboardingData?.first_name || "",
      last_name: onboardingData?.last_name || "",
    },
  });
  const router = useRouter();
  const dispatch = useDispatch();

  console.log(onboardingData, "onboardingData");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = (data: StepOneData) => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(updateFormData(data));
      dispatch(setStep(2));
      router.push("/onboarding/step-two");
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className="max-w-lg mx-auto ">
      <div className="flex items-center justify-end mb-4">
        <p className="text-sm font-medium text-headerColor">Step 1/7</p>
      </div>
      <OnboardingWrapper title="Tell us your name to personalize your profile">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 lg:mt-10 space-y-4"
        >
          <div>
            <ReusableInput
              id="first_name"
              label="First Name"
              required
              type="text"
              placeholder="Enter your first name"
              {...register("first_name", {
                required: "First name is required",
              })}
              className=" rounded-lg "
            />
          </div>

          <div>
            <ReusableInput
              id="last_name"
              label="Last Name"
              required
              type="text"
              placeholder="Enter your last name"
              {...register("last_name", {
                required: "Last name is required",
              })}
              className=" rounded-lg "
            />
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
