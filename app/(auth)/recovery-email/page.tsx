"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { useTwoFactorRecoveryCodeSentEmailMutation } from "@/feature/slice/admin/securitySettings";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface StepEmailCodeProps {
  onSuccess: (codes: string[]) => void;
  onClose: () => void;
}

export default function page({ onSuccess, onClose }: StepEmailCodeProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [recoveryEmail, setRecoveryEmail] = useState(
    searchParams.get("recovery") || "",
  );
  const route = useRouter();

  const [twoFactorRecoveryCodeSentEmail, { isLoading }] =
    useTwoFactorRecoveryCodeSentEmailMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        email: email,
        recovery_email: code,
      };
      const response = await twoFactorRecoveryCodeSentEmail(payload).unwrap();
      toast.success(response?.message || "2FA verification successful!");
      route.push(`/email-verify-code?email=${email}`);
    } catch (error) {
      setError(error?.data?.message || "Invalid code. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-3">
      <div className="text-center pb-1">
        <h4 className="text-xl md:text-2xl leading-[130%] font-semibold text-headerColor text-center">
          Enter your recovery mail
        </h4>
        <h4 className="text-xl md:text-2xl leading-[130%] mt-1 font-semibold text-headerColor text-center">
          {recoveryEmail}
        </h4>
      </div>

      <CustomInput
        type="email"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="example@gmail.com"
        error={error}
        className={` tracking-widest text-lg ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {/* <button type="button" className="text-sm font-medium text-primaryColor">
        Resend Code
      </button> */}

      <div className="flex flex-col text-center  gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-primaryColor flex justify-center disabled:cursor-not-allowed text-center cursor-pointer px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
        </button>
        <div className="text-center">
          Use{" "}
          <Link
            href={`/two-factor?email=${email}`}
            className="text-primaryColor"
          >
            Authentication App
          </Link>{" "}
        </div>
      </div>
    </form>
  );
}
