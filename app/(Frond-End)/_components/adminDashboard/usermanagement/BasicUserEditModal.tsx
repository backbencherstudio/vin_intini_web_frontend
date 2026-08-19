"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

interface JobProfile {
    id?: number;
    jobTitle: string;
    organization: string;
    jobDescription: string;
    workMode: string;
    employmentType: string;
    state: string;
    city: string;
    email: string;
    phoneNumber: string;
    salaryRange: string;
    applicationUrl: string;
    tags: string[];
}

interface BasicUserEditModalProps {
    data?: any;
    onClose?: () => void;
}

export default function BasicUserEditModal({ data, onClose }: BasicUserEditModalProps) {
    const [formData, setFormData] = useState({
        jobTitle: data?.jobTitle || "",
        organization: data?.organization || "",
        jobDescription: data?.jobDescription || "",
        workMode: data?.workMode || "On-site",
        employmentType: data?.employmentType || "Full Time",
        state: data?.state || "",
        city: data?.city || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
        salaryRange: data?.salaryRange || "",
        applicationUrl: data?.applicationUrl || "",
        tags: data?.tags || [],
    });

    const [tagInput, setTagInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        // API call here
    };

    const reset = () => {
        setFormData({
            jobTitle: "",
            organization: "",
            jobDescription: "",
            workMode: "On-site",
            employmentType: "Full Time",
            state: "",
            city: "",
            email: "",
            phoneNumber: "",
            salaryRange: "",
            applicationUrl: "",
            tags: [],
        });
        setTagInput("");
    };

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData({
                    ...formData,
                    tags: [...formData.tags, tagInput.trim()],
                });
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    return (
        <div className="p-4">
            <div className="space-y-5">
                {/* Job Title + Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                        label="Job Title"
                        required
                        placeholder="e.g. Clinical Psychologist"
                        value={formData.jobTitle}
                        onChange={(e) =>
                            setFormData({ ...formData, jobTitle: e.target.value })
                        }
                    />

                    <CustomInput
                        label="Organization / Institution"
                        required
                        placeholder="e.g. UNC-Chapel Hill Department of Psychology"
                        value={formData.organization}
                        onChange={(e) =>
                            setFormData({ ...formData, organization: e.target.value })
                        }
                    />
                </div>

                {/* Job Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#04A1B7] resize-y"
                        placeholder="Describe the role, responsibilities, and requirements..."
                        value={formData.jobDescription}
                        onChange={(e) =>
                            setFormData({ ...formData, jobDescription: e.target.value })
                        }
                        maxLength={5000}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {formData.jobDescription.length}/5000
                    </p>
                </div>

                {/* Work Mode + Employment Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect
                        label="Work mode"
                        required
                        placeholder="Select Work Mode"
                        value={formData.workMode}
                        onChange={(val) =>
                            setFormData({ ...formData, workMode: val as string })
                        }
                        options={[
                            { label: "On-site", value: "On-site" },
                            { label: "Remote", value: "Remote" },
                            { label: "Hybrid", value: "Hybrid" },
                        ]}
                    />

                    <CustomSelect
                        label="Employment Type"
                        required
                        placeholder="Select Employment Type"
                        value={formData.employmentType}
                        onChange={(val) =>
                            setFormData({ ...formData, employmentType: val as string })
                        }
                        options={[
                            { label: "Full Time", value: "Full Time" },
                            { label: "Part Time", value: "Part Time" },
                            { label: "Contract", value: "Contract" },
                            { label: "Internship", value: "Internship" },
                        ]}
                    />
                </div>

                {/* State + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect
                        label="State"
                        required
                        placeholder="Select State"
                        value={formData.state}
                        onChange={(val) =>
                            setFormData({ ...formData, state: val as string })
                        }
                        options={[
                            { label: "Arizona", value: "Arizona" },
                            { label: "California", value: "California" },
                            { label: "Texas", value: "Texas" },
                            { label: "New York", value: "New York" },
                            { label: "Alabama", value: "Alabama" },
                            { label: "Alaska", value: "Alaska" },
                            { label: "Arkansas", value: "Arkansas" },
                        ]}
                    />

                    <CustomInput
                        label="City"
                        required
                        placeholder="Enter City"
                        value={formData.city}
                        onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                        }
                    />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                        label="Email Address"
                        required
                        placeholder="e.g. name@email.com"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />

                    <CustomInput
                        label="Phone Number"
                        required
                        placeholder="e.g. +880 1234 5678"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                            setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                    />
                </div>

                {/* Salary Range + Application URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                        label="Salary Range"
                        required
                        placeholder="e.g. 50k - 80k"
                        value={formData.salaryRange}
                        onChange={(e) =>
                            setFormData({ ...formData, salaryRange: e.target.value })
                        }
                    />

                    <CustomInput
                        label="Application URL"
                        required
                        placeholder="https://careers.university.edu/apply"
                        value={formData.applicationUrl}
                        onChange={(e) =>
                            setFormData({ ...formData, applicationUrl: e.target.value })
                        }
                    />
                </div>

                {/* Add Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Add Tags
                    </label>
                    <div className="border border-gray-300 rounded-lg px-3 py-2 flex flex-wrap gap-2 min-h-[42px]">
                        {formData.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-2.5 py-1 rounded-full"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="text-gray-500 hover:text-red-500 ml-1"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            className="flex-1 min-w-[120px] outline-none text-sm"
                            placeholder={formData.tags.length === 0 ? "Add tags..." : ""}
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={addTag}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Press Enter to add a tag
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2.5 py-4">
                    <button
                        className="border border-[#B6B6B6] rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50"
                        onClick={onClose}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="border cursor-pointer bg-[#04A1B7] text-white rounded-lg px-4 py-2 hover:bg-[#038a9c]"
                        type="button"
                    >
                        Save Now
                    </button>
                </div>
            </div>
        </div>
    );
}