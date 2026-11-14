"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  useClearNotificationsMutation,
  useGetNotificationsQuery,
  useUpdateNotificationReadStatusMutation,
} from "@/feature/slice/notifications/notificationSlice";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { calculateTime } from "./_components/CalculateTime";
import NotificationSkeleton from "./_components/NotificationSkeleton";
import toast from "react-hot-toast";

type NotificationDataType = {
  connection_request_id?: number;
  sender_id?: number;
  sender_name?: string;
  sender_username?: string | null;
  inviter_username?: string | null;
  acceptor_name?: string;
  sender_profile_image_url?: string | null;
  acceptor_profile_image_url?: string | null;
  message?: string;
  description?: string | null;
  action_url?: string | null;
  rejection_reason?: string | null;
  previous_status?: string | null;
  product_name?: string | null;
  product_id?: number | string | null;
  job_id?: number | string | null;
  job_unique_id?: string | null;
  job_title?: string | null;
  industry_id?: number | string | null;
  industry_name?: string | null;
  industry_slug?: string | null;
  status?: string | null;
  type: string;
  requested_at?: string;
};

type NotificationItem = {
  id: string;
  type: string;
  data: NotificationDataType;
  is_read?: boolean;
  read_at?: string;
  created_at: string;
};

function NotificationPage() {
  const { data, isLoading, error } = useGetNotificationsQuery("notifications");
  const [markAsRead] = useUpdateNotificationReadStatusMutation();
  const [clearNotifications, { isLoading: isClearing }] =
    useClearNotificationsMutation();
  useEffect(() => {
    markAsRead("mark-all-as-read");
  }, [markAsRead]);

  if (isLoading) {
    return <NotificationSkeleton />;
  }
  const handleClear = async () => {
    try {
      await clearNotifications(undefined).unwrap();
      toast.success("All notifications cleared successfully!");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <section className="w-full bg-white px-3 pb-12 pt-4 md:px-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-lg font-semibold leading-tight text-headerColor">
          Notifications
        </h1>
        <ButtonReuseable
          title="Clear All"
          onClick={handleClear}
          loading={isClearing}
          sendingMsg={"clearing..."}
          className="py-2! text-sm! bg-primaryColor!"
        />
      </div>

      <div className="mt-4 border-t border-borderColor">
        {data?.data.map((item: NotificationItem) => {
          const rawType = item?.type || item?.data?.type || "";

          // Check if this is a job-related notification
          const isJobNotification =
            rawType.includes("Job") ||
            Boolean(item?.data?.job_id) ||
            Boolean(item?.data?.job_title);

          const isJobRejected =
            isJobNotification &&
            (rawType === "JobRejectedNotification" ||
              item?.data?.status === "rejected");

          const isJobRestored =
            isJobNotification &&
            (rawType === "JobStatusUpdatedNotification" ||
              item?.data?.previous_status === "rejected");

          const isAdminCreatedJob =
            isJobNotification && rawType === "AdminCreatedJobNotification";

          const isJobApplicationUpdated =
            isJobNotification &&
            rawType === "JobApplicationStatusUpdatedNotification";

          // Check if this is a product-related notification
          const isProductNotification =
            !isJobNotification &&
            (rawType.includes("Product") ||
              Boolean(item?.data?.product_id) ||
              Boolean(item?.data?.product_name));

          const isProductRejected =
            isProductNotification &&
            (rawType === "ProductRejectedNotification" ||
              item?.data?.status === "rejected");

          const isProductRestored =
            isProductNotification &&
            (rawType === "ProductStatusUpdatedNotification" ||
              item?.data?.previous_status === "rejected");

          const targetUsername =
            item?.data?.sender_username || item?.data?.inviter_username;

          const targetHref = item?.data?.action_url
            ? item.data.action_url
            : isJobNotification
              ? "/mu/recruiter-dashboard"
              : isProductNotification
                ? "/mu/products"
                : targetUsername
                  ? `/mu/profile/${targetUsername}`
                  : null;

          const displaySender =
            item?.data?.sender_name ||
            item?.data?.acceptor_name ||
            "MindUnite";

          const isNegative = isProductRejected || isJobRejected;
          const isPositive =
            isProductRestored ||
            isJobRestored ||
            isAdminCreatedJob ||
            isJobApplicationUpdated;

          return (
            <article
              key={item.id}
              className="relative flex items-end justify-between gap-3 border-b border-[#d9d9d9] px-3 py-6 md:px-5"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full ">
                  {item?.data?.sender_profile_image_url ||
                  item?.data?.acceptor_profile_image_url ? (
                    <Image
                      src={
                        item?.data?.sender_profile_image_url ||
                        item?.data?.acceptor_profile_image_url ||
                        ""
                      }
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full w-full h-full"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        isNegative
                          ? "bg-rose-600"
                          : isPositive
                            ? "bg-emerald-600"
                            : "bg-primaryColor"
                      }`}
                    >
                      {displaySender.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {targetHref ? (
                      <Link href={targetHref} className="hover:underline">
                        <span className="font-bold">{displaySender}</span>
                      </Link>
                    ) : (
                      <span className="font-bold">{displaySender}</span>
                    )}

                    {isJobRejected && (
                      <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                        Job Rejected
                      </span>
                    )}

                    {!isJobRejected && isJobRestored && (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        Job Status Updated
                      </span>
                    )}

                    {isAdminCreatedJob && (
                      <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700">
                        Job Posted by Admin
                      </span>
                    )}

                    {isJobApplicationUpdated && (
                      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        Application Status Updated
                      </span>
                    )}

                    {isProductRejected && (
                      <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                        Product Rejected
                      </span>
                    )}

                    {!isProductRejected && isProductRestored && (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        Product Status Updated
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-[1.3] text-headerColor mt-0.5">
                    <span className="font-normal">{item?.data?.message}</span>
                  </p>

                  {isJobRejected &&
                  (item?.data?.rejection_reason || item?.data?.description) ? (
                    <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50/75 px-3 py-2 text-xs text-rose-800">
                      <p className="leading-relaxed">
                        {item?.data?.description ||
                          `Reason: ${item?.data?.rejection_reason}`}
                      </p>
                      <Link
                        href={item?.data?.action_url || "/mu/recruiter-dashboard"}
                        className="mt-1 inline-block font-semibold text-rose-700 hover:underline"
                      >
                        View recruiter dashboard &rarr;
                      </Link>
                    </div>
                  ) : (isJobRestored || isAdminCreatedJob) &&
                    (item?.data?.description || item?.data?.message) ? (
                    <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/75 px-3 py-2 text-xs text-emerald-800">
                      <p className="leading-relaxed">
                        {item?.data?.description || item?.data?.message}
                      </p>
                      <Link
                        href={item?.data?.action_url || "/mu/recruiter-dashboard"}
                        className="mt-1 inline-block font-semibold text-emerald-700 hover:underline"
                      >
                        View recruiter dashboard &rarr;
                      </Link>
                    </div>
                  ) : isJobApplicationUpdated &&
                    (item?.data?.description || item?.data?.message) ? (
                    <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50/75 px-3 py-2 text-xs text-blue-800">
                      <p className="leading-relaxed">
                        {item?.data?.description || item?.data?.message}
                      </p>
                      <Link
                        href={item?.data?.action_url || "/mu/jobs/my-applications"}
                        className="mt-1 inline-block font-semibold text-blue-700 hover:underline"
                      >
                        View my applications &rarr;
                      </Link>
                    </div>
                  ) : isProductRejected &&
                  (item?.data?.rejection_reason || item?.data?.description) ? (
                    <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50/75 px-3 py-2 text-xs text-rose-800">
                      <p className="leading-relaxed">
                        {item?.data?.description ||
                          `Reason: ${item?.data?.rejection_reason}`}
                      </p>
                      <Link
                        href={item?.data?.action_url || "/mu/products"}
                        className="mt-1 inline-block font-semibold text-rose-700 hover:underline"
                      >
                        View product listings &rarr;
                      </Link>
                    </div>
                  ) : isProductRestored && item?.data?.description ? (
                    <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/75 px-3 py-2 text-xs text-emerald-800">
                      <p className="leading-relaxed">{item.data.description}</p>
                      <Link
                        href={item?.data?.action_url || "/mu/products"}
                        className="mt-1 inline-block font-semibold text-emerald-700 hover:underline"
                      >
                        View product listings &rarr;
                      </Link>
                    </div>
                  ) : (
                    item?.data?.description && (
                      <p className="mt-1 text-xs leading-tight text-descriptionColor ">
                        {item?.data?.description}
                      </p>
                    )
                  )}
                </div>
              </div>

              {item?.created_at && (
                <p className="shrink-0 pt-1 text-xs leading-none text-descriptionColor">
                  {calculateTime(item?.created_at)}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default NotificationPage;
