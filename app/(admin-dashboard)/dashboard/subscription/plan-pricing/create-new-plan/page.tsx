"use client";

import { useState } from "react";
import CustomInput from "@/components/reusable/dashboard/CustomInput";
import CustomSelect from "@/components/reusable/dashboard/CustomSelect";
import { DateRangePicker } from "@/components/reusable/dashboard/DataRangePiker";
import { DateRange } from "react-day-picker";
import { DeletIcon, EditIcon } from "@/public/svgIcons/AdminIcon";

interface CreatePlanModalProps {
  data?: any;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function CreatePlanModal({
  data,
  onClose,
  onSuccess,
}: CreatePlanModalProps) {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    shortDescription: data?.description || "",
    billingRate: data?.price?.replace("$", "") || "0.00",
    billingCycle: data?.billingCycle || "Yearly",
    discount: "0",
    badgeColor: "#04A1B7",
    status: data?.isActive ?? true,
  });

  const [features, setFeatures] = useState({
    searchMindUniteProfiles: false,
    profileViewVisibility: false,
    endorsementsRecommendations: false,
    buildYourNetwork: true,
    sendConnectionRequest: false,
    unlimitedDirectMessaging: false,
    joinCollaborationGroup: true,
    postsArticlesPhotosVideos: false,
    jobSearch: false,
    jobApplications: false,
    jobAlerts: false,
    unlimitedInMailMessages: false,
    savedSearchesWeeklyAlerts: false,
    interactiveMedia: false,
    profileViewerInsights: false,
    receiveUnlimitedMessages: false,
    connectWithOrganizations: false,
  });

  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      features,
      discountDuration: date,
    };

    try {
      console.log("Payload →", payload);

 
      // const res = await fetch("/api/plans", {
      //   method: data ? "PUT" : "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      await new Promise((r) => setTimeout(r, 700));
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const featureList = [
    { key: "searchMindUniteProfiles", label: "Search Mind unite Profiles" },
    { key: "profileViewVisibility", label: "Profile View Visibility" },
    { key: "endorsementsRecommendations", label: "Endorsements & Recommendations" },
    { key: "buildYourNetwork", label: "Build Your Network" },
    { key: "sendConnectionRequest", label: "Send A Connection Request" },
    { key: "unlimitedDirectMessaging", label: "Unlimited Direct Messaging" },
    { key: "joinCollaborationGroup", label: "Join a Collaboration Group" },
    { key: "postsArticlesPhotosVideos", label: "Posts, Articles, Photos, Videos" },
    { key: "jobSearch", label: "Job Search" },
    { key: "jobApplications", label: "Job Applications - Submit a CV/Resume" },
    { key: "jobAlerts", label: "Job Alerts" },
    { key: "unlimitedInMailMessages", label: "Unlimited InMail Messages" },
    { key: "savedSearchesWeeklyAlerts", label: "Saved Searches & Their Weekly Alerts" },
    { key: "interactiveMedia", label: "Interactive Media" },
    { key: "profileViewerInsights", label: "Profile Viewer Insights" },
    { key: "receiveUnlimitedMessages", label: "Receive Unlimited Messages" },
    { key: "connectWithOrganizations", label: "Connect with Organizations" },
  ] as const;

  return (
    <div className="w-full overflow-hidden rounded-[10px] ">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className=" border-[#E1E4EA]">
          <h2 className="text-[#1D1F2C] text-2xl font-semibold leading-[130%] tracking-[0.12px] ">
            {data ? "Edit Plan" : "Create New Plan"}
          </h2>
          <p className="mt-2  text-base font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
            Create a new subscription plan with pricing and features.
          </p>

        
        </div>

        <div className="py-4">
          <hr className="border-[#E1E4EA]" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Left Side - Plan Information */}
          <div className="space-y-5 border border-[#E2E8F0] p-4 rounded-lg">
            <div>
              <h3 className=" text-xl font-semibold leading-[130%] tracking-[0.1px] text-[#1D1F2C]">Plan Information</h3>
              <p className=" mt-1  text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">Add Subscription</p>
            </div>

            <CustomInput
              label="Plan Name"
              required
              placeholder="Enter subscription name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <CustomInput
              label="Short Description (Max 150 characters)"
              placeholder="Brief description about this plan..."
              value={formData.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
              maxLength={150}
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Billing Rate"
                required
                placeholder="0.00"
                value={formData.billingRate}
                onChange={(e) => handleChange("billingRate", e.target.value)}
                type="number"
              />
              <CustomSelect
                label="Billing Cycle"
                required
                value={formData.billingCycle}
                onChange={(v) => handleChange("billingCycle", v as string)}
                options={[
                  { label: "Monthly", value: "Monthly" },
                  { label: "Yearly", value: "Yearly" },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Discount %"
                placeholder="0%"
                value={formData.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
              />
              <div>
                <label className="  text-base font-semibold leading-[150%] tracking-[0.08px] text-[#4A4C56] ">Badge Color</label>
                <div className="flex items-center gap-2 relative mt-2">
                  <input
                    type="color"
                    value={formData.badgeColor}
                    onChange={(e) => handleChange("badgeColor", e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded  absolute left-2"
                  />
                  <CustomInput
                    value={formData.badgeColor}
                    onChange={(e) => handleChange("badgeColor", e.target.value)}
                    className="ps-16"
                  />
                </div>
              </div>
            </div>

            <DateRangePicker
              label="Discount Duration"
              date={date}
              setDate={setDate}
              placeholder="Select date"
            />

            {/* Status Toggle */}
            <div className="flex items-center justify-between rounded-lg  px-4 py-3">
              <div>
                <p className=" text-base font-semibold leading-[150%] tracking-[0.08px] text-[#4A4C56]">Plan Status</p>
                <p className=" text-sm font-normal leading-[140%] tracking-[0.07px] text-[#A5A5AB] mt-1">You can activate or deactivate this plan.</p>
              
                
              </div>
              <button
                type="button"
                onClick={() => handleChange("status", !formData.status)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  formData.status ? "bg-primaryColor" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    formData.status ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

    
          {/* Right Side - Features */}
<div className="space-y-5 border p-4 rounded-lg">
  
    <div>
      <h3 className=" text-xl font-semibold leading-[130%] tracking-[0.1px] text-[#1D1F2C]">
        Plan Feature
      </h3>
      <p className="mt-1  text-sm font-normal leading-[140%] tracking-[0.07px] text-[#777980]">
        Select and configure features for this plan
      </p>
       <div className="flex items-center justify-center gap-2 py-4 w-full">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md   hover:bg-gray-50"
        title="Delete"
      >
        <DeletIcon />
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md  hover:bg-gray-50"
        title="Edit"
      >
        <EditIcon />
      </button>
    </div>
   
  </div>

  {/* Feature List */}
  <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
    {featureList.map((item) => (
      <div
        key={item.key}
        className="flex items-center justify-between rounded-lg  px-4 py-3"
      >
        <span className=" text-xl font-semibold leading-[130%] tracking-[0.1px] text-[#4A4C56]">{item.label}</span>
        <button
          type="button"
          onClick={() => handleFeatureToggle(item.key)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            features[item.key] ? "bg-primaryColor" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              features[item.key] ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>
    ))}
  </div>
</div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E1E4EA] px-6 py-4">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-[#D9DDE5] px-6 text-[16px] font-medium text-[#0F172A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg border border-primaryColor bg-[#E9FAF7] px-5 text-base font-medium text-primaryColor hover:bg-[#DDF7FA] disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : data ? "Update Now" : "Create Now"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}