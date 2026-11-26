import Link from "next/link";
import { HiBadgeCheck } from "react-icons/hi";

const CrossIcon = () => (
  <svg
    className="w-4 h-4 text-red-500 inline-block"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const getContrastTextColor = (hex?: string) => {
  if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return "#ffffff";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.68 ? "#170F49" : "#ffffff";
};

export default function SubscriptionCards({ plans, billingCycle }) {
  const renderValue = (val) => {
    if (typeof val === "boolean") {
      return val ? (
        <HiBadgeCheck className="text-primaryColor text-xl" />
      ) : (
        <CrossIcon />
      );
    }
    return <span className="text-gray-700 text-xs font-medium">{val}</span>;
  };

  if (!plans.length) {
    return (
      <div className="col-span-3 text-center py-10">
        <p className="text-descriptionColor text-lg font-medium">
          No subscription plans available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pt-3">
      <div className="flex flex-wrap justify-center items-stretch gap-6">
        {plans.map((plan) => {
          const isFree = parseFloat(plan.billing_rate) === 0;
          const discount = Number(plan.discount_percent) || 0;
          const badgeColor =
            plan.badge_color && /^#[0-9A-Fa-f]{6}$/.test(plan.badge_color)
              ? plan.badge_color
              : undefined;
          const badgeTextColor = badgeColor
            ? getContrastTextColor(badgeColor)
            : undefined;

          return (
            <div
              key={plan.id}
              className="relative bg-white border border-borderColor rounded-2xl hover:shadow-md flex flex-col w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              {discount > 0 && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primaryColor px-3.5 py-0.5 text-xs font-bold leading-[160%] text-white shadow-xs"
                  style={
                    badgeColor
                      ? { backgroundColor: badgeColor, color: badgeTextColor }
                      : undefined
                  }
                >
                  Save {discount}%
                </div>
              )}
              <div className="p-6 text-center border-b border-borderColor flex flex-col justify-between sm:min-h-[268px]">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-headerColor">
                    {plan.name}
                  </h3>
                  {plan.short_description && (
                    <p className="mt-2.5 mb-4 text-xs sm:text-sm leading-relaxed text-descriptionColor">
                      {plan.short_description}
                    </p>
                  )}
                  {!plan.short_description && <div className="mb-4" />}
                </div>

                {isFree ? (
                  <button className="w-full py-2.5 px-4 border border-primaryColor text-gray-800 font-semibold rounded-lg text-sm hover:bg-teal-50 transition-colors">
                    Free
                  </button>
                ) : (
                  <Link
                    className="w-full py-2.5 px-4 block hover:shadow-md bg-primaryColor text-white font-semibold rounded-lg text-sm hover:opacity-95 transition-opacity"
                    href={`/mu/subscription/${plan.id}`}
                  >
                    <div className="flex items-baseline justify-center gap-2">
                      {discount > 0 &&
                        plan.original_billing_rate &&
                        Number(plan.original_billing_rate) >
                          Number(plan.billing_rate) && (
                          <span className="text-xs md:text-sm line-through opacity-75">
                            ${plan.original_billing_rate}
                          </span>
                        )}
                      <div>
                        <span className="text-base md:text-lg lg:text-xl font-semibold">
                          ${plan.billing_rate}
                        </span>
                        <span className="text-sm font-normal opacity-90 capitalize">
                          /{plan.billing_cycle === "monthly" ? "Month" : "Year"}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              <div className="divide-y divide-borderColor flex-1">
                {plan.features?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className="text-sm md:text-base font-medium text-headerColor pr-3">
                      {item.key}
                    </span>
                    <div className="shrink-0 flex items-center justify-center">
                      {renderValue(item.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
