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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function readStoredChallengeToken(email: string, queryToken: string): string {
  if (queryToken) return queryToken;
  if (typeof window === "undefined") return "";
  try {
    const raw = sessionStorage.getItem("mu_2fa_challenge");
    if (!raw) return "";
    const parsed = JSON.parse(raw) as {
      email?: string;
      challenge_token?: string;
    };
    if (
      parsed?.challenge_token &&
      (!email || parsed?.email?.toLowerCase() === email.toLowerCase())
    ) {
      return parsed.challenge_token;
    }
  } catch {
    // ignore corrupted sessionStorage
  }
  return "";
}

export default function Page() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const [email] = useState(searchParams.get("email") || "");
  const queryChallenge = searchParams.get("challenge_token") || "";
  const [challengeToken, setChallengeToken] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const redirectParam = searchParams.get("redirect") || "";
  const [errorRecovery, setErrorRecovery] = useState("");
  const route = useRouter();
  const [twoFactorEmailCode, { isLoading }] =
    useTwoFactorEmailCodeVerifyMutation();
  const [twoFactorRecoveryEmail, { isLoading: isRecoveryLoading }] =
    useTwoFactorRecoveryEmailMutation();

  useEffect(() => {
    const resolved = readStoredChallengeToken(email, queryChallenge);
    setChallengeToken(resolved);
    if (resolved && typeof window !== "undefined") {
      sessionStorage.setItem(
        "mu_2fa_challenge",
        JSON.stringify({
          email: email.toLowerCase(),
          challenge_token: resolved,
        }),
      );
    }
    setIsHydrated(true);
  }, [email, queryChallenge]);

  const missingChallenge = isHydrated && (!email || !challengeToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeToken) {
      setError(
        "Your verification session has expired or is missing. Please sign in again.",
      );
      return;
    }

    try {
      const response = await twoFactorEmailCode({
        email,
        code: code.trim(),
        challenge_token: challengeToken,
      }).unwrap();

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("mu_2fa_challenge");
      }

      toast.success("2FA verification successful!");
      const token = response?.token || response?.data?.token;
      if (token) {
        await setToken(token);
      }
      const userRole = response?.user?.role || response?.data?.user?.role;
      const isOnboarded =
        response?.is_onboarding ??
        response?.data?.is_onboarding ??
        Boolean(response?.user?.profile || response?.data?.user?.profile);
      const target =
        userRole === "admin"
          ? redirectParam || "/dashboard"
          : !isOnboarded
            ? "/onboarding"
            : redirectParam || "/mu/home";
      route.push(target);
    } catch (err: unknown) {
      const errorObj = err as { status?: number; data?: { message?: string } };
      if (errorObj?.status === 403 || errorObj?.status === 429) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("mu_2fa_challenge");
        }
        setChallengeToken("");
      }
      setError(errorObj?.data?.message || "Invalid code. Please try again.");
      setErrorRecovery("");
    }
  };

  const handleEmailRecovery = async () => {
    try {
      const response = await twoFactorRecoveryEmail({ email }).unwrap();

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

      {missingChallenge && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-center text-sm text-amber-900">
          <p>
            Your 2FA sign-in session has expired or is missing. Please sign in
            again to continue.
          </p>
          <Link
            href="/login"
            className="mt-2 inline-block font-semibold text-primaryColor underline"
          >
            Back to Sign in
          </Link>
        </div>
      )}

      <CustomInput
        type="text"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="xxxxx-xxxxx"
        maxLength={10}
        disabled={missingChallenge}
        error={error}
        className={`text-center tracking-widest text-lg ${error ? "border-red-500" : "border-gray-300"}`}
      />

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading || missingChallenge}
          className="rounded-md disabled:cursor-not-allowed bg-primaryColor w-full flex justify-center text-center cursor-pointer px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
        </button>
        <div className="text-center">
          Use{" "}
          <Link
            href={`/two-factor?email=${encodeURIComponent(email)}${redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : ""}`}
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
            disabled={isRecoveryLoading || !email}
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
