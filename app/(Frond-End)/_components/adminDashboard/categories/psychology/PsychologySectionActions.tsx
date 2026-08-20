"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import type { PsychologySection } from "./PsychologySectionCard";

interface PsychologySectionActionsProps {
    section: PsychologySection;
    onEdit?: (section: PsychologySection) => void;
    onDelete?: (section: PsychologySection) => void;
}

export default function PsychologySectionActions({
    section,
    onEdit,
    onDelete,
}: PsychologySectionActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={`Open options for ${section.title}`}
                    className="rounded p-1 text-[#1D1F2C] transition-colors hover:bg-gray-100"
                >
                    <EllipsisVertical className="h-5 w-5" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32 bg-white">
                <DropdownMenuItem
                    onSelect={() => onEdit?.(section)}
                    className="cursor-pointer"
                >
                    <Pencil />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => onDelete?.(section)}
                    className="cursor-pointer"
                >
                    <Trash2 />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
