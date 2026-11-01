"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { ContactMessage, useGetContactMessagesQuery } from "@/feature/slice/admin/reports/adminReportApi";

export default function ContactMessages() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const { data, isLoading, isError } = useGetContactMessagesQuery({ search: search || undefined, page, per_page: 20 });
  const pagination = data?.pagination;

  return <section className="space-y-5">
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 className="text-2xl font-semibold text-headerColor">Contact messages</h1><p className="mt-1 text-sm text-gray-500">Review messages submitted through the contact form.</p></div><div className="relative w-full max-w-sm"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><CustomInput aria-label="Search contact messages" className="pl-9" placeholder="Search name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div></header>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <p className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">{pagination?.total ?? 0} messages</p>
      {isLoading ? <p className="p-5 text-sm text-gray-500">Loading messages…</p> : null}
      {isError ? <p className="p-5 text-sm text-red-600">Contact messages could not be loaded.</p> : null}
      {!isLoading && !isError && !data?.data.length ? <p className="p-5 text-sm text-gray-500">No contact messages found.</p> : null}
      {!!data?.data.length && <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{["No.", "Sender", "Phone", "Action"].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{data.data.map((row) => <tr key={row.id}><td className="px-4 py-4 text-gray-500">{row.sl_no}</td><td className="px-4 py-4"><p className="font-medium text-gray-800">{row.name}</p><a href={`mailto:${row.email}`} className="text-xs text-primaryColor">{row.email}</a></td><td className="px-4 py-4 text-gray-600">{row.phone || "—"}</td><td className="px-4 py-4"><button type="button" onClick={() => setSelected(row)} className="rounded-lg bg-primaryColor px-4 py-2 text-xs font-medium text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor focus-visible:ring-offset-2">View</button></td></tr>)}</tbody></table></div>}
      {pagination && pagination.last_page > 1 && <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-4 text-sm"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-md border px-3 py-2 disabled:opacity-40">Previous</button><span className="text-gray-500">Page {page} of {pagination.last_page}</span><button disabled={page >= pagination.last_page} onClick={() => setPage(page + 1)} className="rounded-md border px-3 py-2 disabled:opacity-40">Next</button></div>}
    </div>
    <CustomModal open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }} title="Contact message" size="lg" className="gap-5">
      {selected && <div className="space-y-5 p-2 text-sm">
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sender details</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{selected.name}</p>
          <a href={`mailto:${selected.email}`} className="mt-1 inline-block text-primaryColor hover:underline">{selected.email}</a>
          <div className="mt-5 grid gap-4 border-t border-gray-200 pt-4 sm:grid-cols-2">
            <div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">Phone</p><p className="mt-1 text-gray-800">{selected.phone || "—"}</p></div>
            <div><p className="text-xs font-medium uppercase tracking-wide text-gray-500">Address</p><p className="mt-1 text-gray-800">{selected.address || "—"}</p></div>
          </div>
        </section>
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subject</p>
          <p className="rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-900">{selected.subject || "No subject provided"}</p>
        </section>
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Message</p>
          <p className="min-h-40 whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-white px-5 py-4 leading-7 text-gray-700">{selected.message || "No message provided"}</p>
        </section>
      </div>}
    </CustomModal>
  </section>;
}
