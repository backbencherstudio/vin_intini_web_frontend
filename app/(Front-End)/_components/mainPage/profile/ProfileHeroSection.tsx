"use client";
import ProfileHeroSkeleton from "@/components/reusable/All Skleton/ProfileHeroSkeleton";
import RootDialog from "@/components/reusable/RootDialog";
import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import {
  useGetExperienceQuery,
} from "@/feature/slice/user/experienceSlice";
import { useGetStudyQuery } from "@/feature/slice/user/studySlice";
import {
  useGetMyProfileQuery,
  useGetProfileByIdQuery,
  useProfileAboutUpdateMutation,
  useProfileImageUpdateMutation,
} from "@/feature/slice/user/userSlice";
import logoPreview from "@/public/empty_user.jpg";
import coverPreview from "@/public/images/cover imager.png";
import {
  EditeSquareIcon,
  GroupUserIcon,
  PencileIcon,
} from "@/public/svgIcons/Icons";
import { Expand, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdWorkOutline } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import ProfileEducationForm from "./Education/ProfileEducationForm";
import ProfileConnectionAction from "./ProfileConnectionAction";
import ProfilePhotoViewerDialog, {
  ProfilePhotoMode,
} from "./ProfilePhotoViewerDialog";
import ProfileUpdateForm from "./ProfileUpdateForm";
import ExpreanceAddFrom from "./expreance/ExpreanceAddFrom";

function ProfileHeroSection({ userId }: { userId?: string }) {
  const profileQuery = useGetProfileByIdQuery(userId ?? "", {
    skip: !userId,
  });
  const myProfileQuery = useGetMyProfileQuery("profile", {
    skip: Boolean(userId),
  });
  const { data, isLoading } = userId ? profileQuery : myProfileQuery;
  const [profileImageUpdate] = useProfileImageUpdateMutation();
  const [profileAboutUpdate, { isLoading: isUpdatingCurrent }] =
    useProfileAboutUpdateMutation();
  const [openEducationForm, setOpenEducationForm] = useState(false);
  const [openExperienceForm, setOpenExperienceForm] = useState(false);
  const [openSelectInstituteModal, setOpenSelectInstituteModal] =
    useState(false);
  const [openSelectExperienceModal, setOpenSelectExperienceModal] =
    useState(false);
  const [selectedInstituteId, setSelectedInstituteId] = useState<number | null>(
    null,
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const profileData = data?.data || {};
  const isOwnProfile = Boolean(profileData?.is_own_profile && !userId);
  const { data: studyData } = useGetStudyQuery(undefined, {
    skip: !isOwnProfile,
  });
  const { data: experienceData } = useGetExperienceQuery(undefined, {
    skip: !isOwnProfile,
  });
  const existingStudies: any[] = Array.isArray(studyData?.data)
    ? studyData.data
    : [];
  const existingExperiences: any[] = Array.isArray(experienceData?.data)
    ? experienceData.data
    : [];
  const [isNotify, setIsNotify] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [photoViewerMode, setPhotoViewerMode] =
    useState<ProfilePhotoMode | null>(null);
  const coverImgRef = useRef<HTMLInputElement>(null);
  const profileImgRef = useRef<HTMLInputElement>(null);

  const displayName =
    [profileData?.first_name, profileData?.last_name]
      .filter(Boolean)
      .join(" ") || "MindUnite Member";
  

  useEffect(() => {
    if (!coverImageFile) {
      setCoverImage(profileData?.cover_image_url || null);
    }
  }, [profileData?.cover_image_url, coverImageFile]);

  useEffect(() => {
    if (!profileImageFile) {
      setProfileImage(profileData?.profile_image_url || null);
    }
  }, [profileData?.profile_image_url, profileImageFile]);

  useEffect(() => {
    if (!coverImageFile && !profileImageFile) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      const formData = new FormData();

      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      if (coverImageFile) {
        formData.append("cover_image", coverImageFile);
      }

      try {
        await profileImageUpdate(formData).unwrap();
        setProfileImageFile(null);
        toast.success("Succesfully Update Profile Image");
        setCoverImageFile(null);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to update profile image");
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [coverImageFile, profileImageFile, profileImageUpdate]);

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCoverImageFile(file);
    setCoverImage(URL.createObjectURL(file));
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProfileHeroSkeleton />
      </div>
    );
  }

  return (
    <section>
      <div className="relative h-36 sm:h-44 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
        <button
          type="button"
          onClick={() => setPhotoViewerMode("cover")}
          aria-label="View cover photo"
          className="group relative block w-full h-full rounded-md overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor"
        >
          <Image
            src={coverImage || coverPreview}
            unoptimized={Boolean(coverImage)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            alt={`${displayName} cover photo`}
            width={1200}
            height={400}
          />
          <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/15" />
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
            <Expand className="h-3.5 w-3.5" />
            View cover
          </span>
        </button>
        <input
          type="file"
          ref={coverImgRef}
          accept="image/*,video/*"
          className="hidden"
          onChange={handleCoverImageChange}
        />
        {profileData?.is_own_profile && (
          <button
            type="button"
            aria-label="Edit cover photo"
            onClick={(e) => {
              e.stopPropagation();
              coverImgRef.current?.click();
            }}
            className="absolute top-2.5 right-2.5 z-10 cursor-pointer p-1.5 rounded-full bg-primaryColor shadow-sm hover:opacity-90 transition-opacity"
          >
            <EditeSquareIcon className="text-whiteColor" />
          </button>
        )}

        {/* Floating Logo Box */}
        <div className="flex px-3 sm:px-4 justify-between items-start w-full">
          <div className="-mt-10 sm:-mt-12 relative z-10 border-2 sm:border-[3px] border-white h-20 w-20 sm:h-24 sm:w-24 bg-bgLightColor rounded-full shadow-sm flex items-center justify-center">
            <button
              type="button"
              onClick={() => setPhotoViewerMode("profile")}
              aria-label="View profile photo"
              className="group relative w-full h-full rounded-full overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor"
            >
              <Image
                src={profileImage || logoPreview}
                unoptimized={Boolean(profileImage)}
                className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-90"
                alt={`${displayName} profile photo`}
                width={96}
                height={96}
              />
            </button>
            <input
              type="file"
              accept="image/*,video/*"
              ref={profileImgRef}
              className="hidden"
              onChange={handleProfileImageChange}
            />
            {profileData?.is_own_profile && (
              <button
                type="button"
                aria-label="Edit profile photo"
                onClick={(e) => {
                  e.stopPropagation();
                  profileImgRef.current?.click();
                }}
                className="absolute bottom-0 right-0 z-10 bg-primaryColor p-1 rounded-full cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
              >
                <EditeSquareIcon className="text-whiteColor" />
              </button>
            )}
          </div>
          {profileData?.is_own_profile && (
            <div className="flex gap-6 pt-2">
              <button
                type="button"
                aria-label="notify-open"
                onClick={() => setIsNotify(true)}
                className="cursor-pointer"
              >
                <PencileIcon />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-12 sm:mt-14 border-b border-borderColor pb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
              {displayName}
            </h4>
            <p className="text-grayColor1 text-sm">
              {profileData?.title || "Software Engineer at Betopia Group"}
            </p>
            <p className="text-grayColor1 text-sm">
              {profileData?.country || ""}
            </p>
            <div className="flex items-center gap-2.5 my-2 text-grayColor1">
              <GroupUserIcon />
              <p className="text-sm   line-clamp-3">
                {profileData?.total_connections || 0} Connection
              </p>
            </div>
          </div>
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center text-descriptionColor font-semibold gap-2">
              <MdWorkOutline size={22} />
              {!profileData?.is_own_profile &&
              !profileData?.current_position ? (
                <div>---</div>
              ) : profileData?.current_position ? (
                <p>
                  {profileData?.current_position?.company_name ||
                    profileData?.current_position?.name ||
                    "Software Engineer at Betopia Group"}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (existingExperiences.length > 0) {
                      const firstExp = existingExperiences[0];
                      setSelectedCompanyId(
                        firstExp?.company_id || firstExp?.company?.id || null,
                      );
                      setOpenSelectExperienceModal(true);
                    } else {
                      setOpenExperienceForm(true);
                    }
                  }}
                  className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-1.5! text-sm! px-2.5! `}
                >
                  <Plus className="h-4 w-4" />
                  Add Experience
                </button>
              )}
            </div>
            <div className="flex items-center text-descriptionColor font-semibold gap-1.5">
              <PiStudent size={24} className="" />

              {!profileData?.is_own_profile &&
              !profileData?.current_institute ? (
                <div>---</div>
              ) : profileData?.current_institute ? (
                <p>{profileData?.current_institute?.name}</p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (existingStudies.length > 0) {
                      const firstEdu = existingStudies[0];
                      setSelectedInstituteId(
                        firstEdu?.institution_id ||
                          firstEdu?.institution?.id ||
                          null,
                      );
                      setOpenSelectInstituteModal(true);
                    } else {
                      setOpenEducationForm(true);
                    }
                  }}
                  className={`${BUTTON_STYLES.primary} flex items-center gap-1 py-1.5! text-sm! px-2.5! `}
                >
                  <Plus className="h-4 w-4" />
                  Add Institute
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 lg:mt-5">
        <ProfileConnectionAction profileData={profileData} userId={userId} />
      </div>

      {photoViewerMode !== null && (
        <ProfilePhotoViewerDialog
          open={photoViewerMode !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setPhotoViewerMode(null);
          }}
          mode={photoViewerMode}
          onModeChange={setPhotoViewerMode}
          userName={displayName}
          profileSrc={profileImage || logoPreview}
          coverSrc={coverImage || coverPreview}
          hasCustomProfile={Boolean(profileImage)}
          hasCustomCover={Boolean(coverImage)}
        />
      )}

      {openSelectInstituteModal && (
        <RootDialog
          open={openSelectInstituteModal}
          setOpen={setOpenSelectInstituteModal}
          ariaLabel="Select Current Institute"
          className="sm:max-w-lg max-w-[92vw]"
        >
          <div className="p-6 space-y-5">
            <div className="space-y-1 pr-6">
              <h3 className="text-xl font-semibold text-headerColor">
                Select Current Institute
              </h3>
              <p className="text-sm text-grayColor1">
                Choose an institute from your saved education, or add a new one.
              </p>
            </div>
            <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
              {existingStudies.map((edu: any) => {
                const instId = edu?.institution_id || edu?.institution?.id;
                const instName =
                  edu?.institution?.name || edu?.institution_name || "Institute";
                const isSelected = selectedInstituteId === instId;
                return (
                  <label
                    key={edu.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                      isSelected
                        ? "border-primaryColor bg-primaryColor/5"
                        : "border-borderColor hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="currentInstituteOption"
                      checked={isSelected}
                      onChange={() => setSelectedInstituteId(instId)}
                      className="mt-1 h-4 w-4 accent-primaryColor"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-headerColor truncate">
                        {instName}
                      </p>
                      <p className="text-xs text-grayColor1 truncate mt-0.5">
                        {[edu.degree, edu.field_study].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-borderColor">
              <button
                type="button"
                onClick={() => {
                  setOpenSelectInstituteModal(false);
                  setOpenEducationForm(true);
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primaryColor hover:underline cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add New Education
              </button>
              <button
                type="button"
                disabled={!selectedInstituteId || isUpdatingCurrent}
                onClick={async () => {
                  if (!selectedInstituteId) return;
                  try {
                    await profileAboutUpdate({
                      current_institute_id: selectedInstituteId,
                    }).unwrap();
                    toast.success("Current institute updated!");
                    setOpenSelectInstituteModal(false);
                  } catch (err: any) {
                    toast.error(
                      err?.data?.message || "Failed to update current institute.",
                    );
                  }
                }}
                className="rounded-full bg-primaryColor px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 cursor-pointer transition-opacity"
              >
                {isUpdatingCurrent ? "Saving..." : "Set as Current"}
              </button>
            </div>
          </div>
        </RootDialog>
      )}

      {openSelectExperienceModal && (
        <RootDialog
          open={openSelectExperienceModal}
          setOpen={setOpenSelectExperienceModal}
          ariaLabel="Select Current Experience"
          className="sm:max-w-lg max-w-[92vw]"
        >
          <div className="p-6 space-y-5">
            <div className="space-y-1 pr-6">
              <h3 className="text-xl font-semibold text-headerColor">
                Select Current Experience
              </h3>
              <p className="text-sm text-grayColor1">
                Choose an organization from your saved experience, or add a new one.
              </p>
            </div>
            <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
              {existingExperiences.map((exp: any) => {
                const compId = exp?.company_id || exp?.company?.id;
                const compName =
                  exp?.company?.name || exp?.company_name || "Organization";
                const isSelected = selectedCompanyId === compId;
                return (
                  <label
                    key={exp.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                      isSelected
                        ? "border-primaryColor bg-primaryColor/5"
                        : "border-borderColor hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="currentExperienceOption"
                      checked={isSelected}
                      onChange={() => setSelectedCompanyId(compId)}
                      className="mt-1 h-4 w-4 accent-primaryColor"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-headerColor truncate">
                        {compName}
                      </p>
                      <p className="text-xs text-grayColor1 truncate mt-0.5">
                        {exp.title || "Role"}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-borderColor">
              <button
                type="button"
                onClick={() => {
                  setOpenSelectExperienceModal(false);
                  setOpenExperienceForm(true);
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primaryColor hover:underline cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add New Experience
              </button>
              <button
                type="button"
                disabled={!selectedCompanyId || isUpdatingCurrent}
                onClick={async () => {
                  if (!selectedCompanyId) return;
                  try {
                    await profileAboutUpdate({
                      current_position_id: selectedCompanyId,
                    }).unwrap();
                    toast.success("Current experience updated!");
                    setOpenSelectExperienceModal(false);
                  } catch (err: any) {
                    toast.error(
                      err?.data?.message || "Failed to update current experience.",
                    );
                  }
                }}
                className="rounded-full bg-primaryColor px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 cursor-pointer transition-opacity"
              >
                {isUpdatingCurrent ? "Saving..." : "Set as Current"}
              </button>
            </div>
          </div>
        </RootDialog>
      )}

      {openEducationForm && (
        <ProfileEducationForm
          open={openEducationForm}
          setOpen={setOpenEducationForm}
        />
      )}
      {openExperienceForm && (
        <ExpreanceAddFrom
          open={openExperienceForm}
          setOpen={setOpenExperienceForm}
        />
      )}
      {isNotify && (
        <ProfileUpdateForm
          profileData={profileData}
          open={isNotify}
          setOpen={setIsNotify}
        />
      )}
    </section>
  );
}

export default ProfileHeroSection;
