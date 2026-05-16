"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import {
  setStep,
  updateFormData,
} from "@/feature/slice/onboarding/onboardingSlice";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { countries } from "@/public/demoData/RealData";
import { LeftArrowIcon } from "@/public/svgIcons/Icons";

import Link from "next/link";
import { useRouter } from "next/navigation";
import OnboardingWrapper from "../../_component/OnboardingWrapper";
interface StepOneData {
  country: string;
  postal_code: string;
}
function page() {
  const onboardingData = useSelector(
    (state: any) => state.onboarding?.formData,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StepOneData>({
    defaultValues: {
      country: onboardingData?.country || "",
      postal_code: onboardingData?.postal_code || "",
    },
  });
  const router = useRouter();
  const dispatch = useDispatch();


  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = (data: StepOneData) => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(updateFormData(data));
      dispatch(setStep(3));
      router.push("/onboarding/step-three");
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className=" ">
      
      <OnboardingWrapper
        title={`Welcome, ${onboardingData?.first_name || "there"}!`}
        description="Tell us where you are from."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 lg:mt-10 space-y-4"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-headerColor">
              {" "}
              Country/Region <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="country"
              rules={{ required: "Country is required" }}
              render={({ field }) => {
                return (
                  <SelecteInputField
                    options={countries}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select country"
                  />
                );
              }}
            />
          </div>

          <div>
            <ReusableInput
              id="postal_code"
              label="Postal Code"
              required
              type="number"
              placeholder="Enter your postal code"
              {...register("postal_code", {
                required: "Postal code is required",
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
