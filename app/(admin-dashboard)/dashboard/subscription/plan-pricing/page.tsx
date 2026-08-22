"use client";

import { CorrectIcon } from "@/public/svgIcons/AdminIcon";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  isActive: boolean;
  savePercentage?: string;
  originalPrice?: string;
}

export default function PlanPricingPage() {
  const [billingType, setBillingType] = useState<"monthly" | "annually">("annually");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Basic Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for students and professionals getting started.",
      features: [
        "Professional Profile",
        "Search Members",
        "Up to 500 Connections",
        "Within-Network Messaging",
        "Join up to 3 Groups",
        "Job Search",
      ],
      isActive: true,
    },
    {
      id: "2",
      name: "Professional",
      monthlyPrice: 8.99,
      yearlyPrice: 6.99,
      description: "Unlock advanced networking and career opportunities.",
      features: [
        "Everything in Standard",
        "Unlimited Connections",
        "Apply for Jobs",
        "Connect with Organizations",
        "Unlimited Messaging",
        "Profile Insights",
      ],
      isActive: true,
    },
    {
      id: "3",
      name: "Pro Industry",
      monthlyPrice: 12.99,
      yearlyPrice: 9.99,
      description: "Built for organizations, recruiters, and industry partners.",
      features: [
        "Everything in Premium",
        "Product Advertisements",
        "Organization Profile",
        "Recruiter Dashboard",
        "Job Posting & Management",
        "Candidate Management",
      ],
      isActive: true,
      savePercentage: "Save 20%",
      originalPrice: "$12.99",
    },
  ]);

  const handleToggleActive = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    setOpenMenuId(null);
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    setOpenMenuId(null);
  };

  // প্রাইস বের করার ফাংশন
  const getPrice = (plan: Plan) => {
    return billingType === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">Plan & Pricing</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Create and manage subscription plans, pricing, and features.
          </p>
        </div>

        <Link
          href="/dashboard/subscription/plan-pricing/create-new-plan"
          className="flex items-center gap-2 rounded-lg bg-[#04A1B7] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#038a9c]"
        >
          + Add new plan
        </Link>
      </div>

      {/* Billing Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center rounded-lg border border-[#E1E4EA] bg-[#F1F2F9] p-1">
          <button
            onClick={() => setBillingType("monthly")}
            className={`rounded-lg px-5 py-2 text-base font-semibold leading-[150%] tracking-[0.08px] transition ${
              billingType === "monthly"
                ? "bg-white text-[#170F49]"
                : "text-[#170F49]"
            }`}
          >
            Monthly billing
          </button>

          <button
            onClick={() => setBillingType("annually")}
            className={`rounded-lg px-5 py-2 text-base font-semibold leading-[150%] tracking-[0.08px] transition ${
              billingType === "annually"
                ? "bg-white text-[#170F49]"
                : "text-[#170F49]"
            }`}
          >
            Annually billing
          </button>

          {/* শুধু Annually হলে Save 20% দেখাবে */}
          {billingType === "annually" && (
            <span className="ml-1.5 rounded-lg bg-[#D9DBE9] px-2.5 py-1.5 text-sm font-semibold leading-[140%] tracking-[0.07px] text-[#6F6C8F]">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative flex flex-col rounded-2xl border border-[#E1E4EA] bg-white p-6"
          >
            {/* 3-dot Menu */}
            <div className="absolute right-4 top-4">
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === plan.id ? null : plan.id)
                }
                className="rounded-full p-1.5 text-[#64748B] hover:bg-gray-100"
              >
                ⋮
              </button>

              {openMenuId === plan.id && (
                <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-[#E1E4EA] bg-white py-1 shadow-lg">
                  <button
                    onClick={() => handleToggleActive(plan.id)}
                    className="block w-full px-4 py-2.5 text-left text-sm text-[#0F172A] hover:bg-[#E9FAF7]"
                  >
                    {plan.isActive ? "Deactivate this plan" : "Active This Plan"}
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Plan Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold leading-[130%] tracking-[0.12px] text-[#170F49]">
                  {plan.name}
                </h3>

                {/* Save 20% শুধু Annually + থাকলে */}
                {plan.savePercentage && billingType === "annually" && (
                  <span className="rounded-full bg-[#E9FAF7] px-2.5 py-0.5 text-xs font-medium text-[#04A1B7]">
                    {plan.savePercentage}
                  </span>
                )}
              </div>

              {/* Dynamic Price */}
              <div className="mt-3 flex items-end gap-2">
                <span className="text-[56px] font-semibold leading-[130%] text-[#170F49]">
                  ${getPrice(plan)}
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-normal leading-[150%] tracking-[0.08px] text-[#A0A3BD]">
                    Per user
                  </span>
                  <p className="text-base font-normal leading-[150%] tracking-[0.08px] text-[#A0A3BD]">
                    {billingType === "monthly" ? "Monthly" : "Yearly"}
                  </p>
                </div>
              </div>

              {/* Original Price শুধু Annually হলে */}
              {plan.originalPrice && billingType === "annually" && (
                <p className="mt-1 text-sm text-[#94A3B8] line-through">
                  {plan.originalPrice} Until 20th July, 2026
                </p>
              )}
            </div>

            {/* Description */}
            <p className="mb-5 min-h-[48px] text-base font-normal leading-[150%] tracking-[0.08px] text-[#514F6E]">
              {plan.description}
            </p>

            {/* Features */}
            <ul className="space-y-2.5">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CorrectIcon />
                  <span className="text-base font-normal leading-[150%] tracking-[0.08px] text-[#6F6C8F]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button className="mt-5 flex items-center gap-1 text-base font-normal leading-[150%] tracking-[0.08px] text-[#04A1B7] hover:underline">
              <Plus className="h-4 w-4" />
              Show More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}