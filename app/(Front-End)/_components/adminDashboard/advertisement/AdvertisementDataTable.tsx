"use client";

import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Pencil, Plus, Search, Settings, Trash2 } from "lucide-react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import AdminSelect from "@/components/reusable/dashboard/AdminSelect";
import {
  BoostPackage,
  BoostPackagePayload,
  useCreateBoostPackageMutation,
  useDeleteBoostPackageMutation,
  useGetBoostPackagesQuery,
  useToggleBoostPackageStatusMutation,
  useUpdateBoostPackageMutation,
} from "@/feature/slice/admin/boost/boostApi";

const emptyForm: BoostPackagePayload = {
  name: "",
  target_entity: "all",
  duration_days: 7,
  price: 0,
  estimated_impressions: "",
  badge: "",
  promotion_highlight: "",
  description: "",
  features: [],
  priority_weight: 0,
  status: "active",
};

export default function AdvertisementTable({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { data, isLoading, isError } = useGetBoostPackagesQuery();
  const [createPackage, { isLoading: creating }] = useCreateBoostPackageMutation();
  const [updatePackage, { isLoading: updating }] = useUpdateBoostPackageMutation();
  const [toggleStatus] = useToggleBoostPackageStatusMutation();
  const [deletePackage] = useDeleteBoostPackageMutation();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<BoostPackage | null>(null);
  const [form, setForm] = useState<BoostPackagePayload>(emptyForm);

  const packages = useMemo(() => (data?.data ?? []).filter((item) =>
    `${item.name} ${item.target_entity}`.toLowerCase().includes(search.toLowerCase()),
  ), [data?.data, search]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: BoostPackage) => {
    setSelected(item);
    setForm({
      name: item.name,
      target_entity: item.target_entity,
      duration_days: item.duration_days,
      price: item.price,
      estimated_impressions: item.estimated_impressions ?? "",
      badge: item.badge ?? "",
      promotion_highlight: item.promotion_highlight ?? "",
      description: item.description ?? "",
      features: item.features ?? [],
      priority_weight: item.priority_weight,
      status: item.status,
    });
    setModalOpen(true);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      duration_days: Number(form.duration_days),
      price: Number(form.price),
      priority_weight: Number(form.priority_weight ?? 0),
      features: (form.features ?? []).filter(Boolean),
    };
    try {
      if (selected) await updatePackage({ id: selected.id, body: payload }).unwrap();
      else await createPackage(payload).unwrap();
      toast.success(selected ? "Boost package updated" : "Boost package created");
      setModalOpen(false);
    } catch {
      toast.error("Could not save the boost package");
    }
  };

  const runAction = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action();
      toast.success(success);
    } catch {
      toast.error("The action could not be completed");
    }
  };

  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white">
      <div className="border-b border-[#E5E7EB] p-5">
        <CustomTitleDescription
          title="Boost packages"
          description="Manage the packages available for promoted content."
          action={<div className="flex w-full flex-wrap items-center justify-end gap-2">
          <button onClick={onOpenSettings} className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Settings className="h-4 w-4" /> Settings
          </button>
          <label className="flex h-10 min-w-56 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-500">
            <Search className="h-4 w-4" />
            <CustomInput aria-label="Search packages" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search packages" className="h-auto border-0 bg-transparent p-0 shadow-none focus:border-0 focus:ring-0" />
          </label>
          <button onClick={openCreate} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primaryColor px-4 text-sm font-medium text-white">
            <Plus className="h-4 w-4" /> Add package
          </button>
          </div>}
        />
      </div>

      {isLoading ? <p className="p-6 text-sm text-gray-500">Loading boost packages…</p> : null}
      {isError ? <p className="p-6 text-sm text-red-600">Boost packages could not be loaded.</p> : null}
      {!isLoading && !isError && packages.length === 0 ? <p className="p-6 text-sm text-gray-500">No boost packages found.</p> : null}

      {packages.length > 0 && <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm leading-5 text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm font-medium leading-5 text-gray-600">
            <tr>{["Package", "Target", "Duration", "Price", "Campaigns", "Status", "Actions"].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 text-left font-medium">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {packages.map((item) => <tr key={item.id} className="transition-colors hover:bg-gray-50">
              <td className="px-4 py-3 align-middle"><p className="font-medium text-gray-900">{item.name}</p><p className="mt-1 text-xs text-gray-500">{item.promotion_highlight || item.description || "—"}</p></td>
              <td className="px-4 py-3 align-middle capitalize text-gray-600">{item.target_entity}</td>
              <td className="px-4 py-3 align-middle text-gray-600">{item.duration_days} days</td>
              <td className="px-4 py-3 align-middle font-medium text-gray-800">${Number(item.price).toFixed(2)}</td>
              <td className="px-4 py-3 align-middle text-gray-600">{item.active_campaigns_count ?? 0} active / {item.total_campaigns_count ?? 0} total</td>
              <td className="px-4 py-3 align-middle"><button onClick={() => void runAction(() => toggleStatus(item.id).unwrap(), "Package status updated")} className={`rounded-full px-3 py-1 text-xs font-medium ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{item.is_active ? "Active" : "Inactive"}</button></td>
              <td className="px-4 py-3 align-middle"><div className="flex items-center gap-2">
                <button aria-label={`Edit ${item.name}`} onClick={() => openEdit(item)} className="rounded-md p-2 text-gray-500 hover:bg-gray-100"><Pencil className="h-4 w-4" /></button>
                <button aria-label={`Delete ${item.name}`} onClick={() => { if (window.confirm(`Delete “${item.name}”?`)) void runAction(() => deletePackage(item.id).unwrap(), "Package deleted"); }} className="rounded-md p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div></td>
            </tr>)}
          </tbody>
        </table>
      </div>}

      <CustomModal open={modalOpen} onOpenChange={setModalOpen} title={selected ? "Edit boost package" : "Create boost package"} size="lg">
        <form onSubmit={save} className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2">
          <Field label="Name"><CustomInput required maxLength={255} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Target"><AdminSelect value={form.target_entity} onChange={(e) => setForm({ ...form, target_entity: e.target.value })}><option value="all">All content</option><option value="product">Products</option><option value="job">Jobs</option><option value="publication">Publications</option><option value="post">Posts</option></AdminSelect></Field>
          <Field label="Duration (days)"><CustomInput required type="number" min={1} max={365} value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} /></Field>
          <Field label="Price"><CustomInput required type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Field>
          <Field label="Estimated impressions"><CustomInput value={form.estimated_impressions ?? ""} onChange={(e) => setForm({ ...form, estimated_impressions: e.target.value })} /></Field>
          <Field label="Badge"><CustomInput value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></Field>
          <Field label="Promotion highlight"><CustomInput value={form.promotion_highlight ?? ""} onChange={(e) => setForm({ ...form, promotion_highlight: e.target.value })} /></Field>
          <Field label="Priority weight"><CustomInput type="number" min={0} max={1000} value={form.priority_weight ?? 0} onChange={(e) => setForm({ ...form, priority_weight: Number(e.target.value) })} /></Field>
          <Field label="Description" className="sm:col-span-2"><CustomTextArea rows={3} maxLength={2000} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Features (one per line)" className="sm:col-span-2"><CustomTextArea rows={4} value={(form.features ?? []).join("\n")} onChange={(e) => setForm({ ...form, features: e.target.value.split("\n") })} /></Field>
          <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => setModalOpen(false)} className="h-10 rounded-lg border px-4 text-sm">Cancel</button><button disabled={creating || updating} className="h-10 rounded-lg bg-primaryColor px-5 text-sm font-medium text-white disabled:opacity-60">{creating || updating ? "Saving…" : "Save package"}</button></div>
        </form>
      </CustomModal>
    </section>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 text-sm font-medium text-gray-700 ${className}`}><span>{label}</span>{children}</div>;
}
