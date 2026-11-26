"use client";

import CustomDeletModal from "@/components/reusable/dashboard/CustomDeletModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomTitleDescription from "@/components/reusable/dashboard/CustomTitleDes";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import {
  useDeactivePlanMutation,
  useDeletePlanMutation,
  useGetPlanFeaturesQuery,
  useGetPlansQuery,
  useReorderPlansMutation,
} from "@/feature/slice/admin/subscription/subscriptionApi";
import { Plan } from "@/feature/slice/admin/subscription/subscriptionType";
import { CorrectIcon } from "@/public/svgIcons/AdminIcon";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  GripVertical,
  LayoutGrid,
  Pencil,
  Plus,
  Search,
  Table2,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CreatePlan from "./CreatePlan";

const parseRate = (rate: string) =>
  Number(String(rate).replace(/[^0-9.]/g, "")) || 0;

const formatPrice = (rate: string) => {
  const value = parseRate(rate);
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const formatDiscountDate = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getPlanBadgeColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("premium") || n.includes("professional")) return "orange" as const;
  if (n.includes("basic") || n.includes("free")) return "purple" as const;
  if (n.includes("pro") || n.includes("industry")) return "green" as const;
  return "gray" as const;
};

export default function PlanPricingCard() {
  const { data: apiResponse, isLoading, isError } = useGetPlansQuery();
  const { data: featuresResponse } = useGetPlanFeaturesQuery();
  const [deactivePlan] = useDeactivePlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const [reorderPlans, { isLoading: reordering }] = useReorderPlansMutation();

  const [billingType, setBillingType] = useState<"monthly" | "annually">("monthly");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [optimisticOrderIds, setOptimisticOrderIds] = useState<number[] | null>(
    null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const featureOptions = featuresResponse?.data ?? [];
  const plans = apiResponse?.data ?? [];

  const serverSortedIds = useMemo(
    () =>
      [...plans]
        .sort((a, b) => (a.sort_order ?? a.id) - (b.sort_order ?? b.id))
        .map((p) => p.id),
    [plans],
  );

  useEffect(() => {
    if (!optimisticOrderIds) return;
    const isSynced =
      optimisticOrderIds.length === serverSortedIds.length &&
      optimisticOrderIds.every((id, idx) => id === serverSortedIds[idx]);
    if (isSynced) {
      setOptimisticOrderIds(null);
    }
  }, [optimisticOrderIds, serverSortedIds]);

  const sortedAllPlans = useMemo(() => {
    const base = [...plans].sort(
      (a, b) => (a.sort_order ?? a.id) - (b.sort_order ?? b.id),
    );
    if (!optimisticOrderIds) return base;
    const rank = new Map(optimisticOrderIds.map((id, i) => [id, i]));
    return [...base].sort(
      (a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999),
    );
  }, [plans, optimisticOrderIds]);

  const cyclePlans = useMemo(
    () =>
      sortedAllPlans.filter((plan) =>
        billingType === "monthly"
          ? plan.billing_cycle === "monthly"
          : plan.billing_cycle === "yearly",
      ),
    [sortedAllPlans, billingType],
  );

  const visiblePlans = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cyclePlans;
    return cyclePlans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(q) ||
        plan.plan_type.toLowerCase().includes(q) ||
        (plan.short_description ?? "").toLowerCase().includes(q),
    );
  }, [cyclePlans, search]);

  const canReorder = search.trim() === "" && cyclePlans.length > 1;

  const getFeatureLabel = (feature: string) =>
    featureOptions.find(
      (option) => option.value === feature || option.label === feature,
    )?.label ?? feature;

  const getDiscountPercent = (plan: Plan) => Number(plan.discount_percent) || 0;

  const getOriginalPrice = (plan: Plan) => {
    const discount = getDiscountPercent(plan);
    const current = parseRate(plan.billing_rate);
    if (discount <= 0 || discount >= 100 || !current) return null;
    const original = current / (1 - discount / 100);
    return Number.isInteger(original) ? String(original) : original.toFixed(2);
  };

  const commitOrder = async (nextCycleIds: number[]) => {
    // Merge the reordered cycle plans with the remaining plans from other cycles
    const cycleSet = new Set(nextCycleIds);
    const otherIds = sortedAllPlans
      .filter((p) => !cycleSet.has(p.id))
      .map((p) => p.id);
    const fullOrder = [...nextCycleIds, ...otherIds];

    setOptimisticOrderIds(fullOrder);
    try {
      await reorderPlans(fullOrder).unwrap();
      toast.success("Plan order updated");
    } catch {
      setOptimisticOrderIds(null);
      toast.error("Could not update plan order");
    }
  };

  const movePlan = (id: number, direction: -1 | 1) => {
    if (!canReorder || reordering) return;
    const ids = cyclePlans.map((p) => p.id);
    const idx = ids.indexOf(id);
    const targetIdx = idx + direction;
    if (idx === -1 || targetIdx < 0 || targetIdx >= ids.length) return;
    const next = [...ids];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    void commitOrder(next);
  };

  const handleDropOn = (targetId: number) => {
    setDragOverId(null);
    if (
      !canReorder ||
      reordering ||
      draggingId === null ||
      draggingId === targetId
    ) {
      setDraggingId(null);
      return;
    }
    const ids = cyclePlans.map((p) => p.id);
    const fromIdx = ids.indexOf(draggingId);
    const toIdx = ids.indexOf(targetId);
    setDraggingId(null);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...ids];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    void commitOrder(next);
  };

  const handleToggleActive = async (plan: Plan) => {
    setTogglingId(plan.id);
    try {
      await deactivePlan({ id: plan.id }).unwrap();
      toast.success(
        plan.status === "active"
          ? "Plan deactivated successfully."
          : "Plan activated successfully.",
      );
    } catch {
      toast.error(
        plan.status === "active"
          ? "Failed to deactivate this plan."
          : "Failed to activate this plan.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((planId) => planId !== id) : [...prev, id],
    );
  };

  const openEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setEditOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await deletePlan(deleteTarget.id).unwrap();
      toast.success(response?.message || "Plan deleted successfully.");
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not delete plan.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#E5E7EB] bg-white">
        {/* Toolbar Header */}
        <div className="border-b border-[#E5E7EB] p-5">
          <CustomTitleDescription
            title="Plans & Pricing"
            description="Create and manage subscription plans, pricing, features, and display order."
            action={
              <div className="flex w-full flex-wrap items-center justify-end gap-2">
                {/* Monthly / Annual Billing Toggle */}
                <div className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setBillingType("monthly")}
                    className={`inline-flex h-8 items-center rounded-md px-3 text-xs font-semibold transition ${
                      billingType === "monthly"
                        ? "bg-white text-[#170F49] shadow-xs"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingType("annually")}
                    className={`inline-flex h-8 items-center rounded-md px-3 text-xs font-semibold transition ${
                      billingType === "annually"
                        ? "bg-white text-[#170F49] shadow-xs"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Annual Billing
                  </button>
                </div>

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

                {/* Search */}
                <label className="flex h-10 min-w-52 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-500">
                  <Search className="h-4 w-4 shrink-0" />
                  <CustomInput
                    aria-label="Search plans"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search plans..."
                    className="h-auto border-0 bg-transparent p-0 shadow-none focus:border-0 focus:ring-0"
                  />
                </label>

                <Link
                  href="/dashboard/subscription/plan-pricing/create-new-plan"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primaryColor px-4 text-sm font-medium text-white hover:bg-[#038a9c]"
                >
                  <Plus className="h-4 w-4" />
                  Add new plan
                </Link>
              </div>
            }
          />
        </div>

        {/* Content */}
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
          <p className="p-6 text-sm text-red-500">Failed to load plans.</p>
        ) : visiblePlans.length === 0 ? (
          <p className="p-12 text-center text-sm text-gray-400">
            No {billingType === "monthly" ? "monthly" : "annual"} plans found.
          </p>
        ) : viewMode === "cards" ? (
          <div className="p-6">
            {canReorder && (
              <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <GripVertical className="h-3.5 w-3.5 text-gray-400" />
                  Drag cards or use the arrow buttons to set the display order
                  shown to subscribers.
                </span>
                {reordering && (
                  <span className="font-medium text-primaryColor">
                    Saving order…
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 xl:grid-cols-3">
              {visiblePlans.map((plan, index) => {
                const discount = getDiscountPercent(plan);
                const originalPrice = getOriginalPrice(plan);
                const isExpanded = expandedIds.includes(plan.id);
                const features = plan.features ?? [];
                const visibleFeatures = isExpanded
                  ? features
                  : features.slice(0, 6);
                const isActive = plan.status === "active";
                const isBusy = togglingId === plan.id;
                const isDragging = draggingId === plan.id;
                const isDragOver =
                  dragOverId === plan.id && draggingId !== plan.id;

                return (
                  <div
                    key={plan.id}
                    draggable={canReorder && !reordering}
                    onDragStart={(e) => {
                      setDraggingId(plan.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      if (!canReorder) return;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverId !== plan.id) setDragOverId(plan.id);
                    }}
                    onDragLeave={() => {
                      if (dragOverId === plan.id) setDragOverId(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropOn(plan.id);
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
                        : isActive
                          ? "border-borderColor hover:border-slate-300"
                          : "border-dashed border-gray-300 bg-gray-50/70 opacity-85"
                    } ${isDragging ? "scale-[0.98] opacity-50" : ""}`}
                  >
                    {discount > 0 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primaryColor px-3.5 py-0.5 text-xs font-bold leading-[160%] text-white shadow-xs">
                        Save {discount}%
                      </div>
                    )}

                    <div>
                      {/* Title + Active Switch */}
                      <div className="mt-1 flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-[#170F49]">
                          {plan.name}
                        </h3>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          disabled={isBusy}
                          onClick={() => void handleToggleActive(plan)}
                          title={
                            isActive
                              ? "Click to deactivate plan"
                              : "Click to activate plan"
                          }
                          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium transition hover:border-gray-300 disabled:opacity-60"
                        >
                          <span
                            className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
                              isActive ? "bg-primaryColor" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform ${
                                isActive ? "translate-x-3.5" : "translate-x-0.5"
                              }`}
                            />
                          </span>
                          <span
                            className={
                              isActive ? "text-emerald-700" : "text-gray-500"
                            }
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-4xl font-extrabold text-[#170F49]">
                          ${formatPrice(plan.billing_rate)}
                        </span>
                        <span className="pb-1 text-xs font-medium text-[#A0A3BD]">
                          Per user /{" "}
                          {plan.billing_cycle === "monthly"
                            ? "Monthly"
                            : "Yearly"}
                        </span>
                      </div>

                      {discount > 0 && (
                        <p className="mt-1 text-xs text-[#94A3B8]">
                          {originalPrice && (
                            <span className="line-through">
                              ${originalPrice}
                            </span>
                          )}{" "}
                          {plan.discount_duration && (
                            <span className="text-primaryColor">
                              Until {formatDiscountDate(plan.discount_duration)}
                            </span>
                          )}
                        </p>
                      )}

                      {/* Description */}
                      <p className="mt-3 min-h-[44px] text-sm leading-relaxed text-[#514F6E]">
                        {plan.short_description}
                      </p>

                      <div className="my-4 w-full border-t border-[#E1E4EA]" />

                      {/* Features */}
                      <ul className="space-y-2.5">
                        {visibleFeatures.map((feature, idx) => (
                          <li
                            key={`${plan.id}-${feature}-${idx}`}
                            className="flex items-center gap-2"
                          >
                            <CorrectIcon />
                            <span className="text-sm text-[#6F6C8F]">
                              {getFeatureLabel(feature)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {features.length > 6 && (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(plan.id)}
                          className="mt-4 flex items-center gap-1 text-sm font-medium text-primaryColor hover:underline"
                        >
                          <Plus className="h-4 w-4" />
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </div>

                    {/* Admin Meta + Reorder + Edit Footer */}
                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 font-semibold text-primaryColor">
                            <GripVertical className="h-3 w-3" />#{index + 1}
                          </span>
                          {canReorder && (
                            <div className="inline-flex items-center rounded-md border border-gray-200 bg-white">
                              <button
                                type="button"
                                aria-label={`Move ${plan.name} left`}
                                title="Move earlier"
                                disabled={index === 0 || reordering}
                                onClick={() => movePlan(plan.id, -1)}
                                className="p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Move ${plan.name} right`}
                                title="Move later"
                                disabled={
                                  index === visiblePlans.length - 1 ||
                                  reordering
                                }
                                onClick={() => movePlan(plan.id, 1)}
                                className="border-l border-gray-200 p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-medium capitalize text-gray-700">
                            {plan.plan_type}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 font-medium text-gray-600">
                          <Users className="h-3.5 w-3.5 text-primaryColor" />
                          {plan.total_subscribers ?? plan.subscribers ?? 0}{" "}
                          subscribers
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(plan)}
                          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primaryColor px-4 text-sm font-semibold text-white transition hover:bg-[#038a9c]"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Plan
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${plan.name}`}
                          disabled={(plan.total_subscribers ?? plan.subscribers ?? 0) > 0}
                          title={
                            (plan.total_subscribers ?? plan.subscribers ?? 0) > 0
                              ? "Cannot delete — this plan has subscriber history. Turn it Inactive instead."
                              : `Delete ${plan.name}`
                          }
                          onClick={() => setDeleteTarget(plan)}
                          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition ${
                            (plan.total_subscribers ?? plan.subscribers ?? 0) > 0
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm leading-5 text-gray-700">
              <thead className="border-b border-gray-200 bg-gray-50 text-sm font-medium leading-5 text-gray-600">
                <tr>
                  {[
                    "SL",
                    "Plan",
                    "Description",
                    "Amount",
                    "Subscribers",
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
                {visiblePlans.map((plan, index) => {
                  const isActive = plan.status === "active";
                  const isBusy = togglingId === plan.id;

                  return (
                    <tr
                      key={plan.id}
                      draggable={canReorder && !reordering}
                      onDragStart={(e) => {
                        setDraggingId(plan.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        if (!canReorder) return;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        if (dragOverId !== plan.id) setDragOverId(plan.id);
                      }}
                      onDragLeave={() => {
                        if (dragOverId === plan.id) setDragOverId(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDropOn(plan.id);
                      }}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setDragOverId(null);
                      }}
                      className={`transition-colors hover:bg-gray-50 ${
                        dragOverId === plan.id && draggingId !== plan.id
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
                          <CustomBadge
                            color={getPlanBadgeColor(plan.name)}
                            className="font-medium"
                          >
                            {plan.name}
                          </CustomBadge>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium capitalize text-gray-600">
                            {plan.plan_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="line-clamp-2 max-w-xs text-xs text-gray-500">
                          {plan.short_description || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle font-medium text-gray-800">
                        ${formatPrice(plan.billing_rate)}
                        <span className="text-xs font-normal text-gray-500">
                          {" "}
                          / {plan.billing_cycle === "yearly" ? "year" : "month"}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle font-medium text-gray-700">
                        {plan.total_subscribers ?? plan.subscribers ?? 0}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          disabled={isBusy}
                          onClick={() => void handleToggleActive(plan)}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium transition hover:border-gray-300 disabled:opacity-60"
                        >
                          <span
                            className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
                              isActive ? "bg-primaryColor" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform ${
                                isActive ? "translate-x-3.5" : "translate-x-0.5"
                              }`}
                            />
                          </span>
                          <span
                            className={
                              isActive ? "text-emerald-700" : "text-gray-500"
                            }
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          {canReorder && (
                            <div className="inline-flex items-center rounded border border-gray-200 bg-white">
                              <button
                                type="button"
                                aria-label={`Move ${plan.name} up`}
                                title="Move up"
                                disabled={index === 0 || reordering}
                                onClick={() => movePlan(plan.id, -1)}
                                className="p-1 text-gray-500 hover:bg-gray-100 hover:text-primaryColor disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Move ${plan.name} down`}
                                title="Move down"
                                disabled={
                                  index === visiblePlans.length - 1 ||
                                  reordering
                                }
                                onClick={() => movePlan(plan.id, 1)}
                                className="border-l border-gray-200 p-1 text-gray-500 hover:bg-gray-100 hover:text-primaryColor disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            aria-label={`Edit ${plan.name}`}
                            onClick={() => openEdit(plan)}
                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${plan.name}`}
                            disabled={(plan.total_subscribers ?? plan.subscribers ?? 0) > 0}
                            title={
                              (plan.total_subscribers ?? plan.subscribers ?? 0) > 0
                                ? "Cannot delete — this plan has subscriber history. Turn it Inactive instead."
                                : `Delete ${plan.name}`
                            }
                            onClick={() => setDeleteTarget(plan)}
                            className={`rounded-md p-2 ${
                              (plan.total_subscribers ?? plan.subscribers ?? 0) > 0
                                ? "cursor-not-allowed text-gray-300"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <CustomModal
        open={editOpen}
        onOpenChange={setEditOpen}
        size="xl"
        showCloseButton={false}
      >
        <CreatePlan
          key={selectedPlan?.id}
          data={selectedPlan}
          onClose={() => {
            setEditOpen(false);
            setSelectedPlan(null);
          }}
        />
      </CustomModal>

      <CustomDeletModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete subscription plan?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed.`
            : ""
        }
        confirmText="Delete"
      />
    </div>
  );
}
