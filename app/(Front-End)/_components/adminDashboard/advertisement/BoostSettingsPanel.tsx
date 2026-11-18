"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Info, RotateCcw } from "lucide-react";
import {
  BoostSettings,
  useGetBoostSettingsQuery,
  useUpdateBoostSettingsMutation,
} from "@/feature/slice/admin/boost/boostApi";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import AdminSelect from "@/components/reusable/dashboard/AdminSelect";
import CustomSwitch from "@/components/reusable/dashboard/CustomSwitch";

const defaultSettings: BoostSettings = {
  custom_slider: {
    enabled: true,
    daily_rate: 3,
    currency: "USD",
    min_days: 3,
    max_days: 60,
    daily_estimated_impressions_min: 700,
    daily_estimated_impressions_max: 1400,
  },
  new_release: { hours: 24 },
  pause_policy: { max_days: 30, first_reminder_days: 27, final_reminder_days: 29 },
  newsfeed_ads: {
    enabled: true,
    min_posts_before_ad: 4,
    first_ad_slot: 4,
    ad_interval: 5,
    max_ads_per_page: 2,
    max_daily_impressions_per_user: 3,
  },
};

export default function BoostSettingsPanel({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { data, isLoading, isError } = useGetBoostSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateBoostSettingsMutation();
  const [settings, setSettings] = useState<BoostSettings>(defaultSettings);

  useEffect(() => {
    if (!data?.data) return;
    const current = data.data;
    const positiveNumber = (value: unknown, fallback: number) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };
    setSettings({
      custom_slider: {
        enabled:
          current.custom_slider?.enabled ??
          defaultSettings.custom_slider.enabled,
        daily_rate: positiveNumber(
          current.custom_slider?.daily_rate,
          defaultSettings.custom_slider.daily_rate,
        ),
        currency: "USD",
        min_days: positiveNumber(
          current.custom_slider?.min_days,
          defaultSettings.custom_slider.min_days,
        ),
        max_days: positiveNumber(
          current.custom_slider?.max_days,
          defaultSettings.custom_slider.max_days,
        ),
        daily_estimated_impressions_min: positiveNumber(
          current.custom_slider?.daily_estimated_impressions_min,
          defaultSettings.custom_slider.daily_estimated_impressions_min,
        ),
        daily_estimated_impressions_max: positiveNumber(
          current.custom_slider?.daily_estimated_impressions_max,
          defaultSettings.custom_slider.daily_estimated_impressions_max,
        ),
      },
      new_release: {
        hours: Number.isFinite(Number(current.new_release?.hours))
          ? Number(current.new_release.hours)
          : defaultSettings.new_release.hours,
      },
      pause_policy: {
        max_days: positiveNumber(
          current.pause_policy?.max_days,
          defaultSettings.pause_policy.max_days,
        ),
        first_reminder_days: positiveNumber(
          current.pause_policy?.first_reminder_days,
          defaultSettings.pause_policy.first_reminder_days,
        ),
        final_reminder_days: positiveNumber(
          current.pause_policy?.final_reminder_days,
          defaultSettings.pause_policy.final_reminder_days,
        ),
      },
      newsfeed_ads: {
        enabled:
          current.newsfeed_ads?.enabled ?? defaultSettings.newsfeed_ads.enabled,
        min_posts_before_ad: positiveNumber(
          current.newsfeed_ads?.min_posts_before_ad,
          defaultSettings.newsfeed_ads.min_posts_before_ad,
        ),
        first_ad_slot: positiveNumber(
          current.newsfeed_ads?.first_ad_slot,
          defaultSettings.newsfeed_ads.first_ad_slot,
        ),
        ad_interval: positiveNumber(
          current.newsfeed_ads?.ad_interval,
          defaultSettings.newsfeed_ads.ad_interval,
        ),
        max_ads_per_page: positiveNumber(
          current.newsfeed_ads?.max_ads_per_page,
          defaultSettings.newsfeed_ads.max_ads_per_page,
        ),
        max_daily_impressions_per_user: positiveNumber(
          current.newsfeed_ads?.max_daily_impressions_per_user,
          defaultSettings.newsfeed_ads.max_daily_impressions_per_user,
        ),
      },
    });
  }, [data]);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateSettings({
        ...settings,
        custom_slider: {
          ...settings.custom_slider,
          currency: "USD",
        },
        newsfeed_min_posts: settings.newsfeed_ads.min_posts_before_ad,
        newsfeed_max_ads_per_page: settings.newsfeed_ads.max_ads_per_page,
      }).unwrap();
      toast.success("Boost settings saved");
    } catch {
      toast.error("Could not save boost settings");
    }
  };

  const numberField = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    helperText: string,
    min = 0,
    step = 1,
  ) => (
    <CustomInput
      label={label}
      helperText={helperText}
      type="number"
      min={min}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );

  const toggle = (
    label: string,
    value: boolean,
    onChange: (value: boolean) => void,
  ) => <CustomSwitch label={label} checked={value} onChange={onChange} />;

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">Loading boost settings…</div>
    );
  }
  if (isError) {
    return (
      <div className="p-4 text-sm text-red-700">
        Boost settings could not be loaded.
      </div>
    );
  }

  const {
    enabled: newsfeedEnabled,
    min_posts_before_ad: minPosts,
    first_ad_slot: firstSlot,
    ad_interval: interval,
    max_ads_per_page: maxAds,
    max_daily_impressions_per_user: dailyCap,
  } = settings.newsfeed_ads;

  const effectiveMinPosts = Math.max(minPosts, firstSlot);
  const secondSlot = firstSlot + interval;

  return (
    <form
      onSubmit={save}
      className={
        embedded
          ? "space-y-4 px-2"
          : "space-y-4 rounded-xl border border-gray-200 bg-white p-5"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {!embedded && (
            <h2 className="text-lg font-semibold text-headerColor">
              Boost system settings
            </h2>
          )}
          <p className="mt-0.5 text-sm text-gray-500">
            Control custom boost pricing, new release perks, pause limits, and
            how sponsored ads appear in the newsfeed.
          </p>
        </div>
        <button
          disabled={isSaving}
          className="h-10 rounded-lg bg-primaryColor px-5 text-sm font-medium text-white hover:bg-[#038a9c] disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save settings"}
        </button>
      </div>

      <div className="grid gap-4 border-t border-gray-100 pt-4 lg:grid-cols-2">
        {/* Section 1: Custom Boost Slider */}
        <section className="space-y-3.5 rounded-xl border border-gray-200/70 bg-gray-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Custom Boost Package
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Flexible pay-per-day boost package where advertisers pick their
                own duration via slider (web Stripe checkout).
              </p>
            </div>
            {toggle(
              settings.custom_slider.enabled ? "Enabled" : "Disabled",
              settings.custom_slider.enabled,
              (enabled) =>
                setSettings({
                  ...settings,
                  custom_slider: { ...settings.custom_slider, enabled },
                }),
            )}
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {numberField(
              "Daily rate ($)",
              settings.custom_slider.daily_rate,
              (daily_rate) =>
                setSettings({
                  ...settings,
                  custom_slider: { ...settings.custom_slider, daily_rate },
                }),
              "Price charged per day (total = daily rate × days).",
              0.01,
              0.01,
            )}
            {numberField(
              "Minimum days",
              settings.custom_slider.min_days,
              (min_days) =>
                setSettings({
                  ...settings,
                  custom_slider: { ...settings.custom_slider, min_days },
                }),
              "Shortest duration users can pick on the slider.",
              1,
            )}
            {numberField(
              "Maximum days",
              settings.custom_slider.max_days,
              (max_days) =>
                setSettings({
                  ...settings,
                  custom_slider: { ...settings.custom_slider, max_days },
                }),
              "Longest duration users can pick on the slider.",
              1,
            )}
            {numberField(
              "Min. daily impressions",
              settings.custom_slider.daily_estimated_impressions_min,
              (daily_estimated_impressions_min) =>
                setSettings({
                  ...settings,
                  custom_slider: {
                    ...settings.custom_slider,
                    daily_estimated_impressions_min,
                  },
                }),
              "Lower reach estimate per day (multiplied by days).",
              1,
            )}
            {numberField(
              "Max. daily impressions",
              settings.custom_slider.daily_estimated_impressions_max,
              (daily_estimated_impressions_max) =>
                setSettings({
                  ...settings,
                  custom_slider: {
                    ...settings.custom_slider,
                    daily_estimated_impressions_max,
                  },
                }),
              "Upper reach estimate per day (multiplied by days).",
              1,
            )}
            <AdminSelect
              label="Currency"
              value="USD"
              disabled
              helperText="Locked to USD (Stripe checkout currency)."
            >
              <option value="USD">USD</option>
            </AdminSelect>
          </div>
        </section>

        {/* Section 2: Release & Pause Policy */}
        <section className="space-y-3.5 rounded-xl border border-gray-200/70 bg-gray-50/70 p-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Release and pause policy
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Controls free "New Release" visibility for newly published
              products and auto-expiry rules for paused campaigns.
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {numberField(
              "New release window (hours)",
              settings.new_release.hours,
              (hours) => setSettings({ ...settings, new_release: { hours } }),
              "Free featured priority after publishing a product (0 = off).",
              0,
            )}
            {numberField(
              "Maximum pause (days)",
              settings.pause_policy.max_days,
              (max_days) =>
                setSettings({
                  ...settings,
                  pause_policy: { ...settings.pause_policy, max_days },
                }),
              "Auto-completes a campaign if left paused this many days.",
              1,
            )}
            {numberField(
              "First reminder (days)",
              settings.pause_policy.first_reminder_days,
              (first_reminder_days) =>
                setSettings({
                  ...settings,
                  pause_policy: {
                    ...settings.pause_policy,
                    first_reminder_days,
                  },
                }),
              "Sends 1st email reminder after this many paused days.",
              1,
            )}
            {numberField(
              "Final reminder (days)",
              settings.pause_policy.final_reminder_days,
              (final_reminder_days) =>
                setSettings({
                  ...settings,
                  pause_policy: {
                    ...settings.pause_policy,
                    final_reminder_days,
                  },
                }),
              "Sends final warning email before auto-expiry.",
              1,
            )}
          </div>
        </section>

        {/* Section 3: Newsfeed Ad Placement */}
        <section className="space-y-4 rounded-xl border border-gray-200/70 bg-gray-50/70 p-4 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Newsfeed ad placement
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Controls where and how often sponsored product ads are inserted
                between organic posts in the Main Newsfeed.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    newsfeed_ads: { ...defaultSettings.newsfeed_ads },
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset defaults
              </button>
              {toggle(
                newsfeedEnabled ? "Newsfeed ads enabled" : "Newsfeed ads off",
                newsfeedEnabled,
                (enabled) =>
                  setSettings({
                    ...settings,
                    newsfeed_ads: { ...settings.newsfeed_ads, enabled },
                  }),
              )}
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-5">
            {numberField(
              "Minimum posts required",
              settings.newsfeed_ads.min_posts_before_ad,
              (min_posts_before_ad) =>
                setSettings({
                  ...settings,
                  newsfeed_ads: {
                    ...settings.newsfeed_ads,
                    min_posts_before_ad,
                  },
                }),
              "Don't show any ads if a feed page has fewer posts than this.",
              1,
            )}
            {numberField(
              "First ad position",
              settings.newsfeed_ads.first_ad_slot,
              (first_ad_slot) =>
                setSettings({
                  ...settings,
                  newsfeed_ads: { ...settings.newsfeed_ads, first_ad_slot },
                }),
              `Insert 1st ad after ${firstSlot} organic posts (slot #${firstSlot + 1}).`,
              1,
            )}
            {numberField(
              "Posts between ads",
              settings.newsfeed_ads.ad_interval,
              (ad_interval) =>
                setSettings({
                  ...settings,
                  newsfeed_ads: { ...settings.newsfeed_ads, ad_interval },
                }),
              `Show next ad after every ${interval} organic posts.`,
              1,
            )}
            {numberField(
              "Max ads per page",
              settings.newsfeed_ads.max_ads_per_page,
              (max_ads_per_page) =>
                setSettings({
                  ...settings,
                  newsfeed_ads: { ...settings.newsfeed_ads, max_ads_per_page },
                }),
              "Upper limit of ads injected in one feed page load.",
              1,
            )}
            {numberField(
              "Daily cap per user",
              settings.newsfeed_ads.max_daily_impressions_per_user,
              (max_daily_impressions_per_user) =>
                setSettings({
                  ...settings,
                  newsfeed_ads: {
                    ...settings.newsfeed_ads,
                    max_daily_impressions_per_user,
                  },
                }),
              "Max times one user sees the same ad per day.",
              1,
            )}
          </div>

          {/* Live Plain-English Summary of Current Rules */}
          <div className="flex items-start gap-2.5 rounded-lg border border-teal-100 bg-teal-50/60 px-3.5 py-2.5 text-xs text-teal-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primaryColor" />
            <div className="space-y-1">
              {newsfeedEnabled ? (
                <p>
                  <span className="font-semibold">Live rule preview:</span> A
                  feed page needs at least{" "}
                  <span className="font-semibold">
                    {effectiveMinPosts} posts
                  </span>
                  . <span className="font-semibold">Ad #1</span> appears after
                  post #{firstSlot}
                  {maxAds > 1 ? (
                    <>
                      , <span className="font-semibold">Ad #2</span> after post
                      #{secondSlot} (every {interval} posts)
                    </>
                  ) : null}
                  , up to{" "}
                  <span className="font-semibold">
                    {maxAds} {maxAds === 1 ? "ad" : "ads"}/page
                  </span>
                  . Each user sees the same campaign at most{" "}
                  <span className="font-semibold">{dailyCap}×/day</span>.
                </p>
              ) : (
                <p>
                  <span className="font-semibold">Newsfeed ads are paused:</span>{" "}
                  No sponsored product cards will be inserted in the Main
                  Newsfeed until re-enabled.
                </p>
              )}
              {newsfeedEnabled && minPosts < firstSlot && (
                <p className="text-amber-700">
                  Tip: Minimum posts required ({minPosts}) is lower than First
                  ad position ({firstSlot}), so ads still won&apos;t appear
                  until a page has at least {firstSlot} posts.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
