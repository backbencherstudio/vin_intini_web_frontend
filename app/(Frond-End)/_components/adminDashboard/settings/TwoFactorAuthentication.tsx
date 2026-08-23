"use client";

import { LockKeyhole } from "lucide-react";
import AuthenticationMethods from "./AuthenticationMethods";
import { LockIcon } from "@/public/svgIcons/Icons";
import { AdLockIcon } from "@/public/svgIcons/AdminIcon";

interface TwoFactorAuthenticationProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export default function TwoFactorAuthentication({
  enabled,
  setEnabled,
}: TwoFactorAuthenticationProps) {
  const disable2FA = () => {
    setEnabled(false);
  };

  return (
    <section className="rounded-md  ">
      <h2 className="text-[#1D1F2C]  text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
        Two-Factor Authentication (2FA)
      </h2>

      <p className="mt-1  text-sm font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
        Add an extra layer of security to your account.
      </p>

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4">
       <div className="mt-5 border flex flex-col items-center gap-5 md:flex-row p-6 rounded-sm">
        <div className="flex h-50 w-50 shrink-0 items-center justify-center rounded-full ">
          <AdLockIcon
         
            className="text-primaryColor"
          />
        </div>

        <div className="flex-1">
          <p className="text-[#1D1F2C] text-[14px] font-semibold leading-[140%] tracking-[0.07px]
">
            Two-Factor Authentication is{" "}
            <span className="font-semibold text-primaryColor">
              {enabled ? "ON" : "OFF"}
            </span>
          </p>

          <p className="mt-1 text-[#777980] text-[14px] font-normal leading-[140%] tracking-[0.07px]
">
            When enabled, you&apos;ll be required to enter a
            verification code in addition to your password when
            logging in.
          </p>

          <button
            type="button"
            onClick={disable2FA}
            className="mt-4 h-8 rounded-md border border-[#F38B94] bg-[#FBD8DB] px-5 text-[14px] font-semibold text-redColor"
          >
            Disable 2FA
          </button>
        </div>
      </div>

      <div className="mt-5">
        <AuthenticationMethods/>
      </div>
   </div>
    </section>
  );
}