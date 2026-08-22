"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";


interface EmploymentUpdateProps {
    onClose?: () => void;
    data: any;
}
export default function UpdateEmployment({ onClose, data }: EmploymentUpdateProps) {
    const [formData, setFormData] = useState({
        title: data?.title,
        companyName: data?.companyName,
        category: data?.category,
        state: data?.state,
        cityLocation: data?.cityLocation,
        minSalary: data?.minSalary,
        maxSalary: data?.maxSalary,
        workMode: data?.workMode,
        employmentType: data?.employmentType,

    });

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(formData);

    }


    return (
        <div className="p-4">
            <div className="space-y-5">
                {/* University Name + State */}
                <div className="grid grid-cols-2 gap-4">
                    <CustomInput
                        label="Job Title"
                        required
                        placeholder="Enter Job Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <CustomInput
                        label="Company Name"
                        required
                        placeholder="Enter Company Name"
                        value={formData.companyName}
                        onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
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

                    <CustomSelect
                        label="Category"
                        required
                        placeholder="Select Category"
                        value={formData.category}
                        onChange={(val) => setFormData({ ...formData, category: val as string })}
                        options={[
                            { label: "Industry", value: "Industry" },
                            { label: "Education", value: "Education" },
                            { label: "Government", value: "Government" },
                            { label: "Non-Profit", value: "Non-Profit" },

                        ]}
                    />
                </div>

                <div>
                    <CustomInput
                        label="City/Location"
                        required
                        placeholder="Enter City/Location"
                        value={formData.cityLocation}
                        onChange={(e) =>
                            setFormData({ ...formData, cityLocation: e.target.value })
                        }
                    />
                </div>

                <div className="text-[#4A4C56] text-base font-semibold font-['Segoe UI'] leading-6 tracking-wide">
                    Salary Range
                </div>

                <div className="grid grid-cols-2 gap-4">

                    <CustomInput
                        label="Min Salary ($)"
                        required
                        placeholder="Enter Min Salary"
                        value={formData.minSalary}
                        onChange={(e) =>
                            setFormData({ ...formData, minSalary: e.target.value })
                        }
                    />
                    <CustomInput
                        label="Max Salary ($)"
                        required
                        placeholder="Enter Max Salary"
                        value={formData.maxSalary}
                        onChange={(e) =>
                            setFormData({ ...formData, maxSalary: e.target.value })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <CustomSelect
                        label="Work Mode"
                        required
                        placeholder="Select Category"
                        value={formData.workMode}
                        onChange={(val) => setFormData({ ...formData, workMode: val as string })}
                        options={[
                            { label: "On-site", value: "On-site" },
                            { label: "Hybrid", value: "Hybrid" },
                            { label: "Remote", value: "Remote" },


                        ]}
                    />

                    <CustomSelect
                        label="Employment Type "
                        required
                        placeholder="Select Category"
                        value={formData.employmentType}
                        onChange={(val) => setFormData({ ...formData, employmentType: val as string })}
                        options={[
                            { label: "Full-Time", value: "Full-Time" },
                            { label: "Part-Time", value: "Part-Time" },
                            { label: "Contract", value: "Contract" },
                            { label: "Internship", value: "Internship" },

                        ]}
                    />
                </div>
                <div>


                    <div className="flex justify-end gap-2.5 py-4">
                        <button className="border border-[#B6B6B6] rounded-lg px-3 py-2 cursor-pointer " onClick={onClose} type="button"  >Cancel</button>
                        <button onClick={handleSubmit} className="border cursor-pointer bg-primaryColor text-white rounded-lg px-3 py-2" type="button">Save University</button>
                    </div>
                </div>
            </div>
        </div>
    );
}