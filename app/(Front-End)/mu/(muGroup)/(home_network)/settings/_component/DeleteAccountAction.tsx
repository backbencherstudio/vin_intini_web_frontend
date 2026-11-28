"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { useGetSecurityOverviewQuery } from "@/feature/slice/admin/securitySettings";
import { DeleteIcon } from "@/public/svgIcons/Icons";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { useState } from "react";
import DeleteResoneModal from "./DeleteResoneModal";

function DeleteAccountAction() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: overviewRes } = useGetSecurityOverviewQuery({});
  const isCurrentSessionTrusted =
    overviewRes?.data?.is_current_session_trusted ?? true;

  return (
    <section className="rounded-md border border-[#F38B94]/60 bg-white">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-[#FFF9FA] sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#FEECEE] text-redColor">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-[18px] font-semibold leading-[130%] text-redColor sm:text-[20px]">
              Dangerous Area
            </h4>
            <p className="mt-1 text-sm text-[#4A4C56]">
              Permanently close and delete your MindUnite account.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <span className="hidden rounded-full border border-[#FBD8DB] bg-[#FEECEE] px-2.5 py-0.5 text-xs font-medium text-redColor sm:inline-block">
            Account deletion
          </span>
          <ChevronDown
            className={`h-5 w-5 text-redColor transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-[#FBD8DB]/70 px-5 pb-6 pt-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="text-base font-semibold text-headerColor md:text-lg">
                Close and delete account
              </h3>
              <p className="mt-1 text-sm text-descriptionColor">
                Are you sure you want to close your account? You’ll lose your
                connections, messages, endorsements, and recommendations.
              </p>
            </div>
            <ButtonReuseable
              title="Delete Account"
              icon={<DeleteIcon />}
              disabled={!isCurrentSessionTrusted}
              className="bg-redColor! text-whiteColor disabled:opacity-50"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      )}

      <DeleteResoneModal open={open} setOpen={setOpen} />
    </section>
  );
}

export default DeleteAccountAction;
