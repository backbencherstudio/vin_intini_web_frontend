"use client";

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
  7: "/onboarding/step-six",
};

const pathStepMap: Record<string, number> = {
  "/onboarding": 1,
  "/onboarding/step-two": 2,
  "/onboarding/step-three": 3,
  "/onboarding/step-four": 4,
  "/onboarding/step-five": 5,
  "/onboarding/step-six": 6,
};

function OnboardingGuardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentStep = useSelector(
    (state: any) => state.onboarding.currentStep || 1,
  );

  useEffect(() => {
    const requiredStep = pathStepMap[pathname];
    if (!requiredStep) return;

    if (requiredStep > currentStep) {
      const fallbackPath = stepPathMap[currentStep] || "/onboarding";
      router.replace(fallbackPath);
    }
  }, [pathname, currentStep, router]);

  return <>{children}</>;
}

export default OnboardingGuardLayout;
