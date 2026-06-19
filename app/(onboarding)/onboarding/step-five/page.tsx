"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  setStep,
  updateFormData,
} from "@/feature/slice/onboarding/onboardingSlice";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

interface InterestOption {
  id: number;
  title: string;
}
0
const interestOptions: InterestOption[] = [
  { id: 4, title: "Psychology" },
  { id: 5, title: "Neuroscience" },
  { id: 6, title: "Psychiatry" },
  { id: 7, title: "Counseling" },
  { id: 8, title: "Biotech" },
  { id: 9, title: "Psychotropics" },
  { id: 10, title: "Publications" },
  { id: 11, title: "Abnormal Psychology" },
  { id: 12, title: "Behavioral Psychology" },
  { id: 13, title: "Biopsychology" },
  { id: 14, title: "Clinical Psychology" },
  { id: 15, title: "Cognitive Psychology" },
  { id: 16, title: "Counseling Psychology" },
  { id: 17, title: "Developmental Psychology" },
  { id: 18, title: "Educational Psychology" },
  { id: 19, title: "Forensic Psychology" },
  { id: 20, title: "Health Psychology" },
  { id: 21, title: "Industrial Organizational Psychology" },
  { id: 22, title: "Personality Psychology" },
  { id: 23, title: "School Psychology" },
  { id: 24, title: "Social Psychology" },
  { id: 25, title: "Sport Psychology" },
  { id: 26, title: "Affective Neuroscience" },
  { id: 27, title: "Behavioral Neuroscience" },
  { id: 28, title: "Clinical Neuroscience" },
  { id: 29, title: "Cognitive Neuroscience" },
  { id: 30, title: "Computational Neuroscience" },
  { id: 31, title: "Developmental Neuroscience" },
  { id: 32, title: "Neuroanatomy" },
  { id: 33, title: "Neuroeconomics" },
  { id: 34, title: "Neuroengineering" },
  { id: 35, title: "Neurogenetics" },
  { id: 36, title: "Neuroimaging" },
  { id: 37, title: "Neurolinguistics" },
  { id: 38, title: "Neuropsychology" },
  { id: 39, title: "Neurophysiology" },
  { id: 40, title: "Psychopharmacology" },
];

function page() {
  const stepFiveData = useSelector((state: any) => state.onboarding.formData);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initialSelectedOptions = useMemo(() => {
    const interests: string[] = stepFiveData?.interests || [];
    return interestOptions.filter((option) => interests.includes(option.title));
  }, [stepFiveData]);

  const [selectedOptions, setSelectedOptions] = useState<InterestOption[]>(
    initialSelectedOptions,
  );

  useEffect(() => {
    const interests: string[] = stepFiveData?.interests || [];
    setSelectedOptions(
      interestOptions.filter((option) => interests.includes(option.title)),
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

    dispatch(
      updateFormData({
        interests: selectedOptions.map((item) => item.title).join(","),
      }),
    );
    dispatch(setStep(6));

    router.push("/onboarding/step-six");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="">
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
