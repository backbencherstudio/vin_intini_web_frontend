"use client";

import ReusableTextarea from "@/components/reusable/InputFiled/TextAreaField";
import RootDialog from "@/components/reusable/RootDialog";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type ProfileAboutUpdateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialAbout?: string;
  onSave?: (about: string) => void;
};

type AboutFormValues = {
  about: string;
};

function ProfileAboutUpdateForm({
  open,
  setOpen,
  initialAbout = "",
  onSave,
}: ProfileAboutUpdateFormProps) {
  const { register, handleSubmit, watch, reset } = useForm<AboutFormValues>({
    defaultValues: {
      about: initialAbout,
    },
  });

  useEffect(() => {
    if (open) {
      reset({ about: initialAbout });
    }
  }, [open, initialAbout, reset]);

  const aboutValue = watch("about") || "";

  const onSubmit = (values: AboutFormValues) => {
    onSave?.(values.about);
    setOpen(false);
  };

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      aria-label="edit-about-dialog"
      className="sm:max-w-160 rounded-xl"
    >
      <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-5">
        <h2 className="text-base md:text-lg font-semibold leading-[1.1] text-headerColor ">
          Edit About
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <ReusableTextarea
            label="About"
            placeholder="What is the purpose of the group?"
            maxLength={2500}
            {...register("about")}
            className="min-h-44 w-full rounded-lg border border-borderColor bg-white px-3 py-2 text-base text-descriptionColor outline-none transition focus:ring-2! focus:ring-primaryColor/20!"
          />

          <p className="-mt-2 text-sm text-descriptionColor">
            {aboutValue.length}/2500
          </p>

          <div className="border-t border-borderColor pt-5">
            <div className="flex justify-center">
              <button
                type="submit"
                className="min-w-28 cursor-pointer rounded-full bg-primaryColor px-8 py-2 text-base font-semibold text-whiteColor transition-opacity hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </RootDialog>
  );
}

export default ProfileAboutUpdateForm;
