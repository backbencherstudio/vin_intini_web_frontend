"use client";
import ButtonReuseable from "@/components/reusable/CustomButton";
import { setStepData } from "@/feature/slice/onboarding/onboardingSlice";
import {
  ClinicalIcon,
  LeftArrowIcon,
  ProfessionalIcon,
  ResearcherIcon,
  StudentIcon,
} from "@/public/svgIcons/Icons";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

interface RoleOption {
  id: number;
  title: string;
  subtitle: string;
  Icon: ComponentType<{ className?: string }>;
}

function page() {
  const stepThreeData = useSelector((state: any) => state.onboarding.stepThree);

  const roleOptions: RoleOption[] = [
    {
      id: 1,
      title: "Student",
      subtitle: "Undergrad/grad exploring psych/neuro paths, etc.",
      Icon: StudentIcon,
    },
    {
      id: 2,
      title: "Early-Career Professional",
      subtitle: "Postdoc, entry-level clinician, etc.",
      Icon: ProfessionalIcon,
    },
    {
      id: 3,
      title: "Researcher/ Academic",
      subtitle: "Professor, Lab Director, etc.",
      Icon: ResearcherIcon,
    },
    {
      id: 4,
      title: "Clinical Professional",
      subtitle: "Psychologist, Psychiatrist, Neurologist, Neurosurgeon, etc.",
      Icon: ClinicalIcon,
    },
  ];
  const initialSelectedOptions = useMemo(() => {
    const selectedTitles: string[] = stepThreeData?.selectedTitles || [];
    return roleOptions.filter((option) =>
      selectedTitles.includes(option.title),
    );
  }, [stepThreeData]);

  const [selectedOptions, setSelectedOptions] = useState<RoleOption[]>(
    initialSelectedOptions,
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const selectedTitles: string[] = stepThreeData?.selectedTitles || [];
    setSelectedOptions(
      roleOptions.filter((option) => selectedTitles.includes(option.title)),
    );
  }, [stepThreeData]);

  const toggleSelection = (option: RoleOption) => {
    setSelectedOptions((previous) => {
      const alreadySelected = previous.some((item) => item.id === option.id);
      if (alreadySelected) {
        return previous.filter((item) => item.id !== option.id);
      }
      return [...previous, option];
    });
  };

  const handleContinue = () => {
    if (selectedOptions.length === 0) return;

    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        setStepData({
          step: "stepThree",
          data: {
            selectedTitles: selectedOptions.map((item) => item.title),
          },
        }),
      );
        router.push("/onboarding/step-four");
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className="max-w-[638px] mx-auto ">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/onboarding/step-two"
          className="flex items-center text-sm font-medium text-headerColor"
        >
          <LeftArrowIcon />
          Back
        </Link>
        <p className="text-sm font-medium text-headerColor">Step 3/7</p>
      </div>
      <OnboardingWrapper
        title="Welcome to Mind Unite!"
        description="Select all that apply."
      >
        <div className="mt-7 lg:mt-10 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roleOptions.map((option) => {
              const isSelected = selectedOptions.some(
                (item) => item.id === option.id,
              );
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSelection(option)}
                  className={`w-full text-left hover:shadow-md p-4 border cursor-pointer flex-col flex justify-start rounded-lg transition-colors ${
                    isSelected
                      ? "border-buttonColor bg-buttonColor/8! ring-2 ring-buttonColor/20"
                      : "border-borderColor bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-md bg-primaryColor/10 flex items-center justify-center shrink-0 mt-0.5">
                      <option.Icon className="w-5 h-5 text-primaryColor" />
                    </div>
                    <div>
                      <p className="text-lg leading-[140%] font-semibold text-headerColor">
                        {option.title}
                      </p>
                      <p className="text-sm text-descriptionColor mt-1 leading-5">
                        {option.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <ButtonReuseable
            type="button"
            onClick={handleContinue}
            loading={isLoading}
            sendingMsg="Connecting..."
            title="Continue"
            disabled={selectedOptions.length === 0}
            className="w-full lg:py-4!"
          />
        </div>
      </OnboardingWrapper>
    </div>
  );
}

export default page;
