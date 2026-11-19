"use client";

import { useEffect, useState } from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomButton from "@/components/reusable/dashboard/CustomButton";

interface CreateTabModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValue?: string;
    sectionTitle?: string;
    onSubmit?: (tabName: string) => void;
}

export default function CreateTabModal({
    open,
    onOpenChange,
    initialValue = "",
    sectionTitle,
    onSubmit,
}: CreateTabModalProps) {
    const [tabName, setTabName] = useState(initialValue);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setTabName(initialValue);
            setError("");
        }
    }, [open, initialValue]);

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setTabName("");
            setError("");
        }
        onOpenChange(nextOpen);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!tabName.trim()) {
            setError("Subcategory name is required");
            return;
        }

        onSubmit?.(tabName.trim());
        handleOpenChange(false);
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={handleOpenChange}
            title={initialValue ? "Edit Subcategory" : "Add New Subcategory"}
            size="md"
        >
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 pt-2">
                {sectionTitle && (
                    <p className="text-xs text-gray-500">
                        Adding subcategory under: <strong className="text-gray-800">{sectionTitle}</strong>
                    </p>
                )}

                <div>
                    <CustomInput
                        label="Subcategory Name"
                        required
                        name="tabName"
                        placeholder="e.g. Brain Scanners, Cognitive Assessments"
                        value={tabName}
                        onChange={(event) => {
                            setTabName(event.target.value);
                            setError("");
                        }}
                        error={error}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <CustomButton
                        type="button"
                        variant="ghost"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit">
                        {initialValue ? "Save Changes" : "Add Subcategory"}
                    </CustomButton>
                </div>
            </form>
        </CustomModal>
    );
}
