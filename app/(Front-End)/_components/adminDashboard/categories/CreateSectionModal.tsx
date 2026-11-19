"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Network } from "lucide-react";
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
    network?: string;
    networkLabel?: string;
    activeTab?: string;
    industryOptions?: { label: string; value: string }[];
    initialValues?: {
        industryType: string;
        sectionHeading: string;
        network?: string;
        networkLabel?: string;
    };
    onSubmit?: (data: { industryType: string; sectionHeading: string }) => void;
}

export default function CreateSectionModal({
    open,
    onOpenChange,
    network,
    networkLabel,
    activeTab,
    industryOptions = defaultIndustryOptions,
    initialValues,
    onSubmit,
}: CreateSectionModalProps) {
    const pathname = usePathname();

    const resolvedNetwork =
        network ||
        initialValues?.network ||
        (pathname.includes("neuroscience") ? "neuroscience" : "psychology");

    const resolvedNetworkLabel =
        networkLabel ||
        initialValues?.networkLabel ||
        (resolvedNetwork === "neuroscience" ? "Neuroscience Network" : "Psychology Network");

    const isNeuroscience = resolvedNetwork === "neuroscience";

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
                {/* Target Network Info */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Target Network
                    </label>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 px-3.5 py-2.5">
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    isNeuroscience
                                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200/70"
                                        : "bg-purple-50 text-purple-700 border border-purple-200/70"
                                }`}
                            >
                                <Network className="h-3 w-3" />
                                {resolvedNetworkLabel}
                            </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                            {initialValues
                                ? "Assigned network"
                                : "This section will be created under this network"}
                        </span>
                    </div>
                </div>

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
