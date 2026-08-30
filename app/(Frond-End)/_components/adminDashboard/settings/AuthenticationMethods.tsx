"use client";

import { useGetSecurityOverviewQuery } from "@/feature/slice/admin/securitySettings";
import { Monitor, MoreHorizontal, Copy } from "lucide-react";
import { useState } from "react";
import RegenerateCode from "./2FactorAuthentication/RegenerateCode";
import CustomModal from "@/components/reusable/dashboard/CustomModal";
import RecoveryEmail from "./recoverymailSetup/RecoveryEmail";
import VerifyOtp from "./recoverymailSetup/VerifyOtp";
import Success from "./recoverymailSetup/Success";

export default function AuthenticationMethods() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);

  const [step, setStep] = useState(1);
  const {data, isLoading} = useGetSecurityOverviewQuery({});
  const securityData = data?.data || [];


  return (
  <div>
      <section className="h-full rounded-md border p-4">
      <h2 className="text-headerColor text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
        Authentication Method
      </h2>

      <div className="mt-5 space-y-5">

        {/* Authenticator App */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Monitor size={24} className="text-black" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
              Authenticator App
            </p>

            <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]">
              Use an authenticator app to generate codes.
            </p>
          </div>

          <span className="rounded-full border border-[#287F6E] px-2 py-1 text-[#287F6E] text-center text-[12px] font-semibold leading-[132%]">
            Primary
          </span>

          {/* <button type="button">
            <MoreHorizontal size={16} className="text-black" />
          </button> */}
        </div>

        {/* Backup Codes */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Monitor size={24} className="text-black" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
              Backup Codes
            </p>

            <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]">
             {securityData?.backup_codes_count || "N/A"}
            </p>
          </div>
           <button type="button" className="cursor-pointer" onClick={()=> setIsModalOpen(true)}>
            <MoreHorizontal size={16} className="text-black" />
          </button>

        </div>

        {/* Recovery Email */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Monitor size={24} className="text-black" />
          </div>

          <div className="min-w-0 flex-1" onClick={()=>{
            setStep(1);
            setRecoveryModalOpen(true);
          }}>
            <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]">
              Recovery Email
            </p>

            <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]">
              {securityData?.recovery_email || "N/A"}
            </p>
          </div>

          <span className="text-[9px] text-[#287F6E]">
            Verified
          </span>

          {/* <button type="button">
            <MoreHorizontal size={16} className="text-black" />
          </button> */}
        </div>

      </div>
    </section>

    <div>
  <CustomModal
   open={isModalOpen}
   onOpenChange={()=> setIsModalOpen(false)}  
   title="Generate Backup Codes"
   size="sm"
  >
       <RegenerateCode/>
  </CustomModal>

  <CustomModal
  open={recoveryModalOpen}
  onOpenChange={(open) => {
    setRecoveryModalOpen(open);
    if (!open) setStep(1);
  }}
  title={
    step === 1
      ? "Recovery Email"
      : step === 2
        ? "Verify OTP"
        : "Recovery Email"
  }
  size="sm"
>
  {step === 1 && (
    <RecoveryEmail
      onSuccess={() => setStep(2)}
    />
  )}

  {step === 2 && (
    <VerifyOtp
      onSuccess={() => setStep(3)}
    />
  )}

  {step === 3 && (
    <Success
      onClose={() => setIsModalOpen(false)}
    />
  )}
</CustomModal>
    </div>
  </div>
  );
}