"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import CustomButton from "@/components/reusable/dashboard/CustomButton";
import CreateSectionModal from "./CreateSectionModal";

interface CategoryAddSectionActionProps {
    network?: string;
    networkLabel?: string;
    activeTab?: string;
    industryOptions?: { label: string; value: string }[];
    onSubmit?: (data: { industryType: string; sectionHeading: string }) => void;
}

export default function CategoryAddSectionAction({
    network,
    networkLabel,
    activeTab,
    industryOptions,
    onSubmit,
}: CategoryAddSectionActionProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <CustomButton size="lg" onClick={() => setOpen(true)} className="shadow-xs cursor-pointer">
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Add New Section
            </CustomButton>

            <CreateSectionModal
                open={open}
                onOpenChange={setOpen}
                network={network}
                networkLabel={networkLabel}
                activeTab={activeTab}
                industryOptions={industryOptions}
                onSubmit={onSubmit}
            />
        </>
    );
}
