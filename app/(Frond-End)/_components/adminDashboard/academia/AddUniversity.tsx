"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

export default function AddUniversity() {
    const [formData, setFormData] = useState({
        name: "",
        state: "",
        latitude: "",
        longitude: "",
        psychologyDegrees: "",
        counselingDegrees: "",
        neuroscienceDegrees: "",
        phoneNumber: "",
        website: "",
    });

    return (
        <div className="p-4">
            <div className="space-y-5">
                {/* University Name + State */}
                <div className="grid grid-cols-2 gap-4">
                    <CustomInput
                        label="University Name"
                        required
                        placeholder="Enter University Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />

                    <CustomSelect
                        label="State"
                        required
                        placeholder="Select State"
                        value={formData.state}
                        onChange={(val) => setFormData({ ...formData, state: val as string })}
                        options={[
                            { label: "California", value: "CA" },
                            { label: "Texas", value: "TX" },
                            { label: "New York", value: "NY" },
                            { label: "Alabama", value: "AL" },
                            { label: "Alaska", value: "AK" },
                            { label: "Arizona", value: "AZ" },
                            { label: "Arkansas", value: "AR" },
                        ]}
                    />
                </div>

                {/* Map Coordinates */}
                <div className="bg-teal-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                        Map Coordinates
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <CustomInput
                            label="Latitude"
                            required
                            placeholder="Latitude (e.g. 34.05)"
                            value={formData.latitude}
                            onChange={(e) =>
                                setFormData({ ...formData, latitude: e.target.value })
                            }
                        />
                        <CustomInput
                            label="Longitude"
                            required
                            placeholder="Longitude (e.g. -118.24)"
                            value={formData.longitude}
                            onChange={(e) =>
                                setFormData({ ...formData, longitude: e.target.value })
                            }
                        />


                    </div>

                </div>
                <div>
                    <div>
                        <CustomInput
                            label="Psychology Degrees (BA, MS, PhD)"
                            required
                            placeholder="Enter Psychology Degrees"
                            value={formData.psychologyDegrees}
                            onChange={(e) =>
                                setFormData({ ...formData, psychologyDegrees: e.target.value })
                            }
                        />
                        <CustomInput
                            label="Counseling Degrees (MA, MDiv, PhD)"
                            required
                            placeholder="Enter Counseling Degrees"
                            value={formData.counselingDegrees}
                            onChange={(e) =>
                                setFormData({ ...formData, counselingDegrees: e.target.value })
                            }
                        />
                        <CustomInput
                            label="Neuroscience Degrees (BS, PhD)"
                            required
                            placeholder="Enter Neuroscience Degrees"
                            value={formData.neuroscienceDegrees}
                            onChange={(e) =>
                                setFormData({ ...formData, neuroscienceDegrees: e.target.value })
                            }
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomInput
                                label="Phone Number *"
                                required
                                placeholder="Enter Phone Number"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, phoneNumber: e.target.value })
                                }
                            />
                            <CustomInput
                                label="University Website *"
                                required
                                placeholder="Enter Website"
                                value={formData.website}
                                onChange={(e) =>
                                    setFormData({ ...formData, website: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}