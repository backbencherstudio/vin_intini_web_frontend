"use client";

import {
  NotificationOffIcon,
  NotificationOnIcon,
} from "@/public/svgIcons/Icons";
import { useForm } from "react-hook-form";

type NotificationForm = {
  notificationType: "all" | "off";
};

export default function GroupNotifySetting({setIsNotify}: {setIsNotify: (value: boolean) => void}) {
  const { register, handleSubmit } = useForm<NotificationForm>({
    defaultValues: {
      notificationType: "all",
    },
  });

  const onSubmit = (data: NotificationForm) => {
    console.log("Selected Notification Value:", data.notificationType);
    setIsNotify(false);
  };

  return (
    <div className=" p-4 md:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-headerColor">
            Manage Notification
          </h2>
          <hr className="mt-3 border-borderColor" />
        </div>
        <div className="space-y-5 py-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <NotificationOnIcon className="w-5 h-5 text-descriptionColor" />
              <span className="text-base text-descriptionColor font-medium">
                Send All Notification
              </span>
            </div>
            <input
              type="radio"
              value="all"
              {...register("notificationType")}
              className="w-5 h-5 accent-primaryColor cursor-pointer"
            />
          </label>

          {/* Turned off Notification */}
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <NotificationOffIcon className="w-5 h-5 text-descriptionColor" />
              <span className="text-base text-descriptionColor font-medium">
                Turned of Notification
              </span>
            </div>
            <input
              type="radio"
              value="off"
              {...register("notificationType")}
              className="w-5 h-5 accent-primaryColor cursor-pointer"
            />
          </label>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-primaryColor
            cursor-pointer text-white px-10 py-2.5 rounded-full font-semibold text-[16px] hover:bg-[#008c99] transition-all tracking-wide 
             active:scale-95 shadow-sm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
