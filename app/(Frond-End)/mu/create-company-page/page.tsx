"use client";

import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import emptyUser from "@/public/empty_user.jpg";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Breadcrumb from "../../_components/Breadcrumb";

interface CompanyFormData {
  company_name: string;
  company_address: string;
  website: string;
  industry: string;
  company_size: string;
  tagline: string;
  is_verified: boolean;
  logo: File | null;
  cover_photo: File | null;
}

const companySizeOptions = [
  { value: "1 - 10", label: "1 - 10" },
  { value: "10 - 100", label: "10 - 100" },
  { value: "100 - 1000", label: "100 - 1000" },
  { value: "1000 - 5000", label: "1000 - 5000" },
  { value: "5000+", label: "5000+" },
];

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export default function CreateCompanyPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const [isCoverDragging, setIsCoverDragging] = useState(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    defaultValues: {
      company_name: "",
      company_address: "",
      website: "",
      industry: "",
      company_size: "",
      tagline: "",
      is_verified: false,
      logo: null,
      cover_photo: null,
    },
  });

  // Watch form fields for live preview
  const watchedName = watch("company_name");
  const watchedAddress = watch("company_address");
  const watchedTagline = watch("tagline");
  const watchedSize = watch("company_size");

  // Handle Logo Upload
  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Logo must be JPG, PNG, or WEBP");
      return;
    }
    setValue("logo", file, { shouldValidate: true });
    setLogoPreview(URL.createObjectURL(file));
  };

  // Handle Cover Upload
  const handleCoverFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Cover image must be JPG, PNG, or WEBP");
      return;
    }
    setValue("cover_photo", file, { shouldValidate: true });
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("logo", null, { shouldValidate: true });
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const removeCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("cover_photo", null, { shouldValidate: true });
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const onSubmit = async (data: CompanyFormData) => {
    if (!data.logo) {
      toast.error("Please upload a logo image");
      return;
    }
    if (!data.cover_photo) {
      toast.error("Please upload a cover image");
      return;
    }

    console.log("Company Page Data:", data);
    toast.success("Company page created successfully!");
  };

  return (
    <div className="min-h-screen pb-8 pt-4 lg:by-12">
      <div className="container">
        <div className="mb-6 md:mb-8">
          <Breadcrumb />
          <h1 className="text-xl md:text-2xl text-center font-bold text-headerColor">
            Create a Company Page For Mind Unite
          </h1>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Company Name */}
                <ReusableInput
                  id="company_name"
                  label="Company Name"
                  required
                  placeholder="Add your company name"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors.company_name?.message}
                  {...register("company_name", {
                    required: "Company name is required",
                  })}
                />

                {/* Company Address */}
                <ReusableInput
                  id="company_address"
                  label="Add your company address"
                  required
                  placeholder="www.mindunite/company/your-company-name"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors.company_address?.message}
                  {...register("company_address", {
                    required: "Company address is required",
                  })}
                />

                {/* Website */}
                <ReusableInput
                  id="website"
                  label="Website"
                  required
                  placeholder="www.yourcompany.com"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors.website?.message}
                  {...register("website", {
                    required: "Website is required",
                  })}
                />

                {/* Industry */}
                <ReusableInput
                  id="industry"
                  label="Industry"
                  required
                  placeholder="Ex: Information & Technology Service"
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors.industry?.message}
                  {...register("industry", {
                    required: "Industry is required",
                  })}
                />

                {/* Company Size */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company_size"
                    className="text-sm text-descriptionColor font-medium"
                  >
                    Company Size <span className="text-redColor">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="company_size"
                    rules={{ required: "Company size is required" }}
                    render={({ field }) => (
                      <SelecteInputField
                        id="company_size"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Company Size"
                        options={companySizeOptions}
                        className="h-12! md:h-13! rounded-lg border-borderColor bg-white w-full text-sm font-normal text-headerColor"
                      />
                    )}
                  />
                  {errors.company_size && (
                    <p className="text-red-500 text-xs">
                      {errors.company_size.message}
                    </p>
                  )}
                </div>

                {/* Upload Logo Image */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-descriptionColor font-medium">
                    Upload Logo Image <span className="text-redColor">*</span>
                  </Label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      handleLogoFile(e.target.files?.[0]);
                    }}
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsLogoDragging(true);
                    }}
                    onDragLeave={() => setIsLogoDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsLogoDragging(false);
                      handleLogoFile(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => logoInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
                      isLogoDragging
                        ? "border-primaryColor bg-primaryColor/5"
                        : "border-gray-300 bg-white hover:border-primaryColor"
                    }`}
                  >
                    {logoPreview ? (
                      <div className="relative group flex flex-col items-center">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow-xs mb-2"
                        />
                        <p className="text-xs text-descriptionColor font-medium mb-1">
                          Click to change image
                        </p>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-1 -right-4 p-1 bg-redColor/10 hover:bg-redColor text-redColor hover:text-white rounded-full transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <CloudUpload className="mb-2 h-7 w-7 text-gray-500" />
                        <p className="text-sm text-descriptionColor">
                          Drag and drop your file, or{" "}
                          <span className="font-medium text-primaryColor">
                            choose here
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Support file: JPG, PNG or WEBP
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Upload Cover Image */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-descriptionColor font-medium">
                    Upload Cover Image <span className="text-redColor">*</span>
                  </Label>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      handleCoverFile(e.target.files?.[0]);
                    }}
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsCoverDragging(true);
                    }}
                    onDragLeave={() => setIsCoverDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsCoverDragging(false);
                      handleCoverFile(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => coverInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
                      isCoverDragging
                        ? "border-primaryColor bg-primaryColor/5"
                        : "border-gray-300 bg-white hover:border-primaryColor"
                    }`}
                  >
                    {coverPreview ? (
                      <div className="relative group w-full max-w-xs flex flex-col items-center">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-24 rounded-lg object-cover border border-gray-200 shadow-xs mb-2"
                        />
                        <p className="text-xs text-descriptionColor font-medium mb-1">
                          Click to change image
                        </p>
                        <button
                          type="button"
                          onClick={removeCover}
                          className="absolute -top-1 -right-2 p-1 bg-redColor/10 hover:bg-redColor text-redColor hover:text-white rounded-full transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <CloudUpload className="mb-2 h-7 w-7 text-gray-500" />
                        <p className="text-sm text-descriptionColor">
                          Drag and drop your file, or{" "}
                          <span className="font-medium text-primaryColor">
                            choose here
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Support file: JPG, PNG or WEBP
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <ReusableInput
                  id="tagline"
                  label="Tagline"
                  required
                  placeholder="ex: An information services firm helping small businesses succeed."
                  className="rounded-lg border-borderColor text-sm text-headerColor"
                  error={errors.tagline?.message}
                  {...register("tagline", {
                    required: "Tagline is required",
                  })}
                />

                {/* Verification Checkbox */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-start gap-3">
                    <Controller
                      control={control}
                      name="is_verified"
                      rules={{
                        required:
                          "You must verify that you are an authorized representative",
                      }}
                      render={({ field }) => (
                        <Checkbox
                          id="is_verified"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 border-gray-400 data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor rounded"
                        />
                      )}
                    />
                    <label
                      htmlFor="is_verified"
                      className="text-xs md:text-[13px] text-gray-500 leading-snug cursor-pointer select-none"
                    >
                      I verify that I am an authorized representative of this
                      organization and have the right to act on its behalf in
                      the creation and management of this page. The organization
                      and I agree to the additional terms for Pages.
                    </label>
                  </div>
                  {errors.is_verified && (
                    <p className="text-red-500 text-xs">
                      {errors.is_verified.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 md:h-13 cursor-pointer rounded-lg bg-[#04A1B7] hover:bg-[#038fa3] active:scale-[0.99] text-white font-medium text-base transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  Create Page
                </button>
              </form>
            </div>

            {/* Right Column: Live Preview Card */}
            <div className="lg:col-span-5 sticky top-29">
              <div className=" overflow-hidden shadow-xs">
                {/* Cover Banner */}
                <div className="relative h-44 md:h-48 w-full bg-linear-to-r from-cyan-100 to-blue-200 overflow-hidden">
                  {coverPreview ? (
                    <Image
                      src={coverPreview}
                      alt="Company Cover"
                      className="w-full h-full object-cover"
                      width={400}
                      height={292}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-r from-cyan-100 to-blue-200" />
                  )}
                </div>

                {/* Avatar / Logo */}
                <div className="px-6 relative">
                  <div className="relative -mt-11 md:-mt-12 w-20 h-20 md:w-22 md:h-22 rounded-full border-2 border-white shadow-sm overflow-hidden bg-primaryColor flex items-center justify-center">
                    <Image
                      src={logoPreview || emptyUser}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                      width={400}
                      height={292}
                    />
                  </div>
                </div>

                {/* Info Details */}
                <div className="px-6 pt-3 pb-8 space-y-1">
                  <h3 className="text-xl font-bold text-headerColortracking-tight">
                    {watchedName.trim() ? watchedName : "Company Name"}
                  </h3>
                  <p className="text-sm text-descriptionColor font-normal">
                    {watchedTagline.trim() ? watchedTagline : "Tagline"}
                  </p>
                  <p className="text-xs text-descriptionColor font-normal pt-1">
                    {watchedAddress.trim() ? watchedAddress : "Location"}
                  </p>
                  <p className="text-xs text-descriptionColor font-normal">
                    {watchedSize.trim()
                      ? `${watchedSize} employees`
                      : "Company Size"}
                  </p>

                  {/* Bottom Divider */}
                  <div className="border-t border-borderColor pt-3 mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
