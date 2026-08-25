"use client";

import { Ban, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CreatableSelectField from "@/components/reusable/InputFiled/CreatableSelectField";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";

import ButtonReuseable from "@/components/reusable/CustomButton";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import { LockIcon, ProfileVisibiltyIcon } from "@/public/svgIcons/Icons";
import { BsKey } from "react-icons/bs";
import GeneralSettingHeader from "./GeneralSettingHeader";
import { useGeneralPrivacySettingUpdateMutation, useGeneralSettingUpdateMutation, useGetAllStatesQuery } from "@/feature/slice/settingSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { countries } from "@/public/demoData/RealData";

export type GeneralSettingsFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  state: string;
  country: string;
  postal_code: string;
  privacy_profile_activity: string;
  privacy_profile_visibility: string;
};

const countryOptions = countries.map((c) => ({
  value: c.country,
  label: c.country,
}));

const visibilityOptions1 = [
  { value: "everyone", label: "Everyone" },
  { value: "only_connections", label: "Only Connections" },
  { value: "only_me", label: "Only Me" },
];
const visibilityOptions = [
  { value: "everyone", label: "Everyone" },
  { value: "only_me", label: "Only Me" },
];

export default function GeneralSettingsPage() {
  const { data } = useGetUserProfileQuery("user");
  const { data: statesData } = useGetAllStatesQuery("states");
  const user = data?.user;
  const profile = user?.profile;

  const stateOptions = (statesData?.data || []).map((s: any) => ({
    value: s.name,
    label: s.name,
  }));

  const stateIdByName: Record<string, number> = {};
  (statesData?.data || []).forEach((s: any) => {
    stateIdByName[s.name] = s.id;
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<GeneralSettingsFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      state: "",
      country: "",
      postal_code: "",
      privacy_profile_activity: "",
      privacy_profile_visibility: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    const rawState = profile?.state;
    const stateName =
      typeof rawState === "object" && rawState !== null
        ? rawState.name || ""
        : rawState || "";

    reset({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.mobile || "",
      address: profile?.address || "",
      state: stateName,
      country: typeof profile?.country === "object" && profile?.country !== null
        ? profile.country.name || ""
        : profile?.country || "",
      postal_code: profile?.postal_code || "",
      privacy_profile_activity: profile?.privacy_profile_activity || "",
      privacy_profile_visibility: profile?.privacy_profile_visibility || "",
    });
  }, [user, profile, reset]);

  const [generalSettingUpdate] = useGeneralSettingUpdateMutation();
  const [generalPrivacySettingUpdate] = useGeneralPrivacySettingUpdateMutation();

  const onSubmit = async (formData: GeneralSettingsFormValues) => {
    try {
      const rawState = profile?.state;
      const currentState =
        typeof rawState === "object" && rawState !== null
          ? rawState.name || formData.state
          : formData.state;
      const stateId =
        stateIdByName[formData.state] ||
        (typeof rawState === "object" && rawState !== null ? rawState.id : null);

      await generalSettingUpdate({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          address: formData.address,
          state_id: stateId,
          country: formData.country,
          postal_code: formData.postal_code,
        },
      }).unwrap();
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to update settings.");
    }
  };

  const handlePrivacyChange = async (
    fieldName: "privacy_profile_activity" | "privacy_profile_visibility",
    value: string,
  ) => {
    try {
      await generalPrivacySettingUpdate({
        data: { [fieldName]: value },
      }).unwrap();
      toast.success("Privacy updated!");
    } catch (error) {
      toast.error("Failed to update privacy.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      {/* ----------------- Top Header Section ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center border-b border-border/60 pb-4 justify-between gap-4">
        <div className=" ">
          <h1 className="text-xl md:text-2xl font-semibold text-headerColor">
            Settings
          </h1>
          <p className="text-base text-grayColor1 mt-0.5">
            Manage your account, privacy, and preferences.
          </p>
        </div>

        <ButtonReuseable
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          title="Save Changes"
          sendingMsg={"Saving..."}
        />
      </div>
      <div className="bg-white border border-borderColor rounded-lg p-4 md:p-6 ">
        <GeneralSettingHeader />
      </div>

      {/* ----------------- General Settings Form Card ----------------- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white border border-borderColor rounded-lg p-4 md:p-6 ">
          <h2 className="text-xl md:text-2xl font-bold text-headerColor mb-5">
            General Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-descriptionColor mb-1.5">
                First Name
              </label>
              <ReusableInput
                id="first_name"
                placeholder="First Name"
                {...register("first_name")}
                className="h-11 rounded-lg border-gray-200 bg-white"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-descriptionColor mb-1.5">
                Last Name
              </label>
              <ReusableInput
                id="last_name"
                placeholder="Last Name"
                {...register("last_name")}
                className="h-11 rounded-lg border-gray-200 bg-white"
              />
            </div>

            {/* User Email */}
            <div>
              <label className="block text-sm font-semibold text-descriptionColor mb-1.5">
                User Email
              </label>
              <ReusableInput
                id="email"
                type="email"
                placeholder="User Email"
                {...register("email")}
                className="h-11 rounded-lg border-gray-200 bg-white"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-descriptionColor mb-1.5">
                Phone Number
              </label>
              <ReusableInput
                id="phone_number"
                placeholder="Phone Number"
                {...register("phone_number")}
                className="h-11 rounded-lg border-gray-200 bg-white"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-descriptionColor mb-1.5">
                Address
              </label>
              <ReusableInput
                id="address"
                placeholder="Address"
                {...register("address")}
                className="h-11 rounded-lg border-gray-200 bg-white"
              />
            </div>

            {/* State Select */}
            <div>
              <label className="block text-sm font-semibold text-descriptionColor mb-1.5">
                State
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={stateOptions}
                    placeholder="Select State"
                    className="h-11 w-full [&_.ant-select-selector]:h-11! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-gray-200! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
            </div>

            {/* Country Select */}
            <div>
              <label className="block text-sm font-semibold text-descriptionColor mb-1.5">
                Country
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <CreatableSelectField
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={countryOptions}
                    placeholder="Select Country"
                    className="h-11 w-full [&_.ant-select-selector]:h-11! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-gray-200! [&_.ant-select-selector]:px-3!"
                  />
                )}
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-semibold text-descriptionColor mb-1.5">
                Postal Code
              </label>
              <ReusableInput
                id="postal_code"
                placeholder="Postal Code"
                {...register("postal_code")}
                className="h-11 rounded-lg border-gray-200 bg-white"
              />
            </div>
          </div>
        </div>
      </form>
      {/* ----------------- Privacy Settings Card ----------------- */}
      <div className="bg-white border border-borderColor rounded-lg p-4 md:p-6 ">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Privacy</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Privacy Settings (Dropdown Card) */}
          <div className="border border-borderColor rounded-md p-2 md:p-4 flex items-center justify-between gap-3 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="">
                <LockIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  Privacy Settings
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  Who can see your profile and activity
                </p>
              </div>
            </div>

            <div className="w-36 shrink-0">
              <Controller
                name="privacy_profile_activity"
                control={control}
                render={({ field }) => (
                  <SelecteInputField
                    value={field.value || undefined}
                    onChange={(val) => {
                      field.onChange(val);
                      handlePrivacyChange("privacy_profile_activity", val);
                    }}
                    options={visibilityOptions1}
                    placeholder="Select"
                    className="h-9 w-full [&_.ant-select-selector]:h-9! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-gray-200!"
                  />
                )}
              />
            </div>
          </div>

          {/* 2. Profile Visibility (Dropdown Card) */}
          <div className="border border-borderColor rounded-md p-2 md:p-4 flex items-center justify-between gap-3 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className=" ">
                <ProfileVisibiltyIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  Profile Visibility
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  Manage your profile in search results
                </p>
              </div>
            </div>

            <div className="w-36 shrink-0">
              <Controller
                name="privacy_profile_visibility"
                control={control}
                render={({ field }) => (
                  <SelecteInputField
                    value={field.value || undefined}
                    onChange={(val) => {
                      field.onChange(val);
                      handlePrivacyChange("privacy_profile_visibility", val);
                    }}
                    options={visibilityOptions}
                    placeholder="Select"
                    className="h-9 w-full [&_.ant-select-selector]:h-9! [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-gray-200!"
                  />
                )}
              />
            </div>
          </div>

          {/* 3. Block Lists (Navigation Card) */}
          <div
            onClick={() => {
              /* Navigate to block list */
            }}
            className="border border-gray-200/80 rounded-md p-2 md:p-4 flex items-center justify-between gap-3 hover:border-gray-300 hover:bg-gray-50/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="">
                <Ban className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  Block Lists
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  See your blacklists in mind unite platform
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
          </div>

          {/* 4. Change Password (Navigation Card) */}
          <div
            onClick={() => {
              /* Open Change Password Modal */
            }}
            className="border border-gray-200/80 rounded-md p-2 md:p-4 flex items-center justify-between gap-3 hover:border-gray-300 hover:bg-gray-50/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="">
                <BsKey className="w-6 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-headerColor">
                  Change Password
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  Update your password regularly to keep your account secure.
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
