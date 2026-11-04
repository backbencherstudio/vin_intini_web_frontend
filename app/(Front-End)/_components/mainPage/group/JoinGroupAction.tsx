"use client";

import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { joinGroup } from "./joinGroupAction.server";

function JoinGroupAction({ groupID }: { groupID: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <form
        action={(formData) => {
          startTransition(() => joinGroup(formData));
        }}
      >
        <input type="hidden" name="group_id" value={groupID} />
        <button
          type="submit"
          disabled={isPending}
          className={`${!groupID ? BUTTON_STYLES.primary : BUTTON_STYLES.borderBtn} mt-4! transition-opacity disabled:bg-bgColor! disabled:cursor-not-allowed! disabled:opacity-60! ${isPending ? "opacity-60" : ""}`}
        >
          {isPending ? <Loader className="animate-spin w-4 h-4" /> : "Join"}
        </button>
      </form>
    </div>
  );
}

export default JoinGroupAction;
