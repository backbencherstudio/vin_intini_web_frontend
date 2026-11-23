"use client";

import { Eye, Pencil, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import PublicationBoostResponseModal from "./PublicationBoostResponseModal";
import PublicationDeleteModal from "./PublicationDeleteModal";
import PublicationViewModal from "./PublicationViewModal";

interface PublicationActionProps {
  row: { id: string | number; [key: string]: any };
  ispremium: boolean;
}

export default function PublicationAction({
  row,
  ispremium,
}: PublicationActionProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);

  const isRejected = row.status?.toLowerCase() === "rejected";
  const isBoosted = Boolean(
    row.is_boosted || (row.boost_days_left && row.boost_days_left > 0)
  );

  return (
    <>
      <div className="flex items-center justify-end gap-1.5 pr-3 whitespace-nowrap">
        {/* Boost Action Button (Icon-Only matching Action Toolbar) */}
        {isBoosted ? (
          <button
            type="button"
            onClick={() => setResponseModalOpen(true)}
            title="View Boost Performance & Response"
            className="w-8 h-8 rounded-lg border border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED] hover:bg-[#EDE9FE] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs active:scale-95"
          >
            <Zap className="w-4 h-4 fill-[#7C3AED]" />
          </button>
        ) : isRejected ? (
          <button
            type="button"
            disabled
            title="Rejected publications cannot be boosted"
            className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-300 flex items-center justify-center cursor-not-allowed shrink-0"
          >
            <Zap className="w-4 h-4 fill-slate-300" />
          </button>
        ) : (
          <Link
            href={
              ispremium
                ? `/mu/premium/publications/${row.id}/boosting-plan`
                : `/mu/publications/${row.id}/boosting-plan`
            }
            title="Boost Publication"
            className="w-8 h-8 rounded-lg border border-[#7C3AED] bg-white text-[#7C3AED] hover:bg-[#F5F3FF] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs active:scale-95"
          >
            <Zap className="w-4 h-4 fill-[#7C3AED]" />
          </Link>
        )}

        {/* View Details Button */}
        <button
          type="button"
          onClick={() => setViewModalOpen(true)}
          className="w-8 h-8 rounded-lg border border-borderColor hover:bg-bgColor text-gray-500 hover:text-primaryColor transition-colors flex items-center justify-center cursor-pointer shrink-0"
          title="View Publication Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="w-8 h-8 rounded-lg border border-borderColor hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors flex items-center justify-center cursor-pointer shrink-0"
          title="Delete Publication"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Edit Button */}
        {isRejected ? (
          <button
            type="button"
            disabled
            title="Rejected by Admin — cannot be edited"
            className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed flex items-center justify-center shrink-0"
          >
            <Pencil className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href={
              ispremium
                ? `/mu/premium/publications/${row.id}/edit`
                : `/mu/publications/${row.id}/edit`
            }
            className="w-8 h-8 rounded-lg border border-borderColor hover:bg-bgColor text-gray-500 hover:text-primaryColor transition-colors flex items-center justify-center cursor-pointer shrink-0"
            title="Edit Publication"
          >
            <Pencil className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <PublicationDeleteModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          publicationId={row.id}
        />
      )}

      {/* View Details Modal */}
      {viewModalOpen && (
        <PublicationViewModal
          open={viewModalOpen}
          setOpen={setViewModalOpen}
          publicationId={row.id}
        />
      )}

      {/* Boost Campaign Response Modal */}
      {responseModalOpen && (
        <PublicationBoostResponseModal
          open={responseModalOpen}
          setOpen={setResponseModalOpen}
          publication={row}
        />
      )}
    </>
  );
}
