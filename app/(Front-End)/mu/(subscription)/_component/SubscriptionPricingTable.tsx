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

  const isCentered = plans.length <= 2;
  return (
    <div className="w-full">
      <div
        className={
          isCentered
            ? "flex flex-wrap justify-center items-stretch gap-6"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-stretch"
        }
      >
        {plans.map((plan) => {
          const isFree = parseFloat(plan.billing_rate) === 0;

          return (
            <div
              key={plan.id}
              className={
                isCentered
                  ? "bg-white border border-borderColor rounded-2xl hover:shadow-md overflow-hidden flex flex-col w-full sm:max-w-[400px]"
                  : "bg-white border border-borderColor rounded-2xl hover:shadow-md overflow-hidden flex flex-col"
              }
            >
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
                    <div>
                      <span className="text-base md:text-lg lg:text-xl font-semibold">
                        ${plan.billing_rate}
                      </span>
                      <span className="text-sm font-normal opacity-90 capitalize">
                        /{plan.billing_cycle === "monthly" ? "Month" : "Year"}
                      </span>
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
