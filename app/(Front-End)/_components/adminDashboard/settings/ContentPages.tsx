"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AdminPageSlug, useGetAdminPageQuery, useUpdateAdminPageMutation } from "@/feature/slice/admin/settings/adminPagesApi";
import AdminSelect from "@/components/reusable/dashboard/AdminSelect";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";

const pages: { slug: AdminPageSlug; label: string }[] = [
  { slug: "about-us", label: "About Us" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-and-conditions", label: "Terms and Conditions" },
];

export default function ContentPages() {
  const [slug, setSlug] = useState<AdminPageSlug>("about-us");
  const { data, isLoading, isError } = useGetAdminPageQuery(slug);
  const [updatePage, { isLoading: isSaving }] = useUpdateAdminPageMutation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coreValues, setCoreValues] = useState({ vision: "", mission: "", strategy: "" });
  const [founder, setFounder] = useState({ name: "", designation: "", bio: "", signature: "" });
  const [structuredContent, setStructuredContent] = useState({ team: "[]", videos: "[]", faqs: "[]", leading_institutions: "[]" });

  useEffect(() => {
    setTitle(data?.data.title ?? "");
    setContent(data?.data.content ?? "");
    setCoreValues((data?.data.core_values as typeof coreValues) ?? { vision: "", mission: "", strategy: "" });
    setFounder({ name: String(data?.data.founder?.name ?? ""), designation: String(data?.data.founder?.designation ?? ""), bio: String(data?.data.founder?.bio ?? ""), signature: String(data?.data.founder?.signature ?? "") });
    setStructuredContent({
      team: JSON.stringify(data?.data.team ?? [], null, 2),
      videos: JSON.stringify(data?.data.videos ?? [], null, 2),
      faqs: JSON.stringify(data?.data.faqs ?? [], null, 2),
      leading_institutions: JSON.stringify(data?.data.leading_institutions ?? [], null, 2),
    });
  }, [data]);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const body: Record<string, unknown> = { title, content };
      if (slug === "about-us") {
        const parseArray = (value: string, label: string) => {
          const parsed: unknown = JSON.parse(value);
          if (!Array.isArray(parsed)) throw new Error(`${label} must be a JSON array`);
          return parsed;
        };
        body.vision = coreValues.vision;
        body.mission = coreValues.mission;
        body.strategy = coreValues.strategy;
        body.founder_name = founder.name;
        body.founder_designation = founder.designation;
        body.founder_bio = founder.bio;
        body.founder_signature = founder.signature;
        body.team = parseArray(structuredContent.team, "Team");
        body.videos = parseArray(structuredContent.videos, "Videos");
        body.faqs = parseArray(structuredContent.faqs, "FAQs");
        body.leading_institutions = parseArray(structuredContent.leading_institutions, "Leading institutions");
      }
      await updatePage({ slug, body: body as { title: string; content: string } }).unwrap();
      toast.success("Page content saved");
    } catch {
      toast.error("Could not save page content. Check structured section JSON fields.");
    }
  };

  return <form onSubmit={save} className="space-y-5">
    <header><h1 className="text-2xl font-semibold text-headerColor">Content pages</h1><p className="mt-1 text-sm text-gray-500">Edit the title and main content used by public information pages.</p></header>
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
      <AdminSelect label="Page" containerClassName="max-w-sm" value={slug} onChange={(event) => setSlug(event.target.value as AdminPageSlug)}><option value="about-us">About Us</option><option value="privacy-policy">Privacy Policy</option><option value="terms-and-conditions">Terms and Conditions</option></AdminSelect>
      {isLoading ? <p className="text-sm text-gray-500">Loading page content…</p> : isError ? <p className="text-sm text-red-600">Page content could not be loaded.</p> : <>
        <CustomInput label="Title" required maxLength={255} value={title} onChange={(event) => setTitle(event.target.value)} />
        <CustomTextArea label="Content" rows={12} value={content} onChange={(event) => setContent(event.target.value)} helperText="HTML is accepted by the public page renderer." />
        {slug === "about-us" && <>
          <div className="grid gap-4 md:grid-cols-3">{(["vision", "mission", "strategy"] as const).map((key) => <CustomTextArea key={key} label={key} rows={4} value={coreValues[key]} onChange={(event) => setCoreValues({ ...coreValues, [key]: event.target.value })} containerClassName="capitalize" />)}</div>
          <fieldset className="grid gap-4 rounded-lg border border-gray-100 p-4 md:grid-cols-2"><legend className="px-1 text-sm font-semibold text-gray-700">Founder</legend>{(["name", "designation", "signature"] as const).map((key) => <CustomInput key={key} label={key} value={founder[key]} onChange={(event) => setFounder({ ...founder, [key]: event.target.value })} containerClassName="capitalize" />)}<CustomTextArea label="Bio" rows={3} value={founder.bio} onChange={(event) => setFounder({ ...founder, bio: event.target.value })} /><p className="text-xs font-normal text-gray-500 md:col-span-2">Image upload is not supported by this API form yet; existing founder image is retained.</p></fieldset>
          <div className="grid gap-4 md:grid-cols-2">{(["team", "videos", "faqs", "leading_institutions"] as const).map((key) => <CustomTextArea key={key} label={`${key.replaceAll("_", " ")} (JSON array)`} rows={8} value={structuredContent[key]} onChange={(event) => setStructuredContent({ ...structuredContent, [key]: event.target.value })} className="font-mono text-xs" containerClassName="capitalize" />)}</div>
        </>}
        <div className="flex justify-end"><button disabled={isSaving} className="h-10 rounded-lg bg-primaryColor px-5 text-sm font-medium text-white disabled:opacity-60">{isSaving ? "Saving…" : "Save page"}</button></div>
      </>}
    </section>
  </form>;
}
