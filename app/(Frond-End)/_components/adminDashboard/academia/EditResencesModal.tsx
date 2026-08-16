"use client";

import { useState, useEffect } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

interface MedicalResidencyFormProps {
    onClose?: () => void;
    mode?: "add" | "edit";
    initialData?: {
        programName?: string;
        state?: string;
        city?: string;
        latitude?: string;
        longitude?: string;
        degrees?: string;
        phoneNumber?: string;
        website?: string;
    };
}

export default function MedicalResidencyForm({
    onClose,
    mode = "add",
    initialData,
}: MedicalResidencyFormProps) {
    const [formData, setFormData] = useState({
        programName: "",
        state: "",
        city: "",
        latitude: "",
        longitude: "",
        degrees: "",
        phoneNumber: "",
        website: "",
    });

    // Edit মোডে initialData সেট হবে
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                programName: initialData.programName || "",
                state: initialData.state || "",
                city: initialData.city || "",
                latitude: initialData.latitude || "",
                longitude: initialData.longitude || "",
                degrees: initialData.degrees || "",
                phoneNumber: initialData.phoneNumber || "",
                website: initialData.website || "",
            });
        }
    }, [mode, initialData]);

    const handleSave = () => {
        console.log("Mode:", mode);
        console.log("Form Data:", formData);

        if (mode === "add") {
            // await createMedicalResidency(formData);
        } else {
            // await updateMedicalResidency(formData);
        }

        onClose?.();
    };

    return (
        <div className="p-1">
            <div className="space-y-5">
                {/* Program Name */}
                <CustomInput
                    label="Program Name"
                    required
                    placeholder="Enter Program Name"
                    value={formData.programName}
                    onChange={(e) =>
                        setFormData({ ...formData, programName: e.target.value })
                    }
                />

                {/* State + City */}
                <div className="grid grid-cols-2 gap-4">
                    <CustomSelect
                        label="State"
                        required
                        placeholder="Select State"
                        value={formData.state}
                        onChange={(val) =>
                            setFormData({ ...formData, state: val as string })
                        }
                        options={[
                            { label: "Alabama", value: "AL" },
                            { label: "Alaska", value: "AK" },
                            { label: "Arizona", value: "AZ" },
                            { label: "Arkansas", value: "AR" },
                            { label: "California", value: "CA" },
                            { label: "Texas", value: "TX" },
                            { label: "New York", value: "NY" },
                        ]}
                    />

                    <CustomInput
                        label="City/Location"
                        required
                        placeholder="Enter City/Location"
                        value={formData.city}
                        onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                        }
                    />
                </div>

                {/* Map Coordinates */}
                <div className="bg-[#D3F4EF] rounded-xl p-4">
                    <p className="text-[#4A4C56] font-semibold text-base mb-4">
                        Map Coordinates
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <CustomInput
                            label="Latitude"
                            required
                            placeholder="Latitude (e.g. 33.50)"
                            value={formData.latitude}
                            onChange={(e) =>
                                setFormData({ ...formData, latitude: e.target.value })
                            }
                        />
                        <CustomInput
                            label="Longitude"
                            required
                            placeholder="Longitude (e.g. -86.80)"
                            value={formData.longitude}
                            onChange={(e) =>
                                setFormData({ ...formData, longitude: e.target.value })
                            }
                        />
                    </div>
                </div>

                {/* Degrees */}
                <CustomInput
                    label="Degrees (Comma Separated)"
                    placeholder="e.g. MD-DO"
                    value={formData.degrees}
                    onChange={(e) =>
                        setFormData({ ...formData, degrees: e.target.value })
                    }
                />

                {/* Phone + Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                        label="Phone Number"
                        required
                        placeholder="e.g. (123) 456-7890"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                            setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                    />
                    <CustomInput
                        label="University Website"
                        required
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={(e) =>
                            setFormData({ ...formData, website: e.target.value })
                        }
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-[#B6B6B6] rounded-lg px-4 py-2 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-[#04A1B7] text-white rounded-lg px-4 py-2 cursor-pointer"
                    >
                        {mode === "add" ? "Save Program" : "Save Program"}
                    </button>
                </div>
            </div>
        </div>
    );
}