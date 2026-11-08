"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useGetIntegrationSettingsQuery,
  useUpdateIntegrationSettingsMutation,
  type IntegrationSettings,
} from "@/feature/slice/admin/settings/integrationApi";
import { CheckCircle2, PlugZap, Settings2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-hot-toast";

const secretPattern = /(secret|password|private_key|api_key)/i;
const titleCase = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bId\b/g, "ID")
    .replace(/\bIos\b/g, "iOS")
    .replace(/\bApi\b/g, "API")
    .replace(/\bOauth\b/g, "OAuth");

const integrationTitle = (
  section: string,
  entries: IntegrationSettings[string],
) => titleCase(section.trim() || entries[0]?.key || "Integration");

type IntegrationGroup = {
  id: string;
  title: string;
  entries: IntegrationSettings[string];
};

export default function IntegrationsSettings() {
  const { data, isLoading, isError } = useGetIntegrationSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateIntegrationSettingsMutation();
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.data) return;
    const initial: Record<string, string> = {};
    Object.values(data.data)
      .flat()
      .forEach(({ key, value }) => {
        initial[key] = secretPattern.test(key) ? "" : value;
      });
    setValues(initial);
  }, [data]);

  const sections = Object.entries(data?.data ?? {}) as [
    string,
    IntegrationSettings[string],
  ][];
  const integrations = sections.reduce<IntegrationGroup[]>(
    (groups, [section, entries], index) => {
      const sourceName = `${section} ${entries.map(({ key }) => key).join(" ")}`;
      // Keys such as `apple_client_id_ios` use underscores, which count as
      // word characters and do not match a trailing `\b` after "apple".
      const isAppleIntegration = /apple/i.test(sourceName);
      const id = isAppleIntegration ? "apple-oauth" : `integration-${index}`;
      const title = isAppleIntegration
        ? "Apple OAuth"
        : integrationTitle(section, entries);
      const existing = groups.find((group) => group.id === id);

      if (existing) {
        existing.entries.push(...entries);
      } else {
        groups.push({ id, title, entries: [...entries] });
      }

      return groups;
    },
    [],
  );
  const activeIntegration = integrations.find(({ id }) => id === activeSection);
  const selectedEntries = activeIntegration?.entries ?? [];
  const activeTitle = activeIntegration?.title ?? "Integration";

  const saveSection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (activeSection === null) return;

    // Preserve the existing API contract by submitting the complete settings
    // object. Other integrations retain their loaded values, and blank secrets
    // continue to mean “keep the saved value.”
    const settings = { ...values };

    try {
      await updateSettings({ settings }).unwrap();
      toast.success(`${activeTitle} settings saved`);
      setActiveSection(null);
    } catch {
      toast.error(`Could not save ${activeTitle} settings`);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Loading integrations…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-700">
        Integration settings could not be loaded.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CustomTitleDescription
        title="Integrations"
        description="Manage the services connected to your platform. Configure each integration separately."
      />

      <div className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        Secret values are protected. Leave a secret field blank to keep its
        current value.
      </div>

      {!integrations.length ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
          No integration settings are configured on the backend.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {integrations.map(({ id, title, entries }) => {
            const configuredCount = entries.filter(({ value }) => Boolean(value)).length;
            const isConfigured = configuredCount > 0;

            return (
              <article
                key={id}
                className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primaryColor/10 text-primaryColor">
                    <PlugZap className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-headerColor">
                      {title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {entries.length} configurable value{entries.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isConfigured
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isConfigured && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {isConfigured ? "Configured" : "Not configured"}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  {entries.length > 1 && (
                    <p className="truncate text-xs text-gray-500">
                      {entries
                        .slice(0, 2)
                        .map(({ key }) => titleCase(key))
                        .join(" · ")}
                      {entries.length > 2 ? ` · +${entries.length - 2} more` : ""}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-3 shrink-0"
                    onClick={() => setActiveSection(id)}
                  >
                    <Settings2 className="h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog
        open={activeSection !== null}
        onOpenChange={(open) => !open && setActiveSection(null)}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto scrollbar-none">
          <DialogHeader>
            <DialogTitle>
              {activeSection !== null
                ? `Configure ${activeTitle}`
                : "Configure integration"}
            </DialogTitle>
            <DialogDescription>
              Update the settings for this integration. Leave protected values
              blank to keep the saved credentials.
            </DialogDescription>
          </DialogHeader>

          <form id="integration-settings-form" onSubmit={saveSection}>
            <div className="grid gap-4 py-2 md:grid-cols-2">
              {selectedEntries.map(({ key, value }) => {
                const secret = secretPattern.test(key);
                const placeholder = secret && value
                  ? "Configured — leave blank to keep current value"
                  : "Enter value";

                return key.includes("private_key") ? (
                  <CustomTextArea
                    key={key}
                    label={titleCase(key)}
                    rows={5}
                    value={values[key] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    className="font-mono text-xs"
                    containerClassName="md:col-span-2"
                  />
                ) : (
                  <CustomInput
                    key={key}
                    label={titleCase(key)}
                    type={secret ? "password" : "text"}
                    value={values[key] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    placeholder={placeholder}
                  />
                );
              })}
            </div>
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveSection(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="integration-settings-form"
              disabled={isSaving || !selectedEntries.length}
            >
              {isSaving ? "Saving…" : "Save integration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
