"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { Switch } from "@/components/ui/switch";
import {
  setStep,
  updateFormData,
} from "@/feature/slice/onboarding/onboardingSlice";
import {
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  FlaskConical,
  Network,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OnboardingWrapper from "../../_component/OnboardingWrapper";

type NotificationKey =
  | "new_jobs"
  | "publications_alerts"
  | "program_updates"
  | "premium_offers";

interface FollowOption {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const notificationLabels: Array<{ key: NotificationKey; label: string }> = [
  { key: "new_jobs", label: "Email me about new jobs in my field" },
  {
    key: "publications_alerts",
    label: "Latest publications and research alerts",
  },
  { key: "program_updates", label: "Program and residency updates" },
  { key: "premium_offers", label: "Premium features and special offers" },
];

const followOptions: FollowOption[] = [
  {
    id: 1,
    title: "American Psychological Association",
    subtitle: "Organization",
    icon: BriefcaseBusiness,
  },
  {
    id: 2,
    title: "Psychological Review",
    subtitle: "Journal",
    icon: BookOpenText,
  },
  {
    id: 3,
    title: "Neuroscience Today",
    subtitle: "Publication",
    icon: FlaskConical,
  },
  {
    id: 4,
    title: "Pfizer Neuroscience",
    subtitle: "Industry Partner",
    icon: Building2,
  },
  {
    id: 5,
    title: "Clinical Psychology Network",
    subtitle: "Community",
    icon: Network,
  },
];

function page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const stepSevenData = useSelector((state: any) => state.onboarding.formData);
  const [isLoading, setIsLoading] = useState(false);

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
      return [2, 4];
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

    setTimeout(() => {
      const selectedFollowTitles = followOptions
        .filter((item) => selectedFollowIds.includes(item.id))
        .map((item) => item.title);

      dispatch(
        updateFormData({
          notification_preferences: notificationPreferences,
          followed_entities: selectedFollowTitles,
        }),
      );

      dispatch(setStep(7));
      router.push("/");
      setIsLoading(false);
    }, 900);
  };

  return (
    <div>
      <OnboardingWrapper
        title="Let's Get You Started"
        description="Customize your experience on Mind Unite."
      >
        <div className="mt-6 space-y-6 md:space-y-7">
          <div>
            <h3 className="text-base font-semibold text-headerColor">
              Notification Preferences
            </h3>

            <div className="mt-2 divide-y divide-[#e3e7eb]">
              {notificationLabels.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <p className="text-sm md:text-[15px] text-headerColor/90">
                    {item.label}
                  </p>

                  <Switch
                    checked={notificationPreferences[item.key]}
                    onCheckedChange={(checked) =>
                      setNotificationPreferences((previous) => ({
                        ...previous,
                        [item.key]: checked,
                      }))
                    }
                    aria-label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-headerColor">
              Follow to Get Started
              <span className="ml-1 text-sm font-normal text-grayColor1">
                (Optional)
              </span>
            </h3>

            <div className="mt-3 space-y-2.5">
              {followOptions.map((option) => {
                const isSelected = selectedFollowIds.includes(option.id);
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggleFollow(option.id)}
                    className={`w-full rounded-lg border px-3.5 py-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-buttonColor bg-buttonColor/10"
                        : "border-[#dde4e8] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#dff4f4] text-buttonColor">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-headerColor leading-5">
                          {option.title}
                        </p>
                        <p className="text-xs text-grayColor1 mt-0.5">
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
