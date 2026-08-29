"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { useEnablePasswordMutation } from "@/feature/slice/admin/securitySettings";
import { useState } from "react";

interface StepPasswordProps {
  onSuccess: (data: { secret: string; qr_code_url: string }) => void; 
  onClose: () => void;
}
export default function StepPassword({ onSuccess, onClose }: StepPasswordProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const [enablePassword, { isLoading }] = useEnablePasswordMutation();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await enablePassword({ password }).unwrap();
    console.log("Full Response:", res);

   
    const secret = res?.secret || res?.data?.secret;
    const qr_code_url = res?.qr_code_url || res?.data?.qr_code_url;

    if (secret && qr_code_url) {
      onSuccess({
        secret,
        qr_code_url,
      });
    } else {
      setError("QR data not found. Please try again.");
    }
  } catch (err: any) {
    const message =
      err?.data?.message || "Something went wrong. Please try again.";
    setError(message);
  }
};

  return (
    <form onSubmit={handleSubmit} className="px-3">
      <p className="text-sm text-[#777980]">
        Please enter your password to continue enabling 2FA.
      </p>

      <div className="mt-3">
        <CustomInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={error}
        />

        <div className="w-full pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md w-full bg-primaryColor px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}