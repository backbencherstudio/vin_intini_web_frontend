"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import {
  useClearNotificationsMutation,
  useGetNotificationsQuery,
  useUpdateNotificationReadStatusMutation,
} from "@/feature/slice/notifications/notificationSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldCheck, BellOff } from "lucide-react";
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
  post_id?: number | string | null;
  comment_id?: number | string | null;
  reply_id?: number | string | null;
  group_id?: number | string | null;
  group_slug?: string | null;
  conversation_id?: number | string | null;
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
    .replace(/to reviewing/gi, "to In Review")
    .replace(/to interviewed/gi, "to Interview")
    .replace(/to acceptance/gi, "to Hired")
    .replace(/to offering/gi, "to Offered")
    .replace(/to reject\b/gi, "to Rejected")
    .replace(/\(on_site\)/gi, "(On-site)")
    .replace(/\(part_time\)/gi, "(Part-time)")
    .replace(/\(full_time\)/gi, "(Full-time)");
}

/**
 * Intelligently resolves the destination URL for any notification.
 * Fixes candidate notifications wrongly routing to recruiter-dashboard.
 */
function resolveNotificationHref(item: NotificationItem): string {
  const data = item?.data || ({} as NotificationDataType);
  const rawType = item?.type || data?.type || "";
  const msg = (data?.message || "").toLowerCase();

  // 1. Candidate Application Status Updates (Candidate perspective)
  // When an industry updates applicant's status -> Candidate must go to their applications page
  if (
    rawType === "JobApplicationStatusUpdatedNotification" ||
    msg.includes("updated your application") ||
    msg.includes("your application for")
  ) {
    const rawStatus = (data?.status || "").toLowerCase().trim();
    const statusMap: Record<string, string> = {
      reviewing: "reviewing",
      interviewed: "interviewed",
      shortlisted: "shortlisted",
      offered: "offered",
      hired: "hired",
      rejected: "rejected",
      pending: "pending",
    };
    const mapped = statusMap[rawStatus];
    const statusParam = mapped ? `?status=${encodeURIComponent(mapped)}` : "";
    return `/mu/jobs/my-applications${statusParam}`;
  }

  // 2. Recruiter Job Application Received (Recruiter perspective)
  // When a candidate applies for an industry's job -> Recruiter goes to applicants list
  if (
    rawType === "JobApplicationReceivedNotification" ||
    msg.includes("applied for your job")
  ) {
    if (data?.job_id) {
      return `/mu/job-listing/${data.job_id}/applicants`;
    }
    return "/mu/job-listing";
  }

  // 3. Admin Job Rejection (Recruiter perspective)
  // Industry owner should be taken to job details page
  if (
    rawType === "JobRejectedNotification" ||
    (rawType.includes("Job") &&
      data?.status === "rejected" &&
      msg.includes("rejected your job"))
  ) {
    if (data?.job_id) {
      return `/mu/job-listing/${data.job_id}/job-details`;
    }
    return "/mu/job-listing";
  }

  // 4. Admin Job Approval / Status Update / Creation (Recruiter perspective)
  if (
    rawType === "JobStatusUpdatedNotification" ||
    rawType === "AdminCreatedJobNotification" ||
    (rawType.includes("Job") &&
      (msg.includes("approved") ||
        msg.includes("posted a new job") ||
        msg.includes("status of your job")))
  ) {
    if (data?.job_id) {
      return `/mu/job-listing/${data.job_id}/job-details`;
    }
    return "/mu/job-listing";
  }

  // 5. Product Rejection / Status Updates
  if (
    rawType === "ProductRejectedNotification" ||
    rawType === "ProductStatusUpdatedNotification" ||
    rawType.includes("Product") ||
    Boolean(data?.product_id)
  ) {
    if (
      data?.product_id &&
      (data?.status === "rejected" || msg.includes("rejected"))
    ) {
      return `/mu/products/${data.product_id}/edit`;
    }
    if (data?.product_id) {
      return `/mu/products/${data.product_id}`;
    }
    return "/mu/products";
  }

  // 6. Post / Comment interactions (Likes, Comments, Replies)
  if (
    rawType === "PostLikedNotification" ||
    rawType === "PostCommentedNotification" ||
    rawType === "CommentRepliedNotification" ||
    rawType === "ReplyLikedNotification" ||
    rawType === "CommentLikedNotification" ||
    msg.includes("commented on your post") ||
    msg.includes("replied to your comment") ||
    msg.includes("liked your comment") ||
    msg.includes("liked your reply") ||
    Boolean(data?.post_id)
  ) {
    if (data?.post_id) {
      const params = new URLSearchParams();

      const isReplyNotification =
        rawType === "CommentRepliedNotification" ||
        rawType === "ReplyLikedNotification" ||
        msg.includes("replied") ||
        msg.includes("liked your reply");

      if (isReplyNotification) {
        if (data?.reply_id) {
          params.set("reply_id", String(data.reply_id));
        }
        if (data?.comment_id) {
          if (!data?.reply_id) {
            // Legacy notification format where comment_id was actually reply_id
            params.set("reply_id", String(data.comment_id));
          } else {
            params.set("comment_id", String(data.comment_id));
          }
        }
      } else if (data?.comment_id) {
        params.set("comment_id", String(data.comment_id));
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      return `/mu/post/${data.post_id}${queryString}`;
    }
  }

  // 7. Group Invitations & Group Activities
  if (
    rawType === "GroupInvitationNotification" ||
    rawType === "GroupInvitationAcceptedNotification" ||
    Boolean(data?.group_id) ||
    Boolean(data?.group_slug)
  ) {
    const groupTarget = data?.group_slug || data?.group_id;
    if (groupTarget) {
      return `/mu/my-network/group/${groupTarget}`;
    }
    return "/mu/my-network";
  }

  // 8. Connection Requests
  if (
    rawType === "ConnectionRequestReceivedNotification" ||
    (msg.includes("connection request") && !msg.includes("accepted"))
  ) {
    return "/mu/my-network/connection-requests";
  }

  if (
    rawType === "ConnectionRequestAcceptedNotification" ||
    msg.includes("accepted your connection request")
  ) {
    const username = data?.sender_username || data?.acceptor_name;
    if (username) return `/mu/profile/${username}`;
    if (data?.sender_id) return `/mu/profile/${data.sender_id}`;
    return "/mu/my-network";
  }

  // 9. Messages
  if (rawType === "NewMessageNotification" || rawType.includes("Message")) {
    const senderId = data?.sender_id || data?.conversation_id;
    if (senderId) {
      return `/mu/message/${senderId}`;
    }
    return "/mu/message";
  }

  // 10. Valid action_url from backend (override if it was wrongly pointing to recruiter-dashboard for candidate)
  if (data?.action_url && !data.action_url.includes("recruiter-dashboard")) {
    if (data.action_url.includes("/job-listing/") && data.action_url.endsWith("/edit")) {
      return data.action_url.replace(/\/edit$/, "/job-details");
    }
    return data.action_url;
  }

  // 11. Profile fallback
  const targetUsername = data?.sender_username || data?.inviter_username;
  if (targetUsername) {
    return `/mu/profile/${targetUsername}`;
  }
  if (data?.sender_id) {
    return `/mu/profile/${data.sender_id}`;
  }

  return "/mu/notification";
}

function NotificationPage() {
  const router = useRouter();
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

  const notifications: NotificationItem[] = data?.data || [];

  return (
    <section className="w-full bg-white px-3 pb-12 pt-4 md:px-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-lg font-semibold leading-tight text-headerColor">
          Notifications
        </h1>
        {notifications.length > 0 && (
          <ButtonReuseable
            title="Clear All"
            onClick={handleClear}
            loading={isClearing}
            sendingMsg={"clearing..."}
            className="py-2! text-sm! bg-primaryColor!"
          />
        )}
      </div>

      <div className="mt-4 border-t border-borderColor">
        {notifications.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center text-descriptionColor">
            <div className="w-14 h-14 rounded-full bg-bgColor flex items-center justify-center mb-3 text-gray-400">
              <BellOff className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-headerColor mb-1">
              No notifications yet
            </p>
            <p className="text-xs sm:text-sm text-grayColor1 max-w-sm">
              We&apos;ll notify you when you receive application updates, connection requests, or new activities.
            </p>
          </div>
        ) : (
          notifications.map((item: NotificationItem) => {
            const rawType = item?.type || item?.data?.type || "";

            // Identify special notification classes
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
              (rawType === "JobApplicationStatusUpdatedNotification" ||
                (item?.data?.message || "").includes("updated your application"));

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

            const targetHref = resolveNotificationHref(item);

            const rawSender =
              item?.data?.sender_name ||
              item?.data?.industry_name ||
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

            // Sender profile link
            const senderProfileHref = (() => {
              // When a job application status is updated, clicking the industry title must take the candidate directly to their application
              if (isJobApplicationUpdated) {
                return targetHref;
              }
              if (item?.data?.industry_id || item?.data?.industry_slug) {
                return `/mu/industry/${item.data.industry_id || item.data.industry_slug}`;
              }
              const targetUsername =
                item?.data?.sender_username || item?.data?.inviter_username;
              if (targetUsername) return `/mu/profile/${targetUsername}`;
              if (item?.data?.sender_id) return `/mu/profile/${item.data.sender_id}`;
              return null;
            })();

            const isNegative = isProductRejected || isJobRejected;
            const isPositive =
              isProductRestored ||
              isJobRestored ||
              isAdminCreatedJob ||
              isJobApplicationUpdated;

            return (
              <article
                key={item.id}
                onClick={() => {
                  if (targetHref) {
                    router.push(targetHref);
                  }
                }}
                className="relative flex items-center justify-between gap-3 border-b border-borderColor/60 px-3 py-4 md:px-5 hover:bg-slate-50/80 transition-colors cursor-pointer rounded-xl group"
              >
                <div className="flex items-start gap-3 md:gap-4 min-w-0">
                  {/* Avatar / Icon Container */}
                  <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-borderColor/50 flex items-center justify-center bg-bgColor">
                    {isAdminOrSystem ? (
                      <div
                        className="w-full h-full bg-[#e8f8f9] text-primaryColor flex items-center justify-center"
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
                        className={`w-full h-full flex items-center justify-center text-white font-bold text-sm ${
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

                  {/* Notification Content */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {senderProfileHref ? (
                        <Link
                          href={senderProfileHref}
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-headerColor hover:text-primaryColor transition-colors"
                        >
                          {displaySender}
                        </Link>
                      ) : (
                        <span className="font-bold text-headerColor">
                          {displaySender}
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-snug text-headerColor mt-0.5 group-hover:text-black transition-colors">
                      <span className="font-normal">
                        {cleanText(item?.data?.message)}
                      </span>
                    </p>

                    {isJobRejected &&
                      (item?.data?.rejection_reason || item?.data?.description) && (
                        <p className="text-xs text-rose-600 mt-1 font-medium">
                          Reason:{" "}
                          <span className="font-normal">
                            {cleanText(
                              (
                                item?.data?.rejection_reason ||
                                item?.data?.description ||
                                ""
                              ).replace(/^Reason:\s*/i, "")
                            )}
                          </span>
                        </p>
                      )}
                  </div>
                </div>

                {item?.created_at && (
                  <p className="shrink-0 pt-0.5 text-xs text-descriptionColor whitespace-nowrap self-start">
                    {calculateTime(item?.created_at)}
                  </p>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default NotificationPage;
