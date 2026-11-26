"use client";

import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  GripVertical,
  LayoutGrid,
  Lock,
  Megaphone,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Table2,
  Trash2,
} from "lucide-react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomTextArea from "@/components/reusable/dashboard/CustomTextArea";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import AdminSelect from "@/components/reusable/dashboard/AdminSelect";
import {
  BoostPackage,
  BoostPackagePayload,
  BoostPlacement,
  useCreateBoostPackageMutation,
  useDeleteBoostPackageMutation,
  useGetBoostPackagesQuery,
  useGetBoostSettingsQuery,
  useReorderBoostPackagesMutation,
  useToggleBoostPackageStatusMutation,
  useUpdateBoostPackageMutation,
} from "@/feature/slice/admin/boost/boostApi";

const PLACEMENT_OPTIONS: {
  key: BoostPlacement;
  label: string;
  description: string;
}[] = [
  {
    key: "product_feed",
    label: "Product Feed",
    description: "Pins boosted product in the Product Feed with priority score.",
  },
  {
    key: "newsfeed",
    label: "Main Newsfeed",
    description: "Injects sponsored card into users' Main Newsfeed timeline.",
  },
];

const CORE_SYSTEM_FEATURES = [
  'Featured "Sponsored" Badge Ribbon',
  "Fair-Play Exposure Rotation (Never Buried)",
  "Real-Time Verified Views & Click Analytics",
];

const getPlacementFeatureText = (placements: BoostPlacement[]): string => {
  const hasProductFeed = placements.includes("product_feed");
  const hasNewsfeed = placements.includes("newsfeed");
  if (hasProductFeed && hasNewsfeed) {
    return "Dual Placement: Product Feed + Main Newsfeed";
  }
  if (hasProductFeed) {
    return "Placement: Product Feed";
  }
  return "Placement: Main Newsfeed";
};

const emptyForm: BoostPackagePayload = {
  name: "",
  target_entity: "product",
  placements: ["product_feed", "newsfeed"],
  duration_days: 7,
  price: 0,
  estimated_impressions: "",
  badge: "",
  promotion_highlight: "",
  description: "",
  priority_weight: 0,
  status: "active",
};

const getImpressionBoxStyle = (index: number) => {
  if (index % 3 === 0) {
    return {
      box: "border-dashed border-LiteBlueColor/60 bg-[#F5F3FF]",
      text: "text-LiteBlueColor",
    };
  }
  if (index % 3 === 1) {
    return {
      box: "border-dashed border-[#5EEAD4] bg-[#F0FDFA]",
      text: "text-[#0D9488]",
    };
  }
  return {
    box: "border-dashed border-[#FDBA74] bg-[#FFF7ED]",
    text: "text-[#EA580C]",
  };
};

export default function AdvertisementTable({
  onOpenSettings,
}: {
  onOpenSettings: () => void;
}) {
  const { data, isLoading, isError } = useGetBoostPackagesQuery();
  const { data: settingsData } = useGetBoostSettingsQuery();
  const [createPackage, { isLoading: creating }] = useCreateBoostPackageMutation();
  const [updatePackage, { isLoading: updating }] = useUpdateBoostPackageMutation();
  const [toggleStatus] = useToggleBoostPackageStatusMutation();
  const [deletePackage, { isLoading: deleting }] = useDeleteBoostPackageMutation();
  const [reorderPackages, { isLoading: reordering }] = useReorderBoostPackagesMutation();

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<BoostPackage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BoostPackage | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [optimisticOrderIds, setOptimisticOrderIds] = useState<number[] | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [placementWarning, setPlacementWarning] = useState(false);
  const [form, setForm] = useState<BoostPackagePayload>(emptyForm);

  // Respect admin-defined sort_order (same order users see on the boost page)
  const sortedAllPackages = useMemo(() => {
    const raw = [...(data?.data ?? [])];
    if (optimisticOrderIds && optimisticOrderIds.length > 0) {
      const rank = new Map(optimisticOrderIds.map((id, idx) => [id, idx]));
      return raw.sort((a, b) => {
        const ra = rank.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const rb = rank.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        if (ra !== rb) return ra - rb;
        return a.id - b.id;
      });
    }
    return raw.sort((a, b) => {
      const oa =
        typeof a.sort_order === "number" && a.sort_order > 0
          ? a.sort_order
          : Number.MAX_SAFE_INTEGER;
      const ob =
        typeof b.sort_order === "number" && b.sort_order > 0
          ? b.sort_order
          : Number.MAX_SAFE_INTEGER;
      if (oa !== ob) return oa - ob;
      if ((a.duration_days || 0) !== (b.duration_days || 0)) {
        return (a.duration_days || 0) - (b.duration_days || 0);
      }
      return a.id - b.id;
    });
  }, [data?.data, optimisticOrderIds]);

  const packages = useMemo(
    () =>
      sortedAllPackages.filter((item) =>
        `${item.name} ${item.target_entity} ${item.badge ?? ""} ${item.description ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [sortedAllPackages, search],
  );

  const canReorder = search.trim() === "" && sortedAllPackages.length > 1;

  const commitOrder = async (nextIds: number[]) => {
    setOptimisticOrderIds(nextIds);
    try {
      await reorderPackages(nextIds).unwrap();
      toast.success("Package order updated");
    } catch {
      setOptimisticOrderIds(null);
      toast.error("Could not update package order");
    }
  };

  const movePackage = (id: number, direction: -1 | 1) => {
    if (!canReorder || reordering) return;
    const ids = sortedAllPackages.map((p) => p.id);
    const idx = ids.indexOf(id);
    const targetIdx = idx + direction;
    if (idx === -1 || targetIdx < 0 || targetIdx >= ids.length) return;
    const next = [...ids];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    void commitOrder(next);
  };

  const handleDropOn = (targetId: number) => {
    setDragOverId(null);
    if (!canReorder || reordering || draggingId === null || draggingId === targetId) {
      setDraggingId(null);
      return;
    }
    const ids = sortedAllPackages.map((p) => p.id);
    const fromIdx = ids.indexOf(draggingId);
    const toIdx = ids.indexOf(targetId);
    setDraggingId(null);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...ids];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    void commitOrder(next);
  };

  const customSlider = settingsData?.data?.custom_slider;

  const openCreate = () => {
    setSelected(null);
    setPlacementWarning(false);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: BoostPackage) => {
    setSelected(item);
    setPlacementWarning(false);
    const resolvedPlacements: BoostPlacement[] =
      item.placements && item.placements.length > 0
        ? item.placements
        : ["product_feed", "newsfeed"];
    setForm({
      name: item.name,
      target_entity: item.target_entity,
      placements: resolvedPlacements,
      duration_days: item.duration_days,
      price: item.price,
      estimated_impressions: item.estimated_impressions ?? "",
      badge: item.badge ?? "",
      promotion_highlight: item.promotion_highlight ?? "",
      description: item.description ?? "",
      priority_weight: item.priority_weight,
      status: item.status,
    });
    setModalOpen(true);
  };

  const togglePlacement = (key: BoostPlacement) => {
    const current = form.placements ?? ["product_feed", "newsfeed"];
    if (current.includes(key)) {
      if (current.length <= 1) {
        setPlacementWarning(true);
        toast.error("At least one ad placement must be selected.");
        return;
      }
      setPlacementWarning(false);
      setForm({
        ...form,
        placements: current.filter((p) => p !== key),
      });
    } else {
      setPlacementWarning(false);
      const next = PLACEMENT_OPTIONS.map((o) => o.key).filter(
        (k) => k === key || current.includes(k),
      );
      setForm({ ...form, placements: next });
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const activePlacements: BoostPlacement[] =
      form.placements && form.placements.length > 0
        ? form.placements
        : ["product_feed", "newsfeed"];
    const payload: BoostPackagePayload = {
      ...form,
      name: form.name.trim(),
      target_entity: "product",
      placements: activePlacements,
      duration_days: Number(form.duration_days),
      price: Number(form.price),
      priority_weight: Number(form.priority_weight ?? 0),
    };
    try {
      if (selected) {
        await updatePackage({ id: selected.id, body: payload }).unwrap();
      } else {
        await createPackage(payload).unwrap();
      }
      toast.success(selected ? "Boost package updated" : "Boost package created");
      setModalOpen(false);
    } catch {
      toast.error("Could not save the boost package");
    }
  };

  const handleToggleStatus = async (item: BoostPackage) => {
    setTogglingId(item.id);
    try {
      await toggleStatus(item.id).unwrap();
      toast.success(
        item.is_active
          ? `"${item.name}" deactivated`
          : `"${item.name}" activated`,
      );
    } catch {
      toast.error("Could not update package status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePackage(deleteTarget.id).unwrap();
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      const apiMsg =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: string } }).data?.message ===
          "string"
          ? (err as { data: { message: string } }).data.message
          : "Could not delete this package";
      toast.error(apiMsg);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#E5E7EB] bg-white">
        {/* Toolbar Header */}
        <div className="border-b border-[#E5E7EB] p-5">
          <CustomTitleDescription
            title="Boost Packages & Pricing"
            description="Live preview of how advertisers see boost packages. Create, edit, or toggle availability."
            action={
              <div className="flex w-full flex-wrap items-center justify-end gap-2">
                {/* Cards / Table View Toggle */}
                <div className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition ${
                      viewMode === "cards"
                        ? "bg-white text-gray-900 shadow-xs"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition ${
                      viewMode === "table"
                        ? "bg-white text-gray-900 shadow-xs"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Table2 className="h-3.5 w-3.5" />
                    Table
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>

                <label className="flex h-10 min-w-52 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-500">
                  <Search className="h-4 w-4 shrink-0" />
                  <CustomInput
                    aria-label="Search packages"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search packages..."
                    className="h-auto border-0 bg-transparent p-0 shadow-none focus:border-0 focus:ring-0"
                  />
                </label>

                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primaryColor px-4 text-sm font-medium text-white hover:bg-[#038a9c]"
                >
                  <Plus className="h-4 w-4" />
                  Add package
                </button>
              </div>
            }
          />
        </div>

        {/* Loading / Error / Empty States */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-96 animate-pulse rounded-2xl border border-gray-200 bg-gray-50 p-5"
              />
            ))}
          </div>
        ) : isError ? (
          <p className="p-6 text-sm text-red-600">
            Boost packages could not be loaded.
          </p>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <PackageOpen className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              No boost packages found
            </h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              {search
                ? "Try adjusting your search query."
                : "Create your first boost package to display it to advertisers."}
            </p>
          </div>
        ) : viewMode === "cards" ? (
          /* User-Facing Card Preview Grid */
          <div className="p-6">
            {canReorder && (
              <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <GripVertical className="h-3.5 w-3.5 text-gray-400" />
                  Drag cards or use the arrow buttons to set the display order
                  shown to advertisers.
                </span>
                {reordering && (
                  <span className="font-medium text-primaryColor">
                    Saving order…
                  </span>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 xl:grid-cols-3">
              {packages.map((item, index) => {
                const isPopular =
                  Boolean(
                    item.badge && item.badge.toLowerCase().includes("popular"),
                  ) || index === 1;
                const badgeText =
                  item.badge || (isPopular ? "Most Popular Plan" : null);
                const impressionStyle = getImpressionBoxStyle(index);
                const isBusy = togglingId === item.id;
                const isDragging = draggingId === item.id;
                const isDragOver =
                  dragOverId === item.id && draggingId !== item.id;

                return (
                  <div
                    key={item.id}
                    draggable={canReorder && !reordering}
                    onDragStart={(e) => {
                      setDraggingId(item.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      if (!canReorder) return;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverId !== item.id) setDragOverId(item.id);
                    }}
                    onDragLeave={() => {
                      if (dragOverId === item.id) setDragOverId(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropOn(item.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverId(null);
                    }}
                    className={`relative flex flex-col justify-between rounded-2xl border bg-white p-5 transition-all hover:shadow-md ${
                      canReorder ? "cursor-grab active:cursor-grabbing" : ""
                    } ${
                      isDragOver
                        ? "border-primaryColor ring-2 ring-primaryColor/30"
                        : item.is_active
                          ? "border-borderColor hover:border-slate-300"
                          : "border-dashed border-gray-300 bg-gray-50/70 opacity-85"
                    } ${isDragging ? "scale-[0.98] opacity-50" : ""}`}
                  >
                    {/* Top Centered Floating Badge (exact match with user view) */}
                    {badgeText && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primaryColor px-3.5 py-0.5 text-xs font-bold leading-[160%] text-white shadow-xs">
                        {badgeText}
                      </div>
                    )}

                    <div>
                      {/* Title + Status Toggle */}
                      <div className="mt-1 flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-headerColor">
                          {item.name}
                        </h3>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.is_active}
                          disabled={isBusy}
                          onClick={() => void handleToggleStatus(item)}
                          title={
                            item.is_active
                              ? "Click to deactivate package"
                              : "Click to activate package"
                          }
                          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium transition hover:border-gray-300 disabled:opacity-60"
                        >
                          <span
                            className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
                              item.is_active ? "bg-primaryColor" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform ${
                                item.is_active
                                  ? "translate-x-3.5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </span>
                          <span
                            className={
                              item.is_active
                                ? "text-emerald-700"
                                : "text-gray-500"
                            }
                          >
                            {item.is_active ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </div>

                      {/* Price & Duration */}
                      <div className="mt-3 flex items-baseline gap-1">
                        <p className="text-3xl font-extrabold text-headerColor">
                          ${Number(item.price).toFixed(2)}
                        </p>
                        <p className="text-xs font-medium text-descriptionColor">
                          / {item.duration_days} Days
                        </p>
                      </div>

                      {/* Description */}
                      <p className="mt-2 min-h-[46px] line-clamp-2 text-sm leading-relaxed text-descriptionColor">
                        {item.description ||
                          "Maximize your reach and engagement."}
                      </p>

                      {/* Estimated Impressions Box */}
                      <div
                        className={`my-4 rounded-lg border px-3 py-2.5 text-center ${impressionStyle.box}`}
                      >
                        <p
                          className={`text-sm font-semibold ${impressionStyle.text}`}
                        >
                          {item.estimated_impressions ||
                            `Est. ${(item.duration_days || 7) * 2}k – ${(item.duration_days || 7) * 5}k Impressions`}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="my-4 mt-5 space-y-3.5">
                        {(item.features ?? []).map(
                          (feature: string, fIdx: number) => (
                            <div
                              key={`${item.id}-feat-${fIdx}`}
                              className="flex items-start gap-2.5 text-left"
                            >
                              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primaryColor">
                                <Check className="h-2.5 w-2.5 stroke-3 text-white" />
                              </div>
                              <p className="text-sm leading-[130%] text-headerColor/85">
                                {feature}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Admin Meta + Actions Footer */}
                    <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 font-semibold text-primaryColor">
                            <GripVertical className="h-3 w-3" />#{index + 1}
                          </span>
                          {canReorder && (
                            <div className="inline-flex items-center rounded-md border border-gray-200 bg-white">
                              <button
                                type="button"
                                aria-label={`Move ${item.name} left`}
                                title="Move earlier"
                                disabled={index === 0 || reordering}
                                onClick={() => movePackage(item.id, -1)}
                                className="p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Move ${item.name} right`}
                                title="Move later"
                                disabled={
                                  index === packages.length - 1 || reordering
                                }
                                onClick={() => movePackage(item.id, 1)}
                                className="border-l border-gray-200 p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-medium capitalize text-gray-700">
                            {item.target_entity}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 font-medium text-gray-600">
                          <Megaphone className="h-3.5 w-3.5 text-primaryColor" />
                          {item.active_campaigns_count ?? 0} active ·{" "}
                          {item.total_campaigns_count ?? 0} total
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primaryColor px-4 text-sm font-semibold text-white transition hover:bg-[#038a9c]"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Package
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${item.name}`}
                          disabled={(item.total_campaigns_count ?? 0) > 0}
                          title={
                            (item.total_campaigns_count ?? 0) > 0
                              ? "Cannot delete — this package has purchase history. Turn it Inactive instead."
                              : `Delete ${item.name}`
                          }
                          onClick={() => setDeleteTarget(item)}
                          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition ${
                            (item.total_campaigns_count ?? 0) > 0
                              ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
                              : "border-red-200 bg-white text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Compact Table View */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm leading-5 text-gray-700">
              <thead className="border-b border-gray-200 bg-gray-50 text-sm font-medium leading-5 text-gray-600">
                <tr>
                  {[
                    "SL",
                    "Package",
                    "Target",
                    "Duration",
                    "Price",
                    "Impressions",
                    "Campaigns",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-3 text-left font-medium"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packages.map((item, index) => (
                  <tr
                    key={item.id}
                    draggable={canReorder && !reordering}
                    onDragStart={(e) => {
                      setDraggingId(item.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      if (!canReorder) return;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverId !== item.id) setDragOverId(item.id);
                    }}
                    onDragLeave={() => {
                      if (dragOverId === item.id) setDragOverId(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropOn(item.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverId(null);
                    }}
                    className={`transition-colors hover:bg-gray-50 ${
                      dragOverId === item.id && draggingId !== item.id
                        ? "bg-teal-50/70"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-1.5">
                        <GripVertical
                          className={`h-4 w-4 ${
                            canReorder
                              ? "cursor-grab text-gray-400"
                              : "text-gray-200"
                          }`}
                        />
                        <span className="w-6 text-xs font-semibold text-primaryColor">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.badge && (
                          <span className="rounded bg-primaryColor/10 px-2 py-0.5 text-[11px] font-medium text-primaryColor">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.promotion_highlight || item.description || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-middle capitalize text-gray-600">
                      {item.target_entity}
                    </td>
                    <td className="px-4 py-3 align-middle text-gray-600">
                      {item.duration_days} days
                    </td>
                    <td className="px-4 py-3 align-middle font-medium text-gray-800">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 align-middle text-xs text-gray-600">
                      {item.estimated_impressions || "—"}
                    </td>
                    <td className="px-4 py-3 align-middle text-gray-600">
                      {item.active_campaigns_count ?? 0} active /{" "}
                      {item.total_campaigns_count ?? 0} total
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.is_active}
                        disabled={togglingId === item.id}
                        onClick={() => void handleToggleStatus(item)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium transition hover:border-gray-300 disabled:opacity-60"
                      >
                        <span
                          className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
                            item.is_active ? "bg-primaryColor" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform ${
                              item.is_active
                                ? "translate-x-3.5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </span>
                        <span
                          className={
                            item.is_active
                              ? "text-emerald-700"
                              : "text-gray-500"
                          }
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        {canReorder && (
                          <div className="inline-flex items-center rounded border border-gray-200 bg-white">
                            <button
                              type="button"
                              aria-label={`Move ${item.name} up`}
                              title="Move up"
                              disabled={index === 0 || reordering}
                              onClick={() => movePackage(item.id, -1)}
                              className="p-1 text-gray-500 hover:bg-gray-100 hover:text-primaryColor disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Move ${item.name} down`}
                              title="Move down"
                              disabled={
                                index === packages.length - 1 || reordering
                              }
                              onClick={() => movePackage(item.id, 1)}
                              className="border-l border-gray-200 p-1 text-gray-500 hover:bg-gray-100 hover:text-primaryColor disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          aria-label={`Edit ${item.name}`}
                          onClick={() => openEdit(item)}
                          className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${item.name}`}
                          disabled={(item.total_campaigns_count ?? 0) > 0}
                          title={
                            (item.total_campaigns_count ?? 0) > 0
                              ? "Cannot delete — this package has purchase history. Turn it Inactive instead."
                              : `Delete ${item.name}`
                          }
                          onClick={() => setDeleteTarget(item)}
                          className={`rounded-md p-2 ${
                            (item.total_campaigns_count ?? 0) > 0
                              ? "cursor-not-allowed text-gray-300"
                              : "text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Custom Boosting Preview Card (mirrors user-facing Custom Boosting section) */}
      {customSlider && (
        <section className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-primaryColor">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-headerColor">
                    Custom Boost Package
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customSlider.enabled
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        customSlider.enabled ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {customSlider.enabled ? "Enabled for Users" : "Disabled"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  Advertisers can pick a custom duration from{" "}
                  <span className="font-semibold text-gray-700">
                    {customSlider.min_days} to {customSlider.max_days} days
                  </span>{" "}
                  at{" "}
                  <span className="font-semibold text-gray-700">
                    ${Number(customSlider.daily_rate).toFixed(2)} / day
                  </span>{" "}
                  ({customSlider.daily_estimated_impressions_min.toLocaleString()}{" "}
                  –{" "}
                  {customSlider.daily_estimated_impressions_max.toLocaleString()}{" "}
                  est. daily impressions).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-3.5 w-3.5" />
              Configure Package
            </button>
          </div>
        </section>
      )}

      {/* Create / Edit Package Modal */}
      <CustomModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={selected ? "Edit boost package" : "Create boost package"}
        size="lg"
      >
        <form onSubmit={save} className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2">
          <Field label="Name">
            <CustomInput
              required
              maxLength={255}
              placeholder="e.g. Growth Boost"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Target">
            <AdminSelect
              value="product"
              disabled
              className="cursor-not-allowed bg-gray-50 text-gray-600"
            >
              <option value="product">Products</option>
            </AdminSelect>
          </Field>
          <Field label="Duration (days)">
            <CustomInput
              required
              type="number"
              min={1}
              max={365}
              value={form.duration_days}
              onChange={(e) =>
                setForm({ ...form, duration_days: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Price ($)">
            <CustomInput
              required
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Estimated impressions">
            <CustomInput
              placeholder="e.g. 15,000 – 25,000 Impressions"
              value={form.estimated_impressions ?? ""}
              onChange={(e) =>
                setForm({ ...form, estimated_impressions: e.target.value })
              }
            />
          </Field>
          <Field label="Badge (top ribbon)">
            <CustomInput
              placeholder="e.g. Most Popular Plan"
              value={form.badge ?? ""}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </Field>
          <Field label="Promotion highlight">
            <CustomInput
              placeholder="e.g. 14 Days Extended Multi-Channel Reach"
              value={form.promotion_highlight ?? ""}
              onChange={(e) =>
                setForm({ ...form, promotion_highlight: e.target.value })
              }
            />
          </Field>
          <Field label="Priority weight">
            <CustomInput
              type="number"
              min={0}
              max={1000}
              value={form.priority_weight ?? 0}
              onChange={(e) =>
                setForm({ ...form, priority_weight: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <CustomTextArea
              rows={2}
              maxLength={2000}
              placeholder="Short summary displayed below the price on the card..."
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Field>

          {/* Real Backend-Enforced Ad Placements */}
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Ad Placements (Enforced in Delivery)
              </span>
              <span
                className={`text-xs ${
                  placementWarning
                    ? "font-medium text-red-600"
                    : "text-gray-400"
                }`}
              >
                {placementWarning
                  ? "At least 1 placement is required"
                  : "Select at least 1"}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {PLACEMENT_OPTIONS.map((opt) => {
                const checked = (
                  form.placements ?? ["product_feed", "newsfeed"]
                ).includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => togglePlacement(opt.key)}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      checked
                        ? "border-primaryColor bg-teal-50/50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        checked
                          ? "border-primaryColor bg-primaryColor text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {checked && <Check className="h-3 w-3 stroke-3" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900">
                        {opt.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-500">
                        {opt.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System-Synced Card Features Preview (Read-only) */}
          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <Lock className="h-3.5 w-3.5 text-gray-400" />
                Card Features (Auto-Synced with System)
              </span>
              <span className="text-[11px] text-gray-400">
                Shown on user pricing card
              </span>
            </div>
            <ul className="space-y-2 pt-1">
              <li className="flex items-center justify-between gap-2 text-xs text-gray-800">
                <span className="flex items-center gap-2 font-medium">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primaryColor">
                    <Check className="h-2.5 w-2.5 stroke-3 text-white" />
                  </span>
                  {getPlacementFeatureText(
                    form.placements ?? ["product_feed", "newsfeed"],
                  )}
                </span>
                <span className="shrink-0 rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700">
                  From placements
                </span>
              </li>
              {CORE_SYSTEM_FEATURES.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center justify-between gap-2 text-xs text-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primaryColor">
                      <Check className="h-2.5 w-2.5 stroke-3 text-white" />
                    </span>
                    {feat}
                  </span>
                  <span className="shrink-0 rounded bg-gray-200/70 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                    System included
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Package Status Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 sm:col-span-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Package visibility
              </p>
              <p className="text-xs text-gray-500">
                {form.status === "active"
                  ? "Active — advertisers can see and purchase this package."
                  : "Inactive — hidden from advertisers on the boost page."}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.status === "active"}
              onClick={() =>
                setForm({
                  ...form,
                  status: form.status === "active" ? "inactive" : "active",
                })
              }
              className="inline-flex cursor-pointer items-center gap-2.5"
            >
              <span
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  form.status === "active" ? "bg-primaryColor" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    form.status === "active" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </span>
              <span
                className={`w-14 text-left text-xs font-semibold ${
                  form.status === "active"
                    ? "text-emerald-700"
                    : "text-gray-500"
                }`}
              >
                {form.status === "active" ? "Active" : "Inactive"}
              </span>
            </button>
          </div>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={creating || updating}
              className="h-10 rounded-lg bg-primaryColor px-5 text-sm font-medium text-white hover:bg-[#038a9c] disabled:opacity-60"
            >
              {creating || updating ? "Saving…" : "Save package"}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete boost package"
        size="sm"
      >
        <div className="space-y-4 p-2">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              {deleteTarget?.name}
            </span>
            ? Existing campaigns using this package will remain in history, but
            advertisers will no longer be able to purchase it.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => void handleConfirmDelete()}
              className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete package"}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 text-sm font-medium text-gray-700 ${className}`}>
      <span>{label}</span>
      {children}
    </div>
  );
}
