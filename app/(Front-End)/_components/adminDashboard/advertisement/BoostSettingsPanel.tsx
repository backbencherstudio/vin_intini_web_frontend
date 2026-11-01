"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BoostSettings, useGetBoostSettingsQuery, useUpdateBoostSettingsMutation } from "@/feature/slice/admin/boost/boostApi";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import AdminSelect from "@/components/reusable/dashboard/AdminSelect";
import CustomSwitch from "@/components/reusable/dashboard/CustomSwitch";

const fallbackCurrencies = ["USD", "EUR", "GBP", "BDT", "CAD", "AUD", "INR", "JPY", "CNY"];
const currencyCodes = (() => {
  try {
    return typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("currency")
      : fallbackCurrencies;
  } catch {
    return fallbackCurrencies;
  }
})();
const defaultSettings: BoostSettings = {
  custom_slider: { enabled: true, daily_rate: 3, currency: "USD", min_days: 3, max_days: 60, daily_estimated_impressions_min: 700, daily_estimated_impressions_max: 1400 },
  new_release: { hours: 24 },
  pause_policy: { max_days: 30, first_reminder_days: 27, final_reminder_days: 29 },
  newsfeed_ads: { enabled: true, min_posts_before_ad: 3, first_ad_slot: 4, ad_interval: 8, max_ads_per_page: 2, max_daily_impressions_per_user: 5 },
};

export default function BoostSettingsPanel({ embedded = false }: { embedded?: boolean }) {
  const { data, isLoading, isError } = useGetBoostSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateBoostSettingsMutation();
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
        enabled: current.custom_slider?.enabled ?? defaultSettings.custom_slider.enabled,
        daily_rate: positiveNumber(current.custom_slider?.daily_rate, defaultSettings.custom_slider.daily_rate),
        currency: current.custom_slider?.currency?.trim() || defaultSettings.custom_slider.currency,
        min_days: positiveNumber(current.custom_slider?.min_days, defaultSettings.custom_slider.min_days),
        max_days: positiveNumber(current.custom_slider?.max_days, defaultSettings.custom_slider.max_days),
        daily_estimated_impressions_min: positiveNumber(current.custom_slider?.daily_estimated_impressions_min, defaultSettings.custom_slider.daily_estimated_impressions_min),
        daily_estimated_impressions_max: positiveNumber(current.custom_slider?.daily_estimated_impressions_max, defaultSettings.custom_slider.daily_estimated_impressions_max),
      },
      new_release: { hours: Number.isFinite(Number(current.new_release?.hours)) ? Number(current.new_release.hours) : defaultSettings.new_release.hours },
      pause_policy: {
        max_days: positiveNumber(current.pause_policy?.max_days, defaultSettings.pause_policy.max_days),
        first_reminder_days: positiveNumber(current.pause_policy?.first_reminder_days, defaultSettings.pause_policy.first_reminder_days),
        final_reminder_days: positiveNumber(current.pause_policy?.final_reminder_days, defaultSettings.pause_policy.final_reminder_days),
      },
      newsfeed_ads: {
        enabled: current.newsfeed_ads?.enabled ?? defaultSettings.newsfeed_ads.enabled,
        min_posts_before_ad: positiveNumber(current.newsfeed_ads?.min_posts_before_ad, defaultSettings.newsfeed_ads.min_posts_before_ad),
        first_ad_slot: positiveNumber(current.newsfeed_ads?.first_ad_slot, defaultSettings.newsfeed_ads.first_ad_slot),
        ad_interval: positiveNumber(current.newsfeed_ads?.ad_interval, defaultSettings.newsfeed_ads.ad_interval),
        max_ads_per_page: positiveNumber(current.newsfeed_ads?.max_ads_per_page, defaultSettings.newsfeed_ads.max_ads_per_page),
        max_daily_impressions_per_user: positiveNumber(current.newsfeed_ads?.max_daily_impressions_per_user, defaultSettings.newsfeed_ads.max_daily_impressions_per_user),
      },
    });
  }, [data]);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateSettings({
        ...settings,
        newsfeed_min_posts: settings.newsfeed_ads.min_posts_before_ad,
        newsfeed_max_ads_per_page: settings.newsfeed_ads.max_ads_per_page,
      }).unwrap();
      toast.success("Boost settings saved");
    } catch {
      toast.error("Could not save boost settings");
    }
  };

  const numberField = (label: string, value: number, onChange: (value: number) => void, min = 0, step = 1) => <CustomInput label={label} type="number" min={min} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />;
  const toggle = (label: string, value: boolean, onChange: (value: boolean) => void) => <CustomSwitch label={label} checked={value} onChange={onChange} />;

  if (isLoading) return <div className="p-4 text-sm text-gray-500">Loading boost settings…</div>;
  if (isError) return <div className="p-4 text-sm text-red-700">Boost settings could not be loaded.</div>;

  return <form onSubmit={save} className={embedded ? "space-y-4" : "space-y-4 rounded-xl border border-gray-200 bg-white p-5"}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div>{!embedded && <h2 className="text-lg font-semibold text-headerColor">Boost system settings</h2>}<p className="mt-1 text-sm text-gray-500 ml-3">Control custom boost pricing, release timing, pause limits and feed placement.</p></div><button disabled={isSaving} className="h-10 rounded-lg bg-primaryColor px-4 text-sm font-medium text-white disabled:opacity-60">{isSaving ? "Saving…" : "Save settings"}</button></div>
    <div className="grid gap-4 border-t border-gray-100 pt-4 lg:grid-cols-2">
      <section className="space-y-3 rounded-lg bg-gray-50 p-4"><h3 className="font-medium text-gray-800">Custom boost slider</h3>{toggle("Enabled", settings.custom_slider.enabled, (enabled) => setSettings({ ...settings, custom_slider: { ...settings.custom_slider, enabled } }))}<div className="grid gap-3 sm:grid-cols-2">{numberField("Daily rate", settings.custom_slider.daily_rate, (daily_rate) => setSettings({ ...settings, custom_slider: { ...settings.custom_slider, daily_rate } }), 0.01, 0.01)}{numberField("Minimum days", settings.custom_slider.min_days, (min_days) => setSettings({ ...settings, custom_slider: { ...settings.custom_slider, min_days } }), 1)}{numberField("Maximum days", settings.custom_slider.max_days, (max_days) => setSettings({ ...settings, custom_slider: { ...settings.custom_slider, max_days } }), 1)}{numberField("Min. estimated daily impressions", settings.custom_slider.daily_estimated_impressions_min, (daily_estimated_impressions_min) => setSettings({ ...settings, custom_slider: { ...settings.custom_slider, daily_estimated_impressions_min } }), 1)}{numberField("Max. estimated daily impressions", settings.custom_slider.daily_estimated_impressions_max, (daily_estimated_impressions_max) => setSettings({ ...settings, custom_slider: { ...settings.custom_slider, daily_estimated_impressions_max } }), 1)}<AdminSelect label="Currency" value={settings.custom_slider.currency || "USD"} onChange={(event) => setSettings({ ...settings, custom_slider: { ...settings.custom_slider, currency: event.target.value } })}>{!currencyCodes.includes(settings.custom_slider.currency) && <option value={settings.custom_slider.currency}>{settings.custom_slider.currency}</option>}{currencyCodes.map((code) => <option key={code} value={code}>{code}</option>)}</AdminSelect></div></section>
      <section className="space-y-3 rounded-lg bg-gray-50 p-4"><h3 className="font-medium text-gray-800">Release and pause policy</h3><div className="grid gap-3 sm:grid-cols-2">{numberField("New release window (hours)", settings.new_release.hours, (hours) => setSettings({ ...settings, new_release: { hours } }))}{numberField("Maximum pause (days)", settings.pause_policy.max_days, (max_days) => setSettings({ ...settings, pause_policy: { ...settings.pause_policy, max_days } }), 1)}{numberField("First reminder (days)", settings.pause_policy.first_reminder_days, (first_reminder_days) => setSettings({ ...settings, pause_policy: { ...settings.pause_policy, first_reminder_days } }), 1)}{numberField("Final reminder (days)", settings.pause_policy.final_reminder_days, (final_reminder_days) => setSettings({ ...settings, pause_policy: { ...settings.pause_policy, final_reminder_days } }), 1)}</div></section>
      <section className="space-y-3 rounded-lg bg-gray-50 p-4 lg:col-span-2"><h3 className="font-medium text-gray-800">Newsfeed ad placement</h3>{toggle("Newsfeed ads enabled", settings.newsfeed_ads.enabled, (enabled) => setSettings({ ...settings, newsfeed_ads: { ...settings.newsfeed_ads, enabled } }))}<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{numberField("Posts before first ad", settings.newsfeed_ads.min_posts_before_ad, (min_posts_before_ad) => setSettings({ ...settings, newsfeed_ads: { ...settings.newsfeed_ads, min_posts_before_ad } }), 1)}{numberField("First ad slot", settings.newsfeed_ads.first_ad_slot, (first_ad_slot) => setSettings({ ...settings, newsfeed_ads: { ...settings.newsfeed_ads, first_ad_slot } }), 1)}{numberField("Ad interval", settings.newsfeed_ads.ad_interval, (ad_interval) => setSettings({ ...settings, newsfeed_ads: { ...settings.newsfeed_ads, ad_interval } }), 1)}{numberField("Max ads per page", settings.newsfeed_ads.max_ads_per_page, (max_ads_per_page) => setSettings({ ...settings, newsfeed_ads: { ...settings.newsfeed_ads, max_ads_per_page } }), 1)}{numberField("Max daily impressions per user", settings.newsfeed_ads.max_daily_impressions_per_user, (max_daily_impressions_per_user) => setSettings({ ...settings, newsfeed_ads: { ...settings.newsfeed_ads, max_daily_impressions_per_user } }), 1)}</div></section>
    </div>
  </form>;
}
