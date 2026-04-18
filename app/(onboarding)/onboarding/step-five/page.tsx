"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { setStepData } from "@/feature/slice/onboarding/onboardingSlice";
import { LeftArrowIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

interface InterestOption {
  id: number;
  title: string;
}

const interestOptions: InterestOption[] = [
  { id: 1, title: "Psychiatry" },
  { id: 2, title: "Counseling Psychology" },
  { id: 3, title: "Abnormal Psychology" },
  { id: 4, title: "Personality Psychology" },
  { id: 5, title: "Behavioral Psychology" },
  { id: 6, title: "Biopsychology" },
  { id: 7, title: "School Psychology" },
  { id: 8, title: "Cognitive Neuroscience" },
  { id: 9, title: "Developmental Neuroscience" },
  { id: 10, title: "Affective Neuroscience" },
  { id: 11, title: "Computational Neuroscience" },
  { id: 12, title: "Clinical Neuroscience" },
  { id: 13, title: "Neuroengineering" },
  { id: 14, title: "Neurogenetics" },
  { id: 15, title: "Neurolinguistics" },
  { id: 16, title: "Neuroeconomics" },
  { id: 17, title: "Neuroanatomy" },
  { id: 18, title: "Neurophysiology" },
  { id: 19, title: "Clinical Psychology" },
  { id: 20, title: "Cognitive Psychology" },
  { id: 21, title: "Developmental Psychology" },
  { id: 22, title: "Educational Psychology" },
  { id: 23, title: "Forensic Psychology" },
  { id: 24, title: "Health Psychology" },
  { id: 25, title: "Behavioral Neuroscience" },
  { id: 26, title: "Industrial-Organizational Psychology" },
  { id: 27, title: "Neuroimaging" },
  { id: 28, title: "Sport Psychology" },
  { id: 29, title: "Psychopharmacology" },
  { id: 30, title: "Neuropsychology" },
  { id: 31, title: "Social Psychology" },
  { id: 32, title: "Neuroscience" },
  { id: 33, title: "Counseling" },
];

function page() {
  const stepFiveData = useSelector((state: any) => state.onboarding.stepFive);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const initialSelectedOptions = useMemo(() => {
    const selectedTitles: string[] = stepFiveData?.selectedTitles || [];
    return interestOptions.filter((option) =>
      selectedTitles.includes(option.title),
    );
  }, [stepFiveData]);

  const [selectedOptions, setSelectedOptions] = useState<InterestOption[]>(
    initialSelectedOptions,
  );

  useEffect(() => {
    const selectedTitles: string[] = stepFiveData?.selectedTitles || [];
    setSelectedOptions(
      interestOptions.filter((option) => selectedTitles.includes(option.title)),
    );
  }, [stepFiveData]);

  const toggleSelection = (option: InterestOption) => {
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
          step: "stepFive",
          data: {
            selectedTitles: selectedOptions.map((item) => item.title),
          },
        }),
      );
      router.push("/onboarding/step-six");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-[532px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/onboarding/step-four"
          className="flex items-center text-sm font-medium text-headerColor"
        >
          <LeftArrowIcon />
          Back
        </Link>
        <p className="text-sm font-medium text-headerColor">Step 5/7</p>
      </div>

      <OnboardingWrapper
        title="Your Brain Health Fields of Interest"
        description="Please select all that apply."
      >
        <div className="mt-7 lg:mt-10 space-y-5">
          <div className="flex flex-wrap gap-2.5">
            {interestOptions.map((option) => {
              const isSelected = selectedOptions.some(
                (item) => item.id === option.id,
              );

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSelection(option)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm md:text-base leading-5 transition-all ${
                    isSelected
                      ? "border-buttonColor bg-buttonColor/10 ring-2 ring-buttonColor/20"
                      : "border-borderColor bg-white text-headerColor"
                  }`}
                >
                  {option.title}
                </button>
              );
            })}
          </div>

          <ButtonReuseable
            type="button"
            onClick={handleContinue}
            loading={isLoading}
            sendingMsg="Saving..."
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
