"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useGetIntegrationSettingsQuery, useUpdateIntegrationSettingsMutation } from "@/feature/slice/admin/settings/integrationApi";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";

const secretPattern = /(secret|password|private_key|api_key)/i;
const titleCase = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function IntegrationsSettings() {
  const { data, isLoading, isError } = useGetIntegrationSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateIntegrationSettingsMutation();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data?.data) return;
    const initial: Record<string, string> = {};
    Object.values(data.data).flat().forEach(({ key, value }) => {
      initial[key] = secretPattern.test(key) ? "" : value;
    });
    setValues(initial);
  }, [data]);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateSettings({ settings: values }).unwrap();
      toast.success("Integration settings saved");
    } catch {
      toast.error("Could not save integration settings");
    }
  };

  if (isLoading) return <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">Loading integration settings…</p>;
  if (isError) return <p className="rounded-xl border border-red-200 bg-white p-5 text-sm text-red-700">Integration settings could not be loaded.</p>;

  const sections = Object.entries(data?.data ?? {});
  return <form onSubmit={save} className="space-y-5">
    <header className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold text-headerColor">Integrations</h1><p className="mt-1 text-sm text-gray-500">Configure authentication, payment and email service credentials.</p></div><button disabled={isSaving} className="h-10 rounded-lg bg-primaryColor px-4 text-sm font-medium text-white disabled:opacity-60">{isSaving ? "Saving…" : "Save settings"}</button></header>
    <p className="rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm text-sky-800">Secret values are masked by the server. Leave a secret field empty to keep its current value; entered values replace it.</p>
    {!sections.length ? <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">No integration settings are configured on the backend.</div> : sections.map(([section, entries]) => <section key={section} className="rounded-xl border border-gray-200 bg-white p-5"><h2 className="mb-4 text-lg font-semibold capitalize text-headerColor">{titleCase(section)}</h2><div className="grid gap-4 md:grid-cols-2">{entries.map(({ key, value }) => {
      const secret = secretPattern.test(key);
      const configured = Boolean(value);
      return key.includes("private_key")
        ? <CustomTextArea key={key} label={titleCase(key)} rows={5} value={values[key] ?? ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} placeholder={secret && configured ? "Configured — leave blank to keep existing value" : "Enter value"} className="font-mono text-xs" />
        : <CustomInput key={key} label={titleCase(key)} type={secret ? "password" : "text"} value={values[key] ?? ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} placeholder={secret && configured ? "Configured — leave blank to keep existing value" : "Not configured"} />;
    })}</div></section>)}
  </form>;
}
