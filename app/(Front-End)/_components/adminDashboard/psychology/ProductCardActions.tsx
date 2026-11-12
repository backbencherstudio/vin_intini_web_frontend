"use client";

import {
  Eye,
  MoreVertical,
  Pencil,
  Power,
  PowerOff,
  ShieldBan,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminProductStatus } from "@/feature/slice/admin/products";

interface ProductCardActionsProps {
  status: AdminProductStatus;
  isUpdatingStatus?: boolean;
  onView: () => void;
  onEdit: () => void;
  onToggleStatus: (nextStatus: AdminProductStatus) => void;
  onReject?: () => void;
  onRemove: () => void;
}

export default function ProductCardActions({
  status,
  isUpdatingStatus = false,
  onView,
  onEdit,
  onToggleStatus,
  onReject,
  onRemove,
}: ProductCardActionsProps) {
  const isActive = status === "active";
  const isRejected = status === "rejected";
  const nextStatus: AdminProductStatus = isActive ? "inactive" : "active";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Product actions"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-600 shadow-xs transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onView} className="cursor-pointer gap-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <span>View Details</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onEdit} className="cursor-pointer gap-2">
          <Pencil className="h-4 w-4 text-gray-500" />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isUpdatingStatus}
          onClick={() => onToggleStatus(nextStatus)}
          className="cursor-pointer gap-2"
        >
          {isActive ? (
            <>
              <PowerOff className="h-4 w-4 text-amber-600" />
              <span>Set Inactive</span>
            </>
          ) : (
            <>
              <Power className="h-4 w-4 text-emerald-600" />
              <span>{isRejected ? "Restore & Activate" : "Activate"}</span>
            </>
          )}
        </DropdownMenuItem>

        {!isRejected && onReject && (
          <DropdownMenuItem
            onClick={onReject}
            className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <ShieldBan className="h-4 w-4" />
            <span>Reject Product</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onRemove}
          className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span>Remove</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
