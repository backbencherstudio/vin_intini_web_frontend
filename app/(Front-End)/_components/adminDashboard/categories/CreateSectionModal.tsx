"use client";

import { useEffect, useState } from "react";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomButton from "@/components/reusable/dashboard/CustomButton";

const defaultIndustryOptions = [
    { label: "Biotechnology", value: "biotechnology" },
    { label: "Psychotropics", value: "psychotropics" },
];

interface CreateSectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activeTab?: string;
    industryOptions?: { label: string; value: string }[];
    initialValues?: { industryType: string; sectionHeading: string };
    onSubmit?: (data: { industryType: string; sectionHeading: string }) => void;
}

export default function CreateSectionModal({
    open,
    onOpenChange,
    activeTab,
    industryOptions = defaultIndustryOptions,
    initialValues,
    onSubmit,
}: CreateSectionModalProps) {
    const getInitialIndustry = () => {
        if (initialValues?.industryType) return initialValues.industryType;
        if (activeTab && activeTab !== "all") {
            const match = industryOptions.find((opt) => opt.value === activeTab);
            if (match) return match.value;
        }
        return industryOptions[0]?.value || "";
    };

    const [form, setForm] = useState({
        industryType: getInitialIndustry(),
        sectionHeading: initialValues?.sectionHeading || "",
    });
    const [errors, setErrors] = useState<{
        industryType?: string;
        sectionHeading?: string;
    }>({});

    useEffect(() => {
        if (open) {
            setForm({
                industryType: getInitialIndustry(),
                sectionHeading: initialValues?.sectionHeading || "",
            });
            setErrors({});
        }
    }, [open, initialValues, activeTab, industryOptions]);

    const resetForm = () => {
        setForm({
            industryType: getInitialIndustry(),
            sectionHeading: "",
        });
        setErrors({});
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: typeof errors = {};
        if (!form.industryType) nextErrors.industryType = "Industry type is required";
        if (!form.sectionHeading.trim()) {
            nextErrors.sectionHeading = "Section title is required";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        onSubmit?.({
            industryType: String(form.industryType),
            sectionHeading: form.sectionHeading.trim(),
        });
        handleOpenChange(false);
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={handleOpenChange}
            title={initialValues ? "Edit Section" : "Create New Section"}
            size="md"
        >
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 pt-2">
                <div>
                    <CustomSelect
                        label="Industry Type"
                        required
                        options={industryOptions}
                        value={form.industryType}
                        onChange={(value) => {
                            setForm((prev) => ({ ...prev, industryType: String(value) }));
                            setErrors((prev) => ({ ...prev, industryType: undefined }));
                        }}
                        placeholder="Select industry type"
                        error={errors.industryType}
                    />
                </div>

                <div>
                    <CustomInput
                        label="Section Title / Heading"
                        required
                        name="sectionHeading"
                        placeholder="e.g. Diagnostic Brain Imaging"
                        value={form.sectionHeading}
                        onChange={(event) => {
                            setForm((prev) => ({
                                ...prev,
                                sectionHeading: event.target.value,
                            }));
                            setErrors((prev) => ({ ...prev, sectionHeading: undefined }));
                        }}
                        error={errors.sectionHeading}
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
                        {initialValues ? "Save Changes" : "Create Section"}
                    </CustomButton>
                </div>
            </form>
        </CustomModal>
    );
}
