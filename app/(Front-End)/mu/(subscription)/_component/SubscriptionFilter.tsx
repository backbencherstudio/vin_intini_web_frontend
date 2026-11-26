"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
function SubscriptionFilter() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const billingCycle = searchParams.get("billing") || "monthly";
  const setBillingCycle = (cycle: "monthly" | "yearly") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("billing", cycle);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="my-6 flex justify-center">
      <div
        role="tablist"
        aria-label="Billing cycle"
        className="inline-flex items-center rounded-xl border border-borderColor bg-gray-50 p-1.5 shadow-xs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={billingCycle === "monthly"}
          onClick={() => setBillingCycle("monthly")}
          className={`cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
            billingCycle === "monthly"
              ? "bg-primaryColor text-white shadow-xs"
              : "text-descriptionColor hover:text-headerColor"
          }`}
        >
          Monthly Billing
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={billingCycle === "yearly"}
          onClick={() => setBillingCycle("yearly")}
          className={`cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
            billingCycle === "yearly"
              ? "bg-primaryColor text-white shadow-xs"
              : "text-descriptionColor hover:text-headerColor"
          }`}
        >
          Annual Billing
        </button>
      </div>
    </div>
  );
}

export default SubscriptionFilter;
