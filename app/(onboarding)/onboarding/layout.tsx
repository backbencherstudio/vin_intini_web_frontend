"use client";

import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { LeftArrowIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const stepPathMap: Record<number, string> = {
  1: "/onboarding",
  2: "/onboarding/step-two",
  3: "/onboarding/step-three",
  4: "/onboarding/step-four",
  5: "/onboarding/step-five",
  6: "/onboarding/step-six",
  7: "/onboarding/step-seven",
};

const pathStepMap: Record<string, number> = {
  "/onboarding": 1,
  "/onboarding/step-two": 2,
  "/onboarding/step-three": 3,
  "/onboarding/step-four": 4,
  "/onboarding/step-five": 5,
  "/onboarding/step-six": 6,
  "/onboarding/step-seven": 7,
};

function OnboardingGuardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentStep = useSelector(
    (state: any) => state.onboarding.currentStep || 1,
  );
  const { data: userProfile } = useGetUserProfileQuery("user");
  const isOnboarded = Boolean(userProfile?.is_onboarding);
  const requiredStep = pathStepMap[pathname];
  const activeStep = requiredStep ?? currentStep;
  const isStepOutOfOrder = Boolean(requiredStep && requiredStep > currentStep);

  useEffect(() => {
    if (isOnboarded) {
      router.replace("/mu/home");
      return;
    }

    if (!requiredStep) return;

    if (requiredStep > currentStep) {
      const fallbackPath = stepPathMap[currentStep] || "/onboarding";
      router.replace(fallbackPath);
    }
  }, [isOnboarded, pathname, requiredStep, currentStep, router]);

  if (isOnboarded || isStepOutOfOrder) {
    return null;
  }

  return (
    <>
      <div
        className={`${activeStep == 4 || activeStep == 3 || activeStep == 7 || activeStep == 5 ? "max-w-159.5" : "max-w-133"} mx-auto px-4 py-8`}
      >
        <div
          className={`flex items-center ${activeStep == 1 ? "justify-end" : "justify-between"}  mb-4`}
        >
          {activeStep > 1 && (
            <Link
              href={stepPathMap[activeStep - 1] || "/onboarding"}
              className="flex items-center text-sm font-medium text-headerColor"
            >
              <LeftArrowIcon />
              Back
            </Link>
          )}
          <p className="text-sm font-medium text-headerColor">
            Step {activeStep}/7
          </p>
        </div>
        {children}
      </div>
    </>
  );
}

export default OnboardingGuardLayout;
