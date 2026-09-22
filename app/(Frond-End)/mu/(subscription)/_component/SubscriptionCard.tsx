import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import Link from "next/link";

function SubscriptionCard() {
  const { data, isLoading, isError } = useGetUserProfileQuery("");
  const isSubscribed = data?.subscription?.is_subscribed;
  const planName = data?.subscription?.plan_name;

  return (
    <div
      className={`${isSubscribed ? "bg-[#B7A504]" : "bg-primaryColor"}  flex flex-col justify-center text-center gap-1 rounded-2xl md:p-4 p-3`}
    >
      <h3 className="text-lg text-whiteColor font-semibold">Subscription </h3>
      {isSubscribed ? (
        <div>
          <div className=" ">
            <span className="font-bold text-whiteColor tracking-wide">
              {planName}
            </span>
          </div>
          <p className="text-sm text-whiteColor">
            Your’e experiencing premium subscription.
          </p>
        </div>
      ) : (
        <p className="text-sm text-whiteColor">
          Try your experience for using more features
        </p>
      )}

      {!isSubscribed ? (
        <Link
          href="/mu/subscription?billing=monthly"
          className={`text-sm  bg-whiteColor font-semibold px-4 py-3 rounded-md mt-2  text-primaryColor `}
        >
          {"Upgrade Now"}
        </Link>
      ) : (
        <Link
          href="#"
          className={`text-sm  bg-whiteColor font-semibold px-4 py-3 rounded-md mt-2  text-[#B7A504] `}
        >
          {"Upgrade to Pro Industry"}
        </Link>
      )}
    </div>
  );
}

export default SubscriptionCard;
