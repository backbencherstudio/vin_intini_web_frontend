"use client";

import CustomInput from "@/components/reusable/dashboard/CustomInput";
import {
  useTwoFactorEmailCodeVerifyMutation,
  useTwoFactorRecoveryEmailMutation,
} from "@/feature/slice/admin/securitySettings";
import { setToken } from "@/lib/token";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const [email] = useState(searchParams.get("email") || "");
  const [challengeToken] = useState(searchParams.get("challenge_token") || "");
  const redirectParam = searchParams.get("redirect") || "";
  const [errorRecovery, setErrorRecovery] = useState("");
  const route = useRouter();
  const [twoFactorEmailCode, { isLoading }] =
    useTwoFactorEmailCodeVerifyMutation();
  const [twoFactorRecoveryEmail, { isLoading: isRecoveryLoading }] =
    useTwoFactorRecoveryEmailMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, string> = {
        email: email,
        code: code,
      };
      if (challengeToken) {
        payload.challenge_token = challengeToken;
      }
      const response = await twoFactorEmailCode(payload).unwrap();
      toast.success("2FA verification successful!");
      const token = response?.token || response?.data?.token;
      if (token) {
        await setToken(token);
      }
      const userRole = response?.user?.role || response?.data?.user?.role;
      const target = redirectParam || (userRole === "admin" ? "/dashboard" : "/mu/home");
      route.push(target);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      setError(errorObj?.data?.message || "Invalid code. Please try again.");
      setErrorRecovery("");
    }
  };

  const handleEmailRecovery = async () => {
    try {
      const payload = {
        email: email,
      };
      const response = await twoFactorRecoveryEmail(payload).unwrap();

      route.push(
        `/recovery-email?email=${encodeURIComponent(email)}&recovery=${encodeURIComponent(response?.masked_email || "")}${redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : ""}`,
      );
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      setErrorRecovery(
        errorObj?.data?.message ||
          "Failed to send recovery email. Please try again.",
      );
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-3">
      <h4 className="text-xl md:text-2xl font-semibold text-headerColor text-center">
        Enter the backup code that you saved before
      </h4>

      <CustomInput
        type="text"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="xxxxx-xxxxx"
        maxLength={10}
        error={error}
        className={`text-center tracking-widest text-lg ${error ? "border-red-500" : "border-gray-300"}`}
      />

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md disabled:cursor-not-allowed bg-primaryColor w-full flex justify-center text-center cursor-pointer px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
        </button>
        <div className="text-center">
          Use{" "}
          <Link
            href={`/two-factor?email=${encodeURIComponent(email)}${challengeToken ? `&challenge_token=${encodeURIComponent(challengeToken)}` : ""}${redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : ""}`}
            className="text-primaryColor"
          >
            Authentication App
          </Link>{" "}
        </div>
        <div className="text-grayColor1 text-center">
          Don’t have access device? Send code to{" "}
          <button
            type="button"
            className="text-primaryColor cursor-pointer"
            onClick={handleEmailRecovery}
            disabled={isRecoveryLoading}
          >
            your recovery email
          </button>{" "}
          {errorRecovery && (
            <p className="mt-1.5 text-xs text-red-500">{errorRecovery}</p>
          )}
        </div>
      </div>
    </form>
  );
}
