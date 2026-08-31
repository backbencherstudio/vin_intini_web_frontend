"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import { useTwoFactorEmailCodeVerifyMutation } from "@/feature/slice/admin/securitySettings";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface StepEmailCodeProps {
  onSuccess: (codes: string[]) => void;
  onClose: () => void;
}

export default function page({ onSuccess, onClose }: StepEmailCodeProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  console.log(email, "email============");

  const [twoFactorEmailCode, { isLoading }] =
    useTwoFactorEmailCodeVerifyMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        email: email,
        code: code,
      };
      const response = twoFactorEmailCode(payload).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-3">
      <h4 className="text-xl md:text-2xl font-semibold text-headerColor text-center">
        Enter the code you see on your authentication app
      </h4>

      <CustomInput
        type="text"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="xxx-xxx"
        maxLength={6}
        error={error}
        className="text-center tracking-widest text-lg"
      />

      {/* <button type="button" className="text-sm font-medium text-primaryColor">
        Resend Code
      </button> */}

      <div className="flex flex-col  gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-primaryColor cursor-pointer px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
        </button>
        <button>
          Use <span className="text-primaryColor">Backup codes</span>{" "}
        </button>
        <div className="text-grayColor1">
          Don’t have access device? Send code to{" "}
          <button className="text-descriptionColor cursor-pointer ">
            your recovery email
          </button>{" "}
        </div>
      </div>
    </form>
  );
}
