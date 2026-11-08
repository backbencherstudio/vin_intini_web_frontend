"use client";

import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import RootDialog from "@/components/reusable/RootDialog";
import {
  useCreateGroupMutation,
  useGroupUpdateMutation,
} from "@/feature/slice/group/groupSlice";
import { GroupDetailType } from "@/lib/type";
import { ImageUploadIcon, UploadUPIcon } from "@/public/svgIcons/Icons";
import { Loader, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

const interestOptions = [
  { value: "Psychology", label: "Psychology" },
  { value: "Neuroscience", label: "Neuroscience" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "Counseling", label: "Counseling" },
  { value: "Biotech", label: "Biotech" },
  { value: "Psychotropics", label: "Psychotropics" },
  { value: "Publications", label: "Publications" },
  { value: "Abnormal Psychology", label: "Abnormal Psychology" },
  { value: "Behavioral Psychology", label: "Behavioral Psychology" },
  { value: "Biopsychology", label: "Biopsychology" },
  { value: "Clinical Psychology", label: "Clinical Psychology" },
  { value: "Cognitive Psychology", label: "Cognitive Psychology" },
  { value: "Counseling Psychology", label: "Counseling Psychology" },
  { value: "Developmental Psychology", label: "Developmental Psychology" },
  { value: "Educational Psychology", label: "Educational Psychology" },
  { value: "Forensic Psychology", label: "Forensic Psychology" },
  { value: "Health Psychology", label: "Health Psychology" },
  {
    value: "Industrial Organizational Psychology",
    label: "Industrial Organizational Psychology",
  },
  { value: "Personality Psychology", label: "Personality Psychology" },
  { value: "School Psychology", label: "School Psychology" },
  { value: "Social Psychology", label: "Social Psychology" },
  { value: "Sport Psychology", label: "Sport Psychology" },
  { value: "Affective Neuroscience", label: "Affective Neuroscience" },
  { value: "Behavioral Neuroscience", label: "Behavioral Neuroscience" },
  { value: "Clinical Neuroscience", label: "Clinical Neuroscience" },
  { value: "Cognitive Neuroscience", label: "Cognitive Neuroscience" },
  { value: "Computational Neuroscience", label: "Computational Neuroscience" },
  { value: "Developmental Neuroscience", label: "Developmental Neuroscience" },
  { value: "Neuroanatomy", label: "Neuroanatomy" },
  { value: "Neuroeconomics", label: "Neuroeconomics" },
  { value: "Neuroengineering", label: "Neuroengineering" },
  { value: "Neurogenetics", label: "Neurogenetics" },
  { value: "Neuroimaging", label: "Neuroimaging" },
  { value: "Neurolinguistics", label: "Neurolinguistics" },
  { value: "Neuropsychology", label: "Neuropsychology" },
  { value: "Neurophysiology", label: "Neurophysiology" },
  { value: "Psychopharmacology", label: "Psychopharmacology" },
];


export default function CreateGroupForm({
  open,
  setOpen,
  groupData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  groupData?: GroupDetailType;
}) {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    groupData?.logo_url || null,
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    groupData?.cover_photo_url || null,
  );
  const logoRef = useRef<HTMLInputElement | null>(null);
  const coverRef = useRef<HTMLInputElement | null>(null);
  const [createGroup, { isError, isLoading }] = useCreateGroupMutation();
  const [groupUpdate, { isError: isUpdateError, isLoading: isUpdateLoading }] =
    useGroupUpdateMutation();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<GroupFormValues>({
    defaultValues: {
      name: groupData?.name || "",
      description: groupData?.description || "",
      industry: groupData?.industry || [],
      location: groupData?.location || "",
      rules: groupData?.rules || "",
      type: groupData?.type || "public",
      discoverability: groupData?.discoverability || "listed",
      allow_member_invites: groupData?.allow_member_invites ?? true,
      require_post_approval: groupData?.require_post_approval ?? true,
    },
  });

  // Watch group type for conditional rendering
  const selectedType = watch("type");
  const descriptionText = watch("description") || "";
  const logoRegistration = register("logo");
  const coverRegistration = register("cover_photo");

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

    // Ensure files are appended using React refs (safe for Next.js)
    const logoEl = logoRef.current;
    const coverEl = coverRef.current;

    if (logoEl?.files && logoEl.files[0]) {
      formData.append("logo", logoEl.files[0]);
    } else if (data.logo?.[0]) {
      formData.append("logo", data.logo[0]);
    }

    if (coverEl?.files && coverEl.files[0]) {
      formData.append("cover_photo", coverEl.files[0]);
    } else if (data.cover_photo?.[0]) {
      formData.append("cover_photo", data.cover_photo[0]);
    }

    try {
      if (groupData) {
        const response = await groupUpdate({
          id: groupData?.id,
          data: formData,
        }).unwrap();
        toast.success(response.message || "Group updated successfully!");
        setOpen(false);
        return;
      }
      const response = await createGroup(formData).unwrap();
      toast.success(response.message || "Group created successfully!");
      setOpen(false);
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast.error(error?.data?.message || "Failed to create group.");
    }
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="sm:max-w-2xl md:max-w-2xl w-full rounded-2xl overflow-hidden p-0 max-h-[90vh] [&>button]:hidden"
      ariaLabel={groupData ? "Edit Group" : "Create Group"}
      ariaDescription="Form to create or update a group"
    >
      <div className="flex max-h-[90vh] flex-col overflow-hidden bg-white">
        {/* Sticky Header with Title and Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-borderColor/60 bg-white px-6 py-4 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-headerColor">
            {groupData ? "Edit Group" : "Create a Group"}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-descriptionColor hover:bg-bgColor hover:text-headerColor transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Cover Photo & Logo Section */}
            <div className="relative h-36 md:h-44 w-full bg-linear-to-r from-cyan-100 via-sky-100 to-blue-200">
              {coverPreview && (
                <Image
                  src={coverPreview}
                  className="w-full h-full object-cover"
                  alt="Cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              )}
              <label className="absolute right-4 top-4 flex items-center gap-1.5 bg-white/90 hover:bg-white text-headerColor px-3 py-1.5 rounded-full cursor-pointer shadow-sm hover:shadow transition-all text-xs font-semibold backdrop-blur-xs">
                <UploadUPIcon className="w-3.5 h-3.5" />
                <span>{coverPreview ? "Change Cover" : "Add Cover"}</span>
                <input
                  id="coverInput"
                  name={coverRegistration.name}
                  ref={(node) => {
                    coverRef.current = node;
                    coverRegistration.ref(node);
                  }}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onBlur={coverRegistration.onBlur}
                  onChange={(e) => {
                    coverRegistration.onChange(e);
                    const file = e.target.files?.[0];
                    if (file) setCoverPreview(URL.createObjectURL(file));
                  }}
                />
              </label>

              {/* Floating Logo Box */}
              <div className="absolute -bottom-10 left-6 sm:left-8 h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden group">
                {logoPreview ? (
                  <>
                    <Image
                      src={logoPreview}
                      className="w-full h-full object-cover"
                      alt="Logo"
                      fill
                      sizes="88px"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLogoPreview(null);
                        if (logoRef.current) logoRef.current.value = "";
                      }}
                      className="p-1 z-10 cursor-pointer rounded-full bg-redColor/80 hover:bg-redColor text-white absolute right-1.5 top-1.5 transition-all shadow-xs"
                      title="Remove logo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-grayColor1 group-hover:text-primaryColor transition-colors">
                    <ImageUploadIcon className="w-8 h-8 opacity-60" />
                    <div className="absolute -right-1 -top-1 bg-white p-1 rounded-full shadow-xs border border-borderColor/60">
                      <UploadUPIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer" title="Upload group logo">
                  <input
                    id="logoInput"
                    name={logoRegistration.name}
                    ref={(node) => {
                      logoRef.current = node;
                      logoRegistration.ref(node);
                    }}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onBlur={logoRegistration.onBlur}
                    onChange={(e) => {
                      logoRegistration.onChange(e);
                      const file = e.target.files?.[0];
                      if (file) setLogoPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-14 space-y-6">
              {/* Group Name */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-headerColor mb-1.5">
                  Group name <span className="text-redColor">*</span>
                </label>
                <ReusableInput
                  id="name"
                  {...register("name", { required: "Group name is required" })}
                  placeholder="Ex. Product Design Community"
                  className={`w-full border rounded-xl p-3 text-sm md:text-base outline-none transition-all ${
                    errors.name
                      ? "border-red-500 bg-red-50"
                      : "border-borderColor focus:border-primaryColor"
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
                <label className="block text-sm md:text-base font-semibold text-headerColor mb-1.5">
                  Description <span className="text-redColor">*</span>
                </label>
                <ReusableTextarea
                  {...register("description", {
                    required: "Description is required to create a group",
                    maxLength: 2500,
                  })}
                  placeholder="What is the purpose of the group?"
                  rows={4}
                  className={`w-full border rounded-xl p-3 text-sm md:text-base outline-none transition-all resize-none ${
                    errors.description
                      ? "border-red-500 bg-red-50"
                      : "border-borderColor focus:border-primaryColor"
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

              {/* Collaboration Focus */}
              <div className="space-y-1.5">
                <label className="block text-sm md:text-base font-semibold text-headerColor mb-1.5">
                  Collaboration Focus (up to 3)
                </label>
                <Controller
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <CreatableSelectField
                      placeholder="Select collaboration focus here..."
                      values={field.value || []}
                      onChangeValues={field.onChange}
                      options={interestOptions}
                      isMulti
                      maxCount={3}
                      className="w-full"
                    />
                  )}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-headerColor mb-1.5">
                  Location
                </label>
                <ReusableInput
                  id="location"
                  {...register("location")}
                  placeholder="Add a location"
                  className="w-full resize-none rounded-xl border border-borderColor bg-white px-4 py-3 text-sm md:text-base outline-none transition focus:border-primaryColor focus:ring-1 focus:ring-primaryColor/20"
                />
              </div>

              {/* Rules & Purpose */}
              <div className="space-y-1.5">
                <label className="block text-sm md:text-base font-semibold text-headerColor">
                  Rules & Purpose
                </label>
                <ReusableTextarea
                  {...register("rules", {
                    required: "Rules are required to create a group",
                    maxLength: 2500,
                  })}
                  placeholder="What are the rules and guidelines for this group?"
                  rows={4}
                  className={`w-full border rounded-xl p-3 text-sm md:text-base outline-none transition-all resize-none ${
                    errors.rules
                      ? "border-red-500 bg-red-50"
                      : "border-borderColor focus:border-primaryColor"
                  }`}
                />
                <div className="flex justify-between mt-1 text-[11px]">
                  <span className="text-gray-400">
                    {(watch("rules") || "").length}/2500
                  </span>
                  {errors.rules && (
                    <span className="text-red-500 font-medium">
                      {errors.rules.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Group Type */}
              <div className="space-y-3">
                <p className="text-sm md:text-base font-bold text-headerColor">Group type</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${selectedType === "public" ? "border-primaryColor bg-primaryColor/5" : "border-borderColor bg-white hover:bg-gray-50/60"}`}>
                    <input
                      type="radio"
                      value="public"
                      {...register("type")}
                      className="mt-0.5 h-4 w-4 accent-primaryColor"
                    />
                    <div>
                      <span className="font-semibold text-headerColor block text-sm">
                        Public
                      </span>
                      <p className="text-xs text-descriptionColor leading-relaxed mt-0.5">
                        Anyone on Mind Unite can view and search posts in this group.
                      </p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${selectedType === "private" ? "border-primaryColor bg-primaryColor/5" : "border-borderColor bg-white hover:bg-gray-50/60"}`}>
                    <input
                      type="radio"
                      value="private"
                      {...register("type")}
                      className="mt-0.5 h-4 w-4 accent-primaryColor"
                    />
                    <div>
                      <span className="font-semibold text-headerColor block text-sm">
                        Private
                      </span>
                      <p className="text-xs text-descriptionColor leading-relaxed mt-0.5">
                        Only approved group members can view and publish posts.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditional Discoverability (Shown only when Private is selected) */}
              {selectedType === "private" && (
                <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-sm md:text-base font-bold text-headerColor">
                    Discoverability
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-borderColor bg-white hover:bg-gray-50/60 cursor-pointer transition-all">
                      <input
                        type="radio"
                        value="listed"
                        {...register("discoverability")}
                        className="mt-0.5 h-4 w-4 accent-primaryColor"
                      />
                      <div>
                        <span className="font-semibold text-headerColor block text-sm">
                          Listed
                        </span>
                        <p className="text-xs text-descriptionColor leading-relaxed mt-0.5">
                          Group appears in search results and on member profiles.
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-borderColor bg-white hover:bg-gray-50/60 cursor-pointer transition-all">
                      <input
                        type="radio"
                        value="unlisted"
                        {...register("discoverability")}
                        className="mt-0.5 h-4 w-4 accent-primaryColor"
                      />
                      <div>
                        <span className="font-semibold text-headerColor block text-sm">
                          Unlisted
                        </span>
                        <p className="text-xs text-descriptionColor leading-relaxed mt-0.5">
                          Hidden from search and non-member profiles.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Permissions */}
              <div className="space-y-3 pt-4 border-t border-borderColor/60">
                <p className="text-sm md:text-base font-bold text-headerColor">Permissions</p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("allow_member_invites")}
                      className="h-4.5 w-4.5 mt-0.5 accent-primaryColor rounded"
                    />
                    <div>
                      <span className="text-sm md:text-base font-medium text-headerColor block">
                        Allow members to invite their connections
                      </span>
                      <p className="text-xs md:text-sm text-descriptionColor mt-0.5">
                        Group members can invite 1st degree connections. Requests still require admin approval.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("require_post_approval")}
                      className="h-4.5 w-4.5 mt-0.5 accent-primaryColor rounded"
                    />
                    <div>
                      <span className="text-sm md:text-base font-medium text-headerColor block">
                        Require new posts to be reviewed by admins
                      </span>
                      <p className="text-xs md:text-sm text-descriptionColor mt-0.5">
                        Members&apos; posts will require admin review before becoming visible.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2 pb-6">
                <button
                  type="submit"
                  disabled={isLoading || isUpdateLoading}
                  className="bg-primaryColor hover:bg-primaryColor/90 text-white px-12 py-3 rounded-full font-bold text-base hover:shadow-lg shadow-primaryColor/50 cursor-pointer transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
                >
                  {isUpdateLoading ? (
                    <Loader className="animate-spin h-5 w-5 text-white" />
                  ) : groupData ? (
                    "Update Group"
                  ) : isLoading ? (
                    <Loader className="animate-spin h-5 w-5 text-white" />
                  ) : (
                    "Create Group"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </RootDialog>
  );
}
