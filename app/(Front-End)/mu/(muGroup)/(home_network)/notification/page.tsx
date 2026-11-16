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
import { ShieldCheck } from "lucide-react";
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
  applicant_name?: string | null;
  applicant_id?: number | string | null;
  sender_profile_image_url?: string | null;
  acceptor_profile_image_url?: string | null;
  applicant_profile_url?: string | null;
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

function cleanText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/mindunite admin/gi, "Mind Unite Team")
    .replace(/mind unite admin/gi, "Mind Unite Team")
    .replace(/approved and published/gi, "approved and activated")
    .replace(/from rejected to published/gi, "from Rejected to Active")
    .replace(/to published/gi, "to Active")
    .replace(/\bpublished\b/gi, "Active")
    .replace(/\(on_site\)/gi, "(On-site)")
    .replace(/\(part_time\)/gi, "(Part-time)")
    .replace(/\(full_time\)/gi, "(Full-time)");
}

function NotificationPage() {
  const { data, isLoading } = useGetNotificationsQuery("notifications");
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

          const rawSender =
            item?.data?.sender_name ||
            item?.data?.acceptor_name ||
            item?.data?.applicant_name ||
            "";

          const isAdminOrSystem =
            !rawSender ||
            rawSender.toLowerCase().includes("admin") ||
            rawSender.toLowerCase().includes("mindunite") ||
            rawSender.toLowerCase().includes("mind unite") ||
            rawType.toLowerCase().includes("admin") ||
            rawType.toLowerCase().includes("system") ||
            rawType.includes("JobStatus") ||
            rawType.includes("JobRejected") ||
            rawType.includes("ProductStatus") ||
            rawType.includes("ProductRejected");

          const displaySender = isAdminOrSystem ? "Mind Unite Team" : rawSender;

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
                <div className="h-10 w-10 shrink-0 rounded-full">
                  {isAdminOrSystem ? (
                    <div
                      className="w-10 h-10 rounded-full bg-[#e8f8f9] text-primaryColor flex items-center justify-center border border-primaryColor/25 shrink-0 shadow-2xs"
                      title="Mind Unite Official Notification"
                    >
                      <ShieldCheck className="w-5 h-5 text-primaryColor" />
                    </div>
                  ) : item?.data?.sender_profile_image_url ||
                    item?.data?.acceptor_profile_image_url ||
                    item?.data?.applicant_profile_url ? (
                    <Image
                      src={
                        item?.data?.sender_profile_image_url ||
                        item?.data?.acceptor_profile_image_url ||
                        item?.data?.applicant_profile_url ||
                        ""
                      }
                      alt={displaySender}
                      width={40}
                      height={40}
                      className="rounded-full w-full h-full object-cover"
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
                  <div>
                    {targetHref ? (
                      <Link href={targetHref}>
                        <span className="font-bold text-headerColor hover:text-primaryColor transition-colors">
                          {displaySender}
                        </span>
                      </Link>
                    ) : (
                      <span className="font-bold text-headerColor">
                        {displaySender}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-[1.3] text-headerColor mt-0.5">
                    <span className="font-normal">{cleanText(item?.data?.message)}</span>
                  </p>

                  {isJobRejected && (item?.data?.rejection_reason || item?.data?.description) && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">
                      Reason:{" "}
                      <span className="font-normal">
                        {cleanText(
                          (item?.data?.rejection_reason || item?.data?.description || "").replace(/^Reason:\s*/i, "")
                        )}
                      </span>
                    </p>
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
