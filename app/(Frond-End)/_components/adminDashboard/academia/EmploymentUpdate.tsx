"use client";

import { useEffect, useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { useEditEmploymentMutation } from "@/feature/slice/admin/academia/EmploymentSlice";
import { useGetAllStateQuery } from "@/feature/slice/admin/academia/UniversitySlice";
import toast from "react-hot-toast";

interface EmploymentUpdateProps {
  onClose?: () => void;
  data: any;
}
export default function UpdateEmployment({
  onClose,
  data,
}: EmploymentUpdateProps) {
  const salaryParts =
    data?.salary_range
      ?.replace(/\$/g, "")
      ?.split("-")
      ?.map((value: string) => value.trim()) || [];

  const [formData, setFormData] = useState({
    title: data?.title || data?.jobtitle || "",
    companyName: data?.company_name || data?.companyName || "",
    category: data?.category || "",
    state: data?.state_id ? String(data.state_id) : "",
    cityLocation: data?.location || data?.city || "",
    minSalary: data?.salary_min || data?.minSalary || salaryParts[0] || "",
    maxSalary: data?.salary_max || data?.maxSalary || salaryParts[1] || "",
    workMode: data?.job_mode || "",
    employmentType: data?.job_type || "",
  });
  const { data: states } = useGetAllStateQuery({});
  const [editEmployment, { isLoading }] = useEditEmploymentMutation();

  const stateOptions =
    states?.data?.map((state: any) => ({
      label: state.name,
      value: String(state.id),
    })) || [];

  useEffect(() => {
    if (!states?.data || !data) return;

    if (data.state_id) {
      setFormData((prev) => ({ ...prev, state: String(data.state_id) }));
    } else if (data.state) {
      const stateStr =
        typeof data.state === "object" ? data.state.name : String(data.state);
      const foundState = states.data.find(
        (s: any) =>
          s.name?.toLowerCase() === stateStr.toLowerCase() ||
          String(s.id) === stateStr,
      );
      if (foundState) {
        setFormData((prev) => ({ ...prev, state: String(foundState.id) }));
      }
    }
  }, [states, data]);

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const payload = {
        id: data.id,
        title: formData.title,
        company_name: formData.companyName,
        state_id: Number(formData.state),
        category: formData.category,
        location: formData.cityLocation,
        salary_min: formData.minSalary,
        salary_max: formData.maxSalary,
        work_mode: formData.workMode,
        employment_type: formData.employmentType,
      };

      const response = await editEmployment(payload).unwrap();
      toast.success(response?.message || "Job updated successfully");
      onClose?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update job");
    }
  };

  return (
    <div className="">
      <div className="space-y-5">
        {/* Job Title + Company Name */}
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
            onChange={(val) =>
              setFormData({ ...formData, state: val as string })
            }
            options={stateOptions}
          />

          <CustomSelect
            label="Category"
            required
            placeholder="Select Category"
            value={formData.category}
            onChange={(val) =>
              setFormData({ ...formData, category: val as string })
            }
            options={[
              { label: "State Institution", value: "state_institution" },
              { label: "Private Practice", value: "private_practice" },
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

        <div className="text-[#4A4C56] text-base font-semibold  leading-6 tracking-wide">
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
            onChange={(val) =>
              setFormData({ ...formData, workMode: val as string })
            }
            options={[
              { label: "On-site", value: "onsite" },
              { label: "Hybrid", value: "hybrid" },
              { label: "Remote", value: "remote" },
            ]}
          />

          <CustomSelect
            label="Employment Type "
            required
            placeholder="Select Category"
            value={formData.employmentType}
            onChange={(val) =>
              setFormData({ ...formData, employmentType: val as string })
            }
            options={[
              { label: "Full-Time", value: "Full-time" },
              { label: "Part-Time", value: "Part-Time" },
              { label: "Contract", value: "Contract" },
              { label: "Internship", value: "Internship" },
            ]}
          />
        </div>
        <div>
          <div className="flex justify-end gap-2.5 py-4">
            <button
              className="border border-[#B6B6B6] rounded-lg px-3 py-2 cursor-pointer "
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="border cursor-pointer bg-primaryColor text-white rounded-lg px-3 py-2"
              type="button"
            >
              {isLoading ? "Saving..." : "Save Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
