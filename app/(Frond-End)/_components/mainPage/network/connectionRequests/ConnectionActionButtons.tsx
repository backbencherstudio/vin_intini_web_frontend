"use client";

import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import {
  useRemoveRequestMutation,
  useRequestAcceptMutation,
  useRequestRejectMutation,
} from "@/feature/slice/connect/connectSlice";
import { UserMinusIcon } from "@/public/svgIcons/Icons";
import { Loader, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import UserUnfollowDialog from "../UserUnfollowDialog";

interface ActionProps {
  id: number;
  status: any;
  userId?: number;
}

export const ConnectionActionButtons = ({
  id,
  status,
  userId,
}: ActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [identyConnection, setIdentyConnection] = useState("");
  const [requestAccept, { isLoading: isAccepting }] =
    useRequestAcceptMutation();
  const [requestReject, { isLoading: isRejecting }] =
    useRequestRejectMutation();
  const [removeRequest, { isLoading: isRemoving }] = useRemoveRequestMutation();

  const handleConnectionAction = async (type: "accept" | "ignore") => {
    try {
      if (type === "accept") {
        const response = await requestAccept({ id }).unwrap();
        toast.success(response.message || "Connection request accepted!");
        setIdentyConnection("accept");
        return;
      }

      const response = await requestReject({ id }).unwrap();
      toast.success(response.message || "Connection request ignored.");
    } catch (error) {
      console.log("Error handling connection action:", error);
    }
  };
  const handleUnfirend = async () => {
    try {
      const result = await removeRequest({ id: userId }).unwrap();

      toast.success(result.message || "Connection removed.");
    } catch (error) {
      console.error("Error opening unfollow dialog:", error);
    }
  };

  const renderButtons = () => {
    switch (status) {
      case "accepted":
        return (
          <button
            onClick={handleUnfirend}
            disabled={isRemoving}
            className={` w-9 h-9 flex items-center disabled:shadow-transparent disabled:cursor-not-allowed disabled:opacity-70 disabled:border-borderColor disabled:bg-bgColor justify-center border border-descriptionColor cursor-pointer rounded-full hover:bg-lightGreenColor/20 hover:border-lightGreenColor hover:shadow-lg transition-all duration-200 `}
          >
            {isRemoving ? (
              <Loader className="w-4.5 animate-spin h-4.5" />
            ) : (
              <UserMinusIcon className="w-4.5 h-4.5" />
            )}
          </button>
        );

      case "follower":
        return (
          <button
            onClick={() => setIsOpen(true)}
            className={`${BUTTON_STYLES.borderBtn} `}
          >
            Unfollow
          </button>
        );

      case "pending":
        return (
          <div className="flex items-center gap-2">
            {identyConnection === "ignore" ? (
              <button
                disabled={isAccepting || isRejecting}
                className={BUTTON_STYLES.iconBtn}
              >
                <X className="h-4 w-4" />
              </button>
            ) : identyConnection === "accept" ? (
              <Link href={`/mu/${id}`} className={BUTTON_STYLES.primary}>
                View profile
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
                  className={`${BUTTON_STYLES.primary} disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-bgColor`}
                >
                  {isAccepting ? "Accepting..." : "Accept"}
                </button>
              </div>
            )}
          </div>
        );

      case "connected":
        return (
          <div className="flex items-center gap-2">
            <Link href={`/mu/${id}`} className={BUTTON_STYLES.primary}>
              View profile
            </Link>
            <button
              disabled={isAccepting || isRejecting}
              className={BUTTON_STYLES.iconBtn}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );

      default:
        return (
          <button className={BUTTON_STYLES.iconBtn}>
            <X className="h-4 w-4" />
          </button>
        );
    }
  };

  return (
    <>
      {renderButtons()}
      {isOpen && <UserUnfollowDialog setOpen={setIsOpen} open={isOpen} />}
    </>
  );
};
