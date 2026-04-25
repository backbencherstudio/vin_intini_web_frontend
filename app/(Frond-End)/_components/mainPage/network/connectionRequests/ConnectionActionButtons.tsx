"use client";

import { UserMinusIcon } from "@/public/svgIcons/Icons";
import { X } from "lucide-react";
import { useState } from "react";
import UserUnfollowDialog from "../UserUnfollowDialog";

interface ActionProps {
  id: number;
  status: "friend" | "follower" | "accept" | "connected" | "none";
  onAction: (id: number, type: string) => void;
}

export const ConnectionActionButtons = ({
  id,
  status,
  onAction,
}: ActionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const primaryBtn =
    "rounded-full border border-primaryColor px-5 py-1 text-sm font-bold text-primaryColor hover:bg-primaryColor hover:text-whiteColor transition-all duration-200";
  const secondaryBtn =
    "rounded-full px-4 py-1 text-sm font-medium text-headerColor hover:bg-bgColor transition-colors";
  const iconBtn =
    "p-2 text-descriptionColor hover:bg-bgColor rounded-full transition-colors";
  const renderButtons = () => {
    switch (status) {
      case "friend":
        return (
          <button
            onClick={() => onAction(id, "remove")}
            className="rounded-full border border-borderColor hover:border-red-200 hover:text-red-500 w-9 h-9 flex justify-center items-center hover:bg-red-50 transition-colors"
          >
            <UserMinusIcon className="w-4 h-4" />
          </button>
        );

      case "follower":
        return (
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-full border border-borderColor px-4 py-1.5 text-sm font-semibold text-descriptionColor hover:bg-primaryColor hover:text-whiteColor hover:border-primaryColor transition-all"
          >
            Unfollow
          </button>
        );

      case "accept":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAction(id, "ignore")}
              className={secondaryBtn}
            >
              Ignore
            </button>
            <button
              onClick={() => onAction(id, "accept")}
              className={primaryBtn}
            >
              Accept
            </button>
          </div>
        );

      case "connected":
        return (
          <div className="flex items-center gap-2">
            <button className={primaryBtn}>View profile</button>
            <button onClick={() => onAction(id, "remove")} className={iconBtn}>
              <X className="h-4 w-4" />
            </button>
          </div>
        );

      default:
        return (
          <button onClick={() => onAction(id, "ignore")} className={iconBtn}>
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
