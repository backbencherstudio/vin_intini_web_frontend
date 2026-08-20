"use client";

import Image from "next/image";
import { useState } from "react";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";
import CustomInput from "@/components/reusable/dashboard/CustomInput";

type Job = {
  id: number;
  img: string;
  advertisImage: string;
  title: string;
  desc: string;
  advertiser: string;
  industry: string;
  impression: string;
  clicks: string;
  ctr: string;
  status: string;
  joined: string;
};

interface AdvertisementEditFormProps {
  job: Job | null;
  onCancel: () => void;
  onUpdate: () => void;
}

export default function AdvertisementEditForm({
  job,
  onCancel,
  onUpdate,
}: AdvertisementEditFormProps) {
  const isEditMode = !!job;

  const [title, setTitle] = useState(job?.title || "");
  const [category, setCategory] = useState("");
  const [advertiser, setAdvertiser] = useState(job?.advertiser || "");
  const [industry, setIndustry] = useState(job?.industry || "");
  const [status, setStatus] = useState(job?.status || "Publish");
  const [description, setDescription] = useState();
  const [startDate, setStartDate] = useState<DateRange | undefined>(undefined);
  const [endDate, setEndDate] = useState<DateRange | undefined>(undefined);

  return (
    <div className="space-y-5">
      {/* Title */}
      <CustomInput
        label="Title"
        value={title}
        // onChange={(value: string) => setTitle(value)}
        required
      />

      {/* Categories + Advertiser */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Categories
          </label>
          <CustomSelect
            className="h-11 w-full"
            value={category}
            onChange={(value: string) => setCategory(value)}
            options={[
              { label: "Select your category", value: "" },
              { label: "Event", value: "Event" },
              { label: "Jobs", value: "Jobs" },
              { label: "Antipsychotics", value: "Antipsychotics" },
              { label: "Products", value: "Products" },
              { label: "Research", value: "Research" },
            ]}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Advertiser
          </label>
          <CustomSelect
            className="h-11 w-full"
            value={advertiser}
            onChange={(value: string) => setAdvertiser(value)}
            options={[
              { label: "Select Advertiser", value: "" },
              { label: "Neuroscience Solutions", value: "Neuroscience Solutions" },
              { label: "HealthMind", value: "HealthMind" },
              { label: "BrainBoost Labs", value: "BrainBoost Labs" },
              { label: "Wellness Hub", value: "Wellness Hub" },
              { label: "Cognitive Lab", value: "Cognitive Lab" },
            ]}
          />
        </div>
      </div>

      {/* Note */}
      <div className="rounded-md bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
        Note: A section will only appear here if you have added at least one custom
        tab in Category Management.
      </div>

      {/* Industry + Status */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Industry
          </label>
          <CustomSelect
            className="h-11 w-full"
            value={industry}
            onChange={(value: string) => setIndustry(value)}
            options={[
              { label: "Select your industry", value: "" },
              { label: "Biotech", value: "Biotech" },
              { label: "Psychotropic", value: "Psychotropic" },
              { label: "Publications", value: "Publications" },
            ]}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Status
          </label>
          <CustomSelect
            className="h-11 w-full"
            value={status}
            onChange={(value: string) => setStatus(value)}
            options={[
              { label: "Select your status", value: "" },
              { label: "Publish", value: "Publish" },
              { label: "Pending", value: "Pending" },
              { label: "Cancel", value: "Cancel" },
              { label: "Expired", value: "Expired" },
            ]}
          />
        </div>
      </div>

      {/* Upload Product Image */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Upload Product Image <span className="text-red-500">*</span>
        </label>

        {/* Existing image only in Edit mode */}
        {isEditMode && job?.advertisImage && (
          <div className="mb-3">
            <Image
              src={job.advertisImage}
              alt="Current advertisement"
              width={180}
              height={180}
              className="rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}

        {/* Drop zone */}
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-gray-400">
          <svg
            className="mx-auto h-10 w-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 overflow-hidden text-black text-center text-ellipsis font-['Segoe_UI'] text-base not-italic font-normal leading-6 tracking-[0.08px]">
            Drag and drop your file, or{" "}
            <span className="cursor-pointer font-medium text-[#04A1B7] hover:underline">
              choose here
            </span>
          </p>
          <p className="mt-1 overflow-hidden text-[#8C8C8C] text-center text-ellipsis whitespace-nowrap font-['Segoe_UI'] text-[14px] font-normal leading-[19.6px] tracking-[0.07px]">
            Support file: JPG, PNG or WEBP
          </p>
        </div>
      </div>

      {/* Starting Date & Ending Date */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Starting Date
          </label>
          <DateRangePicker
            className="h-11 w-full"
            date={startDate}
            setDate={setStartDate}
            placeholder="29 July, 2026 | 10:23 PM"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Ending Date
          </label>
          <DateRangePicker
            className="h-11 w-full"
            date={endDate}
            setDate={setEndDate}
            placeholder="29 Aug, 2026 | 10:23 PM"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          rows={4}
          value={description}
        //   onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gray-500 focus:ring-0 resize-none"
          placeholder="Enter description..."
        />
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onUpdate}
          className="rounded-md bg-[#04A1B7] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#038a9c]"
        >
          {isEditMode ? "Update" : "Publish Advertisement"}
        </button>
      </div>
    </div>
  );
}