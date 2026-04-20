"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { Switch } from "@/components/ui/switch";
import { onboardingReset } from "@/feature/slice/onboarding/onboardingSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import {
  ClinicalIcon,
  EmailIcon,
  PhsychologicalIcon,
  PremiumIcon,
  ProgramIcon,
  PublicationIcon,
} from "@/public/svgIcons/Icons";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

interface FollowOption {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const notificationLabels: Array<{
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = [
  {
    key: "new_jobs",
    icon: EmailIcon,
    label: "Email me about new jobs in my field",
  },
  {
    key: "publications_alerts",
    icon: PublicationIcon,
    label: "Latest publications and research alerts",
  },
  {
    key: "program_updates",
    icon: ProgramIcon,
    label: "Program and residency updates",
  },
  {
    key: "premium_offers",
    icon: PremiumIcon,
    label: "Premium features and special offers",
  },
];

const followOptions: FollowOption[] = [
  {
    id: 1,
    title: "American Psychological Association",
    subtitle: "Organization",
    icon: PhsychologicalIcon,
  },
  {
    id: 2,
    title: "Psychological Review",
    subtitle: "Journal",
    icon: PhsychologicalIcon,
  },
  {
    id: 3,
    title: "Neuroscience Today",
    subtitle: "Publication",
    icon: ClinicalIcon,
  },
  {
    id: 4,
    title: "Pfizer Neuroscience",
    subtitle: "Industry Partner",
    icon: ClinicalIcon,
  },
  {
    id: 5,
    title: "Clinical Psychology Network",
    subtitle: "Community",
    icon: PhsychologicalIcon,
  },
];

function page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const stepSevenData = useSelector((state: any) => state.onboarding.formData);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useGetUserProfileQuery("profile-data");
  const defaultPreferences = useMemo(
    () => ({
      new_jobs: stepSevenData?.notification_preferences?.new_jobs ?? true,
      publications_alerts:
        stepSevenData?.notification_preferences?.publications_alerts ?? true,
      program_updates:
        stepSevenData?.notification_preferences?.program_updates ?? true,
      premium_offers:
        stepSevenData?.notification_preferences?.premium_offers ?? true,
    }),
    [stepSevenData],
  );

  const [notificationPreferences, setNotificationPreferences] =
    useState(defaultPreferences);

  const defaultFollowedIds = useMemo(() => {
    const values = stepSevenData?.followed_entities;
    if (!Array.isArray(values)) {
      return []; // Return empty array if values is not an array
    }

    return followOptions
      .filter((item) => values.includes(item.title))
      .map((item) => item.id);
  }, [stepSevenData]);

  const [selectedFollowIds, setSelectedFollowIds] =
    useState<number[]>(defaultFollowedIds);

  const handleToggleFollow = (id: number) => {
    setSelectedFollowIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }
      return [...previous, id];
    });
  };

  const handleFinish = () => {
    setIsLoading(true);

    router.push(`/mu/${data?.user?.id}`);
    setTimeout(() => {
      dispatch(onboardingReset());
      setIsLoading(false);
    }, 500);
  };

  console.log("Step Seven Data from Redux:", data); // Debugging log

  return (
    <div>
      <OnboardingWrapper
        title="Let's Get You Started"
        description="Customize your experience on Mind Unite."
      >
        <div className="mt-6 md:mt-10 space-y-6 md:space-y-7">
          <div>
            <h3 className="text-base font-semibold text-headerColor">
              Notification Preferences
            </h3>

            <div className="mt-2 divide-y divide-borderColor/80">
              {notificationLabels.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-3 pb-4"
                >
                  <div className="text-sm flex items-center gap-2 md:text-[15px] text-descriptionColor">
                    <item.icon className="h-4 w-4  " />
                    <span> {item.label}</span>
                  </div>

                  <Switch
                    checked={notificationPreferences[item.key]}
                    onCheckedChange={(checked) =>
                      setNotificationPreferences((previous) => ({
                        ...previous,
                        [item.key]: checked,
                      }))
                    }
                    className="cursor-pointer"
                    aria-label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-descriptionColor">
              Follow to Get Started
              <span className="ml-1 text-sm font-normal text-[#A5A5AB]">
                (Optional)
              </span>
            </h3>

            <div className="mt-3 flex flex-col gap-3 ">
              {followOptions.map((option) => {
                const isSelected = selectedFollowIds.includes(option.id);
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggleFollow(option.id)}
                    className={`w-full rounded-lg  border px-3.5 py-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-buttonColor bg-buttonColor/10 ring-2 ring-buttonColor/20"
                        : "border-[#dde4e8] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#dff4f4] text-buttonColor">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-headerColor ">
                          {option.title}
                        </p>
                        <p className="text-xs text-grayColor1 mt-1 ">
                          {option.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <ButtonReuseable
            type="button"
            onClick={handleFinish}
            loading={isLoading}
            sendingMsg="Finishing..."
            title="Finish & Explore"
            className="w-full lg:py-4!"
          />
        </div>
      </OnboardingWrapper>
    </div>
  );
}

export default page;
