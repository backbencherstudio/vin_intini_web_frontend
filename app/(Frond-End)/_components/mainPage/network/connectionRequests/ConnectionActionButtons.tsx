"use client";

import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
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

  const renderButtons = () => {
    switch (status) {
      case "friend":
        return (
          <button
            onClick={() => onAction(id, "remove")}
            className={BUTTON_STYLES.borderBtn}
          >
            <UserMinusIcon className="w-4 h-4" />
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

      case "accept":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAction(id, "ignore")}
              className={BUTTON_STYLES.secondary}
            >
              Ignore
            </button>
            <button
              onClick={() => onAction(id, "accept")}
              className={BUTTON_STYLES.primary}
            >
              Accept
            </button>
          </div>
        );

      case "connected":
        return (
          <div className="flex items-center gap-2">
            <button className={BUTTON_STYLES.primary}>View profile</button>
            <button
              onClick={() => onAction(id, "remove")}
              className={BUTTON_STYLES.iconBtn}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );

      default:
        return (
          <button
            onClick={() => onAction(id, "ignore")}
            className={BUTTON_STYLES.iconBtn}
          >
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
