"use client";

import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import { ImageUploadIcon, UploadUPIcon } from "@/public/svgIcons/Icons";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select, { type MultiValue, type StylesConfig } from "react-select";

type IndustryOption = {
  value: string;
  label: string;
};

type GroupFormValues = {
  name: string;
  description: string;
  industry: string[];
  location: string;
  rules: string;
  type: "public" | "private";
  discoverability: "listed" | "unlisted";
  allow_member_invites: boolean;
  require_post_approval: boolean;
  logo: FileList;
  cover_photo: FileList;
};

const industrySelectStyles: StylesConfig<IndustryOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: "52px",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#00A3B1" : base.borderColor,
    boxShadow: state.isFocused ? "0 0 0 2px #D9F4F7" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#00A3B1" : base.borderColor,
    },
  }),
  valueContainer: (base) => ({
    ...base,
    minHeight: "52px",
    paddingTop: "2px",
    paddingBottom: "2px",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    minHeight: "52px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 30,
  }),
};

const industryOptions: IndustryOption[] = [
  { value: "Technology", label: "Technology" },
  { value: "Design", label: "Design" },
  { value: "Development", label: "Development" },
  { value: "Marketing", label: "Marketing" },
  { value: "Business", label: "Business" },
];

export default function CreateGroupForm() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<GroupFormValues>({
    defaultValues: {
      industry: [],
      type: "public",
      discoverability: "listed",
      allow_member_invites: true,
      require_post_approval: true,
    },
  });

  // Watch group type for conditional rendering
  const selectedType = watch("type");
  const descriptionText = watch("description") || "";

  const onSubmit = async (data: GroupFormValues) => {
    const formData = new FormData();

    // API Body Mapping
    formData.append("name", data.name);
    formData.append("description", data.description);
    data.industry.forEach((industry) => {
      formData.append("industry", industry);
    });
    formData.append("location", data.location || "");
    formData.append("rules", data.rules || "");
    formData.append("type", data.type);
    formData.append(
      "discoverability",
      data.type === "private" ? data.discoverability : "listed",
    );

    // Boolean to '1' or '0' as per your API image
    formData.append(
      "allow_member_invites",
      data.allow_member_invites ? "1" : "0",
    );
    formData.append(
      "require_post_approval",
      data.require_post_approval ? "1" : "0",
    );

    if (data.logo?.[0]) formData.append("logo", data.logo[0]);
    if (data.cover_photo?.[0])
      formData.append("cover_photo", data.cover_photo[0]);

    console.log("Submitting API Payload:", Object.fromEntries(formData));
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto pt-10 ">
      <form onSubmit={handleSubmit(onSubmit)} className="  ">
        {/* Cover Photo & Logo Section */}
        <div className="relative h-40 md:h-48 w-full bg-gradient-to-r from-cyan-100 to-blue-200">
          {coverPreview && (
            <Image
              src={coverPreview}
              className="w-full h-full object-cover"
              alt="Cover"
              fill
            />
          )}
          <label className="absolute right-4 top-4 bg-white p-2 rounded-full cursor-pointer hover:bg-white shadow-sm transition-all">
            <span className="text-xl">
              <UploadUPIcon />
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              {...register("cover_photo")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setCoverPreview(URL.createObjectURL(file));
              }}
            />
          </label>

          {/* Floating Logo Box */}
          <div className="absolute -bottom-12 left-8 h-20 w-20 bg-bgLightColor rounded-xl flex items-center justify-center">
            {logoPreview ? (
              <>
                <Image
                  src={logoPreview}
                  className="w-full h-full object-cover"
                  alt="Logo"
                  fill
                />
                <button
                  onClick={() => setLogoPreview(null)}
                  className="p-1 rounded-full birder bg-redColor/15 absolute -right-2 -top-2 hover:bg-redColor/20 transition-all"
                >
                  <X className="w-4 h-4  text-redColor" />
                </button>
              </>
            ) : (
              <div>
                <ImageUploadIcon className="w-10 h-10 text-grayColor1" />

                <button className="absolute -right-2 -top-2 bg-white p-2 rounded-full cursor-pointer hover:bg-white  transition-all">
                  <UploadUPIcon />
                </button>
              </div>
            )}
            <label className="absolute inset-0  cursor-pointer flex items-center justify-center transition-all">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                {...register("logo")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setLogoPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        <div className="p-8 pt-16 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block font-semibold text-descriptionColor mb-1.5">
              Group name
            </label>
            <ReusableInput
              id="name"
              {...register("name", { required: "Group name is required" })}
              placeholder="Ex. Product Design Community"
              className={`w-full border rounded-lg p-3 text-base outline-none transition-all ${
                errors.name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-[#00A3B1]"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-semibold text-descriptionColor mb-1.5">
              Description *
            </label>
            <ReusableTextarea
              {...register("description", {
                required: "Description is required to create a group",
                maxLength: 2500,
              })}
              placeholder="What is the purpose of the group?"
              rows={4}
              className={`w-full border rounded-lg p-3 text-base outline-none transition-all resize-none ${
                errors.description
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-[#00A3B1]"
              }`}
            />
            <div className="flex justify-between mt-1 text-[11px]">
              <span className="text-gray-400">
                {descriptionText.length}/2500
              </span>
              {errors.description && (
                <span className="text-red-500 font-medium">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Industry & Location */}
          <div className="space-y-1.5">
            <p className="block text-base font-semibold text-slate-700">
              Industry (up to 3)
            </p>
            <Controller
              control={control}
              name="industry"
              render={({ field }) => (
                <Select
                  placeholder="Select industry here..."
                  value={industryOptions.filter((option) =>
                    (selectedIndustries.length
                      ? selectedIndustries
                      : field.value || []
                    ).includes(option.value),
                  )}
                  onChange={(selectedOptions: MultiValue<IndustryOption>) => {
                    const values = selectedOptions
                      .map((option) => option.value)
                      .slice(0, 3);

                    setSelectedIndustries(values);
                    field.onChange(values);
                  }}
                  options={industryOptions}
                  isMulti
                  isSearchable
                  closeMenuOnSelect={false}
                  styles={industrySelectStyles}
                  className="h-13!"
                />
              )}
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-descriptionColor mb-1.5">
              Location
            </label>
            <ReusableInput
              id="location"
              {...register("location")}
              placeholder="Add a location"
              className="w-full resize-none rounded-lg border border-[#D6E8EC] bg-white px-4 py-3.5 text-base outline-none transition focus:border-primaryColor focus:ring-2 focus:ring-[#D9F4F7]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-slate-700">
              Rules
            </label>

            <ReusableTextarea
              {...register("rules", {
                required: "Rules are required to create a group",
                maxLength: 2500,
              })}
              placeholder="What is the purpose of the group?"
              rows={4}
              className={`w-full border rounded-lg p-3 text-base outline-none transition-all resize-none ${
                errors.rules
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-[#00A3B1]"
              }`}
            />
            <div className="flex justify-between mt-1 text-[11px]">
              <span className="text-gray-400">
                {descriptionText.length}/2500
              </span>
              {errors.description && (
                <span className="text-red-500 font-medium">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          {/* Group Type */}
          <div className="space-y-4">
            <p className="text-[16px] font-bold text-gray-800">Group type</p>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  value="public"
                  {...register("type")}
                  className="mt-1.5 h-4.5 w-4.5 accent-[#00A3B1]"
                />
                <div>
                  <span className="font-semibold text-gray-800 block">
                    Public
                  </span>
                  <p className="text-[12px] text-gray-500 leading-tight">
                    Anyone in the MindUnite platform can see posts in the group.
                    The group appears in search results.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  value="private"
                  {...register("type")}
                  className="mt-1.5 h-4.5 w-4.5 accent-[#00A3B1]"
                />
                <div>
                  <span className="font-semibold text-gray-800 block">
                    Private
                  </span>
                  <p className="text-[12px] text-gray-500 leading-tight">
                    Only group members will be able to see/post in the group.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Discoverability (Shown only when Private is selected) */}
          {selectedType === "private" && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-[16px] font-bold text-gray-800">
                Discoverability
              </p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="listed"
                    {...register("discoverability")}
                    className="mt-1.5 h-4.5 w-4.5 accent-primaryColor"
                  />
                  <div>
                    <span className="font-semibold text-gray-800 block">
                      Listed
                    </span>
                    <p className="text-[12px] text-gray-500 leading-tight">
                      The group appears in search results, is visible to others
                      on members&apos; profiles, and
                      <span className="font-bold">MindUnite</span> users can see
                      whether a connection is a member.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="unlisted"
                    {...register("discoverability")}
                    className="mt-1.5 h-4.5 w-4.5 accent-[#00A3B1]"
                  />
                  <div>
                    <span className="font-semibold text-gray-800 block">
                      Unlisted
                    </span>
                    <p className="text-[12px] text-gray-500 leading-tight">
                      The group does not appear in search results for non-group
                      members and is not visible to non-group members on
                      members&apos; profiles.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Permissions */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <p className="text-[16px] font-bold text-gray-800">Permissions</p>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("allow_member_invites")}
                  className="h-4.5 w-4.5 mt-1.5 accent-[#00A3B1] rounded"
                />
                <div>
                  <span className="text-base  text-headerColor">
                    Allow members to invite their connections
                  </span>
                  <p className="text-sm text-descriptionColor">
                    Group members can invite 1st degree connections to the
                    group. All requests to join will still require admin
                    approval.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("require_post_approval")}
                  className="h-4.5 w-4.5 mt-1.5 accent-[#00A3B1] rounded"
                />
                <div className="">
                  <span className="text-base text-headerColor">
                    Require new posts to be reviewed by admins
                  </span>
                  <p className="text-sm text-descriptionColor">
                    Members' posts will require admin approval within 14 days
                    before they become visible to others.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center ">
            <button
              type="submit"
              className="bg-[#00A3B1] text-white px-14 py-3.5 rounded-full font-bold text-[16px] hover:bg-[#008c99] transition-all active:scale-95 shadow-md shadow-cyan-100"
            >
              Create Group
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
