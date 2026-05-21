import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import { useAcceptGroupInvitationMutation } from "@/feature/slice/group/groupSlice";
import { OpenEyeIcon } from "@/public/svgIcons/Icons";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function GroupInviteAction({
  invitationId,
  groupId,
  userId,
}: {
  invitationId: number;
  groupId: number;
  userId: number;
}) {
  const [acceptGroupInvitation, { isLoading: isAccepting, isSuccess }] =
    useAcceptGroupInvitationMutation();

  const router = useRouter();
  const isRejecting = false;
  const handleConnectionAction = async (action: "accept" | "ignore") => {
    if (action === "accept") {
      try {
        const response = await acceptGroupInvitation({ invitationId }).unwrap();
        router.refresh();
        toast.success(
          response?.message || "Group invitation accepted successfully!",
        );
      } catch (error) {
        console.error("Error accepting group invitation:", error);
        toast.error(
          error?.data?.message ||
            "Failed to accept the group invitation. Please try again.",
        );
      }
    } else {
      // Ignore connection logic here
    }
  };
  return (
    <div>
      {isSuccess ? (
        <Link
          href={`/mu/my-network/group/${groupId}`}
          className={`${BUTTON_STYLES.primary} flex items-center gap-1 px-2.5!`}
        >
          <OpenEyeIcon className="w-4 h-4" /> View
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <button
            disabled={isRejecting}
            onClick={() => handleConnectionAction("ignore")}
            className={`${BUTTON_STYLES.secondary} disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor`}
          >
            {isRejecting ? "Ignoring..." : "Ignore"}
          </button>
          <button
            disabled={isAccepting}
            onClick={() => handleConnectionAction("accept")}
            className={`${BUTTON_STYLES.primary} disabled:cursor-not-allowed! disabled:opacity-50! disabled:bg-gray-bgColor!`}
          >
            {isAccepting ? (
              <span className="">
                <Loader className="w-4.5 animate-spin h-4.5 " />
              </span>
            ) : (
              "Accept"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default GroupInviteAction;
