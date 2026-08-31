"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";

interface AddUniversityProps {
  onClose?: () => void;
}
export default function AddUniversity({ onClose }: AddUniversityProps) {
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

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(formData);
    reset();
  };
  const reset = () => {
    setFormData({
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
  };

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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <CustomSelect
            label="State"
            required
            placeholder="Select State"
            value={formData.state}
            onChange={(val) =>
              setFormData({ ...formData, state: val as string })
            }
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
        <div className="bg-[#D3F4EF] rounded-xl p-4">
          <p className="text-[#4A4C56]  text-base not-italic font-semibold leading-6 tracking-[0.08px] mb-4">
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
          <div className="flex flex-col  space-y-4">
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
                setFormData({
                  ...formData,
                  neuroscienceDegrees: e.target.value,
                })
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
              className="border cursor-pointer bg-primaryColor text-white rounded-lg px-3 py-2"
              type="button"
            >
              Save University
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
